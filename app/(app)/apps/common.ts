import fs from "fs/promises"
import path from "path"

export type AppManifest = {
  name: string
  description: string
  icon: string
}

export async function getApps(): Promise<{ id: string; manifest: AppManifest }[]> {
  try {
    const appsDir = path.join(process.cwd(), "app", "(app)", "apps")
    let items: any[] = []
    
    try {
      items = await fs.readdir(appsDir, { withFileTypes: true })
    } catch (e) {
      console.warn("Could not read apps directory, falling back to static list:", e)
      // Fallback manual caso o readdir falhe na Vercel
      return [
        {
          id: "invoices",
          manifest: (await import("./invoices/manifest")).manifest
        }
      ]
    }

    const apps = await Promise.all(
      items
        .filter((item) => item.isDirectory() && !["invoices", "common.ts", "layout.tsx", "page.tsx", "context.tsx"].includes(item.name))
        .map(async (item) => {
          try {
            const manifestModule = await import(`./${item.name}/manifest`)
            return {
              id: item.name,
              manifest: manifestModule.manifest as AppManifest,
            }
          } catch (e) {
            console.error(`Failed to load manifest for app ${item.name}:`, e)
            return null
          }
        })
    )

    // Adiciona o app de invoices fixo + apps detectados
    const detectedApps = apps.filter((app): app is NonNullable<typeof app> => app !== null)
    const invoiceApp = {
      id: "invoices",
      manifest: (await import("./invoices/manifest")).manifest
    }

    return [invoiceApp, ...detectedApps.filter(a => a.id !== "invoices")]
  } catch (error) {
    console.error("Critical error in getApps:", error)
    return []
  }
}
