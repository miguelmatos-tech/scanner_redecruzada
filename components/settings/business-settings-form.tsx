"use client"

import { saveProfileAction } from "@/app/(app)/settings/actions"
import { FormError } from "@/components/forms/error"
import { FormAvatar, FormInput, FormTextarea } from "@/components/forms/simple"
import { Button } from "@/components/ui/button"
import { User } from "@/prisma/client"
import { CircleCheckBig } from "lucide-react"
import { useActionState } from "react"

export default function BusinessSettingsForm({ user }: { user: User }) {
  const [saveState, saveAction, pending] = useActionState(saveProfileAction, null)

  return (
    <div>
      <form action={saveAction} className="space-y-4">
        <FormInput
          title="Nome da Organização"
          name="businessName"
          placeholder="Ex: Rede Cruzada"
          defaultValue={user.businessName ?? ""}
        />

        <FormTextarea
          title="Endereço"
          name="businessAddress"
          placeholder="Rua, Número, Cidade, Estado, CEP, CNPJ"
          defaultValue={user.businessAddress ?? ""}
        />

        <FormTextarea
          title="Dados Bancários"
          name="businessBankDetails"
          placeholder="Banco, Agência, Conta, Chave PIX, etc."
          defaultValue={user.businessBankDetails ?? ""}
        />

        <FormAvatar
          title="Logo da Organização"
          name="businessLogo"
          className="w-52 h-52"
          defaultValue={user.businessLogo ?? ""}
        />

        <div className="flex flex-row items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Salvando..." : "Salvar"}
          </Button>
          {saveState?.success && (
            <p className="text-green-500 flex flex-row items-center gap-2">
              <CircleCheckBig />
              Salvo!
            </p>
          )}
        </div>

        {saveState?.error && <FormError>{saveState.error}</FormError>}
      </form>
    </div>
  )
}
