"use client"

import { FormError } from "@/components/forms/error"
import { FormInput } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function LoginForm({ defaultEmail }: { defaultEmail?: string }) {
  const [email, setEmail] = useState(defaultEmail || "")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        if (signInError.message === "Invalid login credentials") {
          setError("E-mail ou senha inválidos")
        } else {
          setError(signInError.message || "Erro ao fazer login")
        }
        return
      }

      // Check for user existence in private table (via public schema) if needed
      // But for now, session helper in middleware protects routes.
      
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido ao tentar logar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full">
      <FormInput
        title="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
        placeholder="digite seu e-mail"
      />

      <FormInput
        title="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
        placeholder="digite sua senha"
      />

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>

      {error && <FormError className="text-center">{error}</FormError>}
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        Acesso restrito para administradores autorizados.
      </p>
    </form>
  )
}
