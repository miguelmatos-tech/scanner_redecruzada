import { createClient } from "@supabase/supabase-js"
import { access, constants, mkdir, readFile, unlink, writeFile } from "fs/promises"
import path from "path"
import config from "./config"

import { FILE_UPLOAD_PATH } from "./files"

const supabaseUrl = config.supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = config.supabase.serviceRoleKey || ""

// 🛡️ DEFENSE: Ensure URL is valid before creating client to avoid Vercel build errors
const isValidUrl = (url: string) => url && (url.startsWith("http://") || url.startsWith("https://"))
const supabase = isValidUrl(supabaseUrl) && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const BUCKET_NAME = config.supabase.bucketName || "uploads"

/**
 * Standardizes a local file path into a consistent Supabase storage key.
 * Removes local root prefixes (e.g., C:\...\uploads or /tmp/uploads) 
 * and ensures forward slashes are used.
 */
function getStorageKey(filePath: string): string {
  // 1. Normalize slashes
  let normalizedPath = filePath.replace(/\\/g, "/")
  const normalizedUploadPath = FILE_UPLOAD_PATH.replace(/\\/g, "/")

  // 2. Strip the local upload root if present
  if (normalizedPath.startsWith(normalizedUploadPath)) {
    normalizedPath = normalizedPath.slice(normalizedUploadPath.length)
  }

  // 3. Remove leading slashes
  while (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.slice(1)
  }

  return normalizedPath
}

/**
 * Ensures a directory exists (used for local fallback).
 */
async function ensureDir(filePath: string) {
  const dirname = path.dirname(filePath)
  try {
    await access(dirname, constants.F_OK)
  } catch {
    await mkdir(dirname, { recursive: true })
  }
}

/**
 * Saves a file. Uses Supabase if configured, otherwise falls back to local fs.
 */
export async function saveFile(filePath: string, fileContent: Buffer | string | Uint8Array) {
  if (supabase) {
    // Standardize path for Supabase
    const storageKey = getStorageKey(filePath)
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(storageKey, fileContent, {
      upsert: true,
    })
    if (error) {
      console.error("Supabase Storage Error:", error)
      throw new Error("Failed to upload file to Supabase")
    }
  } else {
    // Local fallback
    await ensureDir(filePath)
    await writeFile(filePath, fileContent)
  }
}

/**
 * Reads a file. Uses Supabase if configured, otherwise falls back to local fs.
 */
export async function getFileBuffer(filePath: string): Promise<Buffer> {
  // 🛡️ HYBRID STORAGE PATCH: Check local disk first (useful for /tmp previews on Vercel)
  try {
    await access(filePath, constants.F_OK)
    const localBuffer = await readFile(filePath)
    return localBuffer
  } catch {
    // Fall through to Supabase if not found locally or if it's a relative storage path
  }

  if (supabase) {
    const storageKey = getStorageKey(filePath)
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(storageKey)
    if (error || !data) {
      throw new Error(`Failed to download file from Supabase: ${storageKey}`)
    }
    const arrayBuffer = await data.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } else {
    // Local fallback (already tried above, but for clarity)
    return await readFile(filePath)
  }
}

/**
 * Moves or renames a file.
 */
export async function moveFile(oldPath: string, newPath: string) {
  if (supabase) {
    const oldStorageKey = getStorageKey(oldPath)
    const newStorageKey = getStorageKey(newPath)
    const { error } = await supabase.storage.from(BUCKET_NAME).move(oldStorageKey, newStorageKey)
    if (error) {
      console.error("Supabase Move Error:", error)
      throw new Error(`Failed to move file in Supabase: ${oldStorageKey} -> ${newStorageKey}`)
    }
  } else {
    const { copyFile, unlink } = await import("fs/promises")
    await ensureDir(newPath)
    await copyFile(oldPath, newPath)
    await unlink(oldPath)
  }
}

/**
 * Deletes a file.
 */
export async function removeFile(filePath: string) {
  if (supabase) {
    const storageKey = getStorageKey(filePath)
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([storageKey])
    if (error) {
      console.error("Supabase Remove Error:", error)
    }
  } else {
    try {
      await unlink(filePath)
    } catch {
      // ignore
    }
  }
}

/**
 * Downloads a remote file to a local path (e.g. /tmp) for local processing.
 */
export async function downloadToTmp(storagePath: string, localPath: string) {
  if (supabase) {
    const buffer = await getFileBuffer(storagePath)
    await ensureDir(localPath)
    await writeFile(localPath, buffer)
  } else {
    // If already local, just ensure it exists at storagePath (which is the same as localPath usually)
    if (storagePath !== localPath) {
      const { copyFile } = await import("fs/promises")
      await ensureDir(localPath)
      await copyFile(storagePath, localPath)
    }
  }
}

/**
 * Gets a public or signed URL for a file.
 * Useful for images/previews sent to the frontend.
 */
export async function getFileUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
  if (supabase) {
    const storageKey = getStorageKey(filePath)
    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(storageKey, expiresIn)
    if (error || !data) {
      throw new Error("Failed to generate signed url")
    }
    return data.signedUrl
  } else {
    // Local fallback (we usually parse these via API routes like /files/preview/[id])
    return filePath
  }
}

/**
 * Checks if a file exists.
 */
export async function checkFileExists(filePath: string): Promise<boolean> {
  // Check local disk first
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    // Not found locally
  }

  if (supabase) {
    const storageKey = getStorageKey(filePath)
    const dir = path.dirname(storageKey)
    const fileName = path.basename(storageKey)
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(dir === "." ? "" : dir, {
      search: fileName,
    })
    if (error || !data) return false
    return data.some((f) => f.name === fileName)
  }

  return false
}
