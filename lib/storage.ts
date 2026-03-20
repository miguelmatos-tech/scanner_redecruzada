import { createClient } from "@supabase/supabase-js"
import { access, constants, mkdir, readFile, unlink, writeFile } from "fs/promises"
import path from "path"

const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
const BUCKET_NAME = process.env.SUPABASE_BUCKET_NAME || "uploads"

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
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, fileContent, {
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
  if (supabase) {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath)
    if (error || !data) {
      throw new Error(`Failed to download file from Supabase: ${filePath}`)
    }
    const arrayBuffer = await data.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } else {
    // Local fallback
    return await readFile(filePath)
  }
}

/**
 * Deletes a file.
 */
export async function removeFile(filePath: string) {
  if (supabase) {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath])
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
 * Gets a public or signed URL for a file.
 * Useful for images/previews sent to the frontend.
 */
export async function getFileUrl(filePath: string, expiresIn: number = 3600): Promise<string> {
  if (supabase) {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(filePath, expiresIn)
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
  if (supabase) {
    // A trick to see if a file exists without downloading it is to create a signed URL and see if it fails,
    // but a better way is to list files in that path.
    const dir = path.dirname(filePath)
    const fileName = path.basename(filePath)
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(dir === "." ? "" : dir, {
      search: fileName,
    })
    if (error || !data) return false
    return data.some((f) => f.name === fileName)
  } else {
    try {
      await access(filePath, constants.F_OK)
      return true
    } catch {
      return false
    }
  }
}
