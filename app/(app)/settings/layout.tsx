import { SideNav } from "@/components/settings/side-nav"
import { Separator } from "@/components/ui/separator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Configurações",
  description: "Personalize suas configurações aqui",
}

const settingsCategories = [
  {
    title: "Geral",
    href: "/settings",
  },
  {
    title: "Perfil e Plano",
    href: "/settings/profile",
  },
  {
    title: "Dados da Organização",
    href: "/settings/business",
  },
  {
    title: "Configurações de IA",
    href: "/settings/llm",
  },
  {
    title: "Campos",
    href: "/settings/fields",
  },
  {
    title: "Categorias",
    href: "/settings/categories",
  },
  {
    title: "Projetos",
    href: "/settings/projects",
  },
  {
    title: "Moedas",
    href: "/settings/currencies",
  },
  {
    title: "Cópias de Segurança",
    href: "/settings/backups",
  },
  {
    title: "Zona de Perigo",
    href: "/settings/danger",
  },
]

import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (user.role === "USER") redirect("/unsorted")

  return (
    <>
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">Personalize suas configurações aqui</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SideNav items={settingsCategories} />
          </aside>
          <div className="flex w-full">{children}</div>
        </div>
      </div>
    </>
  )
}
