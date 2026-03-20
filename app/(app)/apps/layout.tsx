import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AppsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (user.role === "USER") redirect("/unsorted")

  return <div className="flex flex-col gap-4 p-4">{children}</div>
}
