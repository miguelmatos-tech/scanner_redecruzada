"use server"

import { prisma } from "@/lib/db"
import { unlink } from "fs/promises"
import path from "path"
import { cache } from "react"
import { getTransactionById } from "./transactions"

export const getUnsortedFiles = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const where: any = { isReviewed: false }
  
  if (user?.role !== "ADMIN_GERAL") {
    if (user?.role === "ADMIN_UNIDADE" && user.unitId) {
      where.user = { unitId: user.unitId }
    } else {
      where.userId = userId
    }
  }

  return await prisma.file.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
  })
})

export const getUnsortedFilesCount = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const where: any = { isReviewed: false }
  
  if (user?.role !== "ADMIN_GERAL") {
    if (user?.role === "ADMIN_UNIDADE" && user.unitId) {
      where.user = { unitId: user.unitId }
    } else {
      where.userId = userId
    }
  }

  return await prisma.file.count({
    where,
  })
})

export const getFileById = cache(async (id: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const where: any = { id }
  
  if (user?.role !== "ADMIN_GERAL") {
    if (user?.role === "ADMIN_UNIDADE" && user.unitId) {
      where.user = { unitId: user.unitId }
    } else {
      where.userId = userId
    }
  }

  return await prisma.file.findFirst({
    where,
  })
})

export const getFilesByTransactionId = cache(async (id: string, userId: string) => {
  const transaction = await getTransactionById(id, userId)
  if (transaction && transaction.files) {
    return await prisma.file.findMany({
      where: {
        id: {
          in: transaction.files as string[],
        },
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })
  }
  return []
})

export const createFile = async (userId: string, data: any) => {
  return await prisma.file.create({
    data: {
      ...data,
      userId,
    },
  })
}

export const updateFile = async (id: string, userId: string, data: any) => {
  return await prisma.file.update({
    where: { id, userId },
    data,
  })
}

export const deleteFile = async (id: string, userId: string) => {
  const file = await getFileById(id, userId)
  if (!file) {
    return
  }

  try {
    const { fullPathForFile } = await import("@/lib/files")
    const { removeFile } = await import("@/lib/storage")
    const { getUserById } = await import("@/models/users")
    const u = await getUserById(userId)
    if (u) {
      await removeFile(fullPathForFile(u, file))
    }
  } catch (error) {
    console.error("Error deleting file:", error)
  }

  return await prisma.file.delete({
    where: { id, userId },
  })
}
