import config from "@/lib/config"
import type { Metadata, Viewport } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    template: "%s | Rede Cruzada",
    default: config.app.title,
  },
  description: config.app.description,
  icons: {
    icon: "/logo/256.png",
    shortcut: "/logo/256.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(config.app.baseURL),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: config.app.baseURL,
    title: config.app.title,
    description: config.app.description,
    siteName: config.app.title,
  },
  twitter: {
    card: "summary_large_image",
    title: config.app.title,
    description: config.app.description,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#001A5E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.className} min-h-screen bg-white antialiased`}>{children}</body>
    </html>
  )
}
