import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { ColoredText } from "@/components/ui/colored-text"
import { getCurrentUser } from "@/lib/auth"
import { getSettings, updateSettings } from "@/models/settings"
import { Banknote, ChartBarStacked, FolderOpenDot, Key, TextCursorInput, X } from "lucide-react"
import { revalidatePath } from "next/cache"
import Image from "next/image"
import Link from "next/link"

export async function WelcomeWidget() {
  const user = await getCurrentUser()
  const settings = await getSettings(user.id)

  return (
    <Card className="flex flex-col lg:flex-row items-start gap-10 p-10 w-full">
      <Image src="/logo/1024.png" alt="Logo" width={256} height={256} className="w-64 h-64" />
      <div className="flex flex-col">
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            <ColoredText>Bem-vindo à Rede Cruzada 👋</ColoredText>
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={async () => {
              "use server"
              await updateSettings(user.id, "is_welcome_message_hidden", "true")
              revalidatePath("/")
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
        <CardDescription className="mt-5">
          <p className="mb-3">
            Sou seu assistente inteligente de notas fiscais e recibos. Utilizo Inteligência Artificial
            para automatizar a leitura e organização dos seus documentos financeiros. Veja o que posso fazer:
          </p>
          <ul className="mb-5 list-disc pl-5 space-y-1">
            <li>
              <strong>Envie uma foto ou PDF</strong> e eu vou reconhecer, categorizar e salvar como uma transação
              para a sua prestação de contas.
            </li>
            <li>
              Posso <strong>converter moedas automaticamente</strong> e buscar taxas de câmbio históricas.
            </li>
            <li>
              <strong>Notas Fiscais em XML</strong> são processadas instantaneamente sem custo de IA.
            </li>
            <li>
              Todos os <strong>prompts de IA são configuráveis</strong>: para campos, categorias e projetos.
              Vá em Configurações e altere como preferir.
            </li>
            <li>
              Os dados são salvos em um <strong>banco de dados seguro</strong> e podem ser exportados para CSV e arquivos ZIP.
            </li>
            <li>
              Você pode <strong>criar seus próprios campos</strong> para análise e eles serão incluídos
              na exportação CSV para sua prestação de contas.
            </li>
          </ul>
          <p className="mb-3">
            Embora eu economize muito tempo na categorização de transações e geração de relatórios, 
            ainda recomendo que os resultados sejam revisados pela equipe administrativa antes da
            prestação de contas final!
          </p>
        </CardDescription>
        <div className="flex flex-wrap gap-2 mt-8">
          {settings.openai_api_key === "" && (
            <Link href="/settings/llm">
              <Button>
                <Key className="h-4 w-4" />
                Configure sua chave de IA aqui
              </Button>
            </Link>
          )}
          <Link href="/settings">
            <Button variant="outline">
              <Banknote className="h-4 w-4" />
              Moeda Padrão: {settings.default_currency}
            </Button>
          </Link>
          <Link href="/settings/categories">
            <Button variant="outline">
              <ChartBarStacked className="h-4 w-4" />
              Categorias
            </Button>
          </Link>
          <Link href="/settings/projects">
            <Button variant="outline">
              <FolderOpenDot className="h-4 w-4" />
              Projetos
            </Button>
          </Link>
          <Link href="/settings/fields">
            <Button variant="outline">
              <TextCursorInput className="h-4 w-4" />
              Campos Personalizados
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

