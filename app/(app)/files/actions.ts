"use server"

import { ActionState } from "@/lib/actions"
import { getCurrentUser, isSubscriptionExpired } from "@/lib/auth"
import {
  fullPathForFile,
  getDirectorySize,
  getUserUploadsDirectory,
  isEnoughStorageToUploadFile,
  safePathJoin,
  unsortedFilePath,
} from "@/lib/files"
import { createFile } from "@/models/files"
import { updateUser } from "@/models/users"
import { randomUUID } from "crypto"
import { revalidatePath } from "next/cache"
import { fileUploadRateLimiter } from "@/lib/rate-limit"
import { saveFile } from "@/lib/storage"

export async function uploadFilesAction(formData: FormData): Promise<ActionState<null>> {
  const user = await getCurrentUser()
  const files = formData.getAll("files") as File[]

  // 🛡️ SECURITY PATCH: Rate Limiting
  if (!fileUploadRateLimiter.check(user.id)) {
    return { success: false, error: "Too many upload requests. Please try again later." }
  }

  // Make sure upload dir exists
  const userUploadsDirectory = getUserUploadsDirectory(user)

  // Check limits
  const totalFileSize = files.reduce((acc, file) => acc + file.size, 0)
  if (!isEnoughStorageToUploadFile(user, totalFileSize)) {
    return { success: false, error: `Insufficient storage to upload these files` }
  }

  if (isSubscriptionExpired(user)) {
    return {
      success: false,
      error: "Your subscription has expired, please upgrade your account or buy new subscription plan",
    }
  }

  // Process each file
  const uploadedFiles = await Promise.all(
    files.map(async (file) => {
      if (!(file instanceof File)) {
        return { success: false, error: "Invalid file" }
      }

      // Save file to filesystem
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf", "application/xml", "text/xml"]
      if (!allowedMimeTypes.includes(file.type)) {
        return { success: false, error: `Invalid file type: ${file.type}. Allowed: images, PDF, XML.` }
      }

      const fileUuid = randomUUID()
      const relativeFilePath = unsortedFilePath(fileUuid, file.name)
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const fullFilePath = fullPathForFile(user, { path: relativeFilePath } as any)
      await saveFile(fullFilePath, buffer)

      // Create file record in database
      const fileRecord = await createFile(user.id, {
        id: fileUuid,
        filename: file.name,
        path: relativeFilePath,
        mimetype: file.type,
        metadata: {
          size: file.size,
          lastModified: file.lastModified,
        },
      })

      return fileRecord
    })
  )

  // Update storage used (we can optimize this later with a dedicated storage tool)
  try {
    const storageUsed = await getDirectorySize(getUserUploadsDirectory(user))
    await updateUser(user.id, { storageUsed })
  } catch (e) {
    console.error("Failed to update storage size:", e)
  }

  console.log("uploadedFiles", uploadedFiles)

  revalidatePath("/unsorted")

  return { success: true, error: null }
}
