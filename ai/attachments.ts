import { fullPathForFile } from "@/lib/files"
import { generateFilePreviews } from "@/lib/previews/generate"
import { File, User } from "@/prisma/client"
import { checkFileExists, downloadToTmp, getFileBuffer } from "@/lib/storage"

const MAX_PAGES_TO_ANALYZE = 4

export type AnalyzeAttachment = {
  filename: string
  contentType: string
  base64: string
}

export const loadAttachmentsForAI = async (user: User, file: File): Promise<AnalyzeAttachment[]> => {
  const fullFilePath = fullPathForFile(user, file)
  
  // First ensure the file exists in storage (Local or Supabase)
  const isFileExists = await checkFileExists(fullFilePath)
  if (!isFileExists) {
    throw new Error(`File not found in storage: ${file.path}`)
  }

  // Ensure file is on local disk (/tmp on Vercel) for preprocessing tools (sharp, pdf2pic)
  await downloadToTmp(fullFilePath, fullFilePath)

  const { contentType, previews } = await generateFilePreviews(user, fullFilePath, file.mimetype)

  return Promise.all(
    previews.slice(0, MAX_PAGES_TO_ANALYZE).map(async (preview) => ({
      filename: file.filename,
      contentType: contentType,
      base64: await loadFileAsBase64(preview),
    }))
  )
}

export const loadFileAsBase64 = async (filePath: string): Promise<string> => {
  const buffer = await getFileBuffer(filePath)
  return Buffer.from(buffer).toString("base64")
}
