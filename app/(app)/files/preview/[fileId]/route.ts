import { getCurrentUser } from "@/lib/auth"
import { fullPathForFile } from "@/lib/files"
import { generateFilePreviews } from "@/lib/previews/generate"
import { getFileById } from "@/models/files"
import { NextResponse } from "next/server"
import path from "path"
import { encodeFilename } from "@/lib/utils"
import { checkFileExists, downloadToTmp, getFileBuffer } from "@/lib/storage"

export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params
  const user = await getCurrentUser()

  if (!fileId) {
    return new NextResponse("No fileId provided", { status: 400 })
  }

  const url = new URL(request.url)
  const page = parseInt(url.searchParams.get("page") || "1", 10)

  try {
    // Find file in database
    const file = await getFileById(fileId, user.id)

    if (!file || file.userId !== user.id) {
      return new NextResponse("File not found or does not belong to the user", { status: 404 })
    }

    const fullFilePath = fullPathForFile(user, file)
    
    // 1. Check if original file exists in storage
    const isFileExistsInStorage = await checkFileExists(fullFilePath)
    if (!isFileExistsInStorage) {
      return new NextResponse(`File requested was not found in storage: ${file.path}`, { status: 404 })
    }

    // 2. Ensure original file is available locally (/tmp) for preview generation (sharp, pdf2pic)
    await downloadToTmp(fullFilePath, fullFilePath)

    // 3. Generate previews (writes to /tmp/uploads/.../previews/)
    const { contentType, previews } = await generateFilePreviews(user, fullFilePath, file.mimetype)
    if (page > previews.length) {
      return new NextResponse("Page not found", { status: 404 })
    }
    const previewPath = previews[page - 1] || fullFilePath

    // 4. Read the preview file (will read from /tmp)
    const fileBuffer = await getFileBuffer(previewPath)

    // Return file with proper content type
    return new NextResponse(new Uint8Array(fileBuffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename*=${encodeFilename(path.basename(previewPath))}`,
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
