"use client"

import { formatBytes } from "@/lib/utils"
import { File } from "@/prisma/client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export function FilePreview({ file }: { file: File }) {
  const [isEnlarged, setIsEnlarged] = useState(false)

  const fileSize =
    file.metadata && typeof file.metadata === "object" && "size" in file.metadata ? Number(file.metadata.size) : 0

  const isPdf = file.mimetype === "application/pdf"
  const previewUrl = `/files/preview/${file.id}`

  return (
    <>
      <div className="flex flex-col gap-2 p-4 overflow-hidden">
        <div className="aspect-[3/4] relative group">
          {isPdf ? (
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full border-none rounded-lg pointer-events-none"
              title={file.filename}
            />
          ) : (
            <Image
              src={previewUrl}
              alt={file.filename}
              width={300}
              height={400}
              loading="lazy"
              className={`${
                isEnlarged
                  ? "fixed inset-0 z-50 m-auto w-screen h-screen object-contain cursor-zoom-out"
                  : "w-full h-full object-contain cursor-zoom-in"
              }`}
              onClick={() => setIsEnlarged(!isEnlarged)}
            />
          )}
          
          <button 
            onClick={() => setIsEnlarged(!isEnlarged)}
            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
          </button>

          {isEnlarged && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-10" onClick={() => setIsEnlarged(false)}>
               {isPdf ? (
                 <iframe
                   src={previewUrl}
                   className="w-full h-full max-w-5xl bg-white rounded-xl shadow-2xl"
                   title={file.filename}
                 />
               ) : (
                 <img
                   src={previewUrl}
                   alt={file.filename}
                   className="max-w-full max-h-full object-contain shadow-2xl"
                 />
               )}
               <button className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 mt-2 overflow-hidden">
          <h2 className="text-md underline font-semibold overflow-ellipsis">
            <Link href={`/files/download/${file.id}`}>{file.filename}</Link>
          </h2>
          <p className="text-sm overflow-ellipsis">
            <strong>Type:</strong> {file.mimetype}
          </p>
          {/* <p className="text-sm overflow-ellipsis">
            <strong>Uploaded:</strong> {format(file.createdAt, "MMM d, yyyy")}
          </p> */}
          <p className="text-sm">
            <strong>Size:</strong> {formatBytes(fileSize)}
          </p>
        </div>
      </div>
    </>
  )
}
