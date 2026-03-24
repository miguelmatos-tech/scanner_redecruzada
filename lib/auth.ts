import config from "@/lib/config"
import { getSelfHostedUser, getUserByEmail, getUserById, SELF_HOSTED_USER } from "@/models/users"
import { User } from "@/prisma/client"
import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"

export type UserProfile = {
  id: string
  name: string
  email: string
  avatar?: string
  membershipPlan: string
  storageUsed: number
  storageLimit: number
  aiBalance: number
  role: string
  unitId: string | null
}

export async function getSession() {
  if (config.selfHosted.isEnabled) {
    const user = await getSelfHostedUser()
    return user ? { user } : null
  }

  const supabase = await createClient()
  if (!supabase) return null

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getCurrentUser(): Promise<User> {
  if (config.selfHosted.isEnabled) {
    const user = await getSelfHostedUser()
    if (user) return user
  }

  const session = await getSession()
  if (session && session.user) {
    const user = await getUserByEmail(session.user.email!)
    if (user) {
      return user
    }
  }

  // No session or user found
  redirect(config.auth.loginUrl)
}

export function isSubscriptionExpired(user: User) {
  if (config.selfHosted.isEnabled || user.role === "ADMIN_GERAL") {
    return false
  }
  return user.membershipExpiresAt && user.membershipExpiresAt < new Date()
}

export function isAiBalanceExhausted(user: User) {
  if (config.selfHosted.isEnabled || user.role === "ADMIN_GERAL") {
    return false
  }
  return user.aiBalance <= 0
}

export function isAdmin(user: User) {
  return user.role === "ADMIN_GERAL"
}

export function isUnitAdmin(user: User, unitId?: string | null) {
  if (isAdmin(user)) return true
  if (user.role === "ADMIN_UNIDADE" && user.unitId && user.unitId === unitId) return true
  return false
}
