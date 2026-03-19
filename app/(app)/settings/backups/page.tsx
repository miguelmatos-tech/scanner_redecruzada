"use client"

import { FormError } from "@/components/forms/error"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useDownload } from "@/hooks/use-download"
import { useProgress } from "@/hooks/use-progress"
import { Download, Loader2 } from "lucide-react"
import { useActionState } from "react"
import { restoreBackupAction } from "./actions"

export default function BackupSettingsPage() {
  const [restoreState, restoreBackup, restorePending] = useActionState(restoreBackupAction, null)

  const { isLoading, startProgress, progress } = useProgress({
    onError: (error) => {
      console.error("Backup progress error:", error)
    },
  })

  const { download, isDownloading } = useDownload({
    onError: (error) => {
      console.error("Download error:", error)
    },
  })

  const handleDownload = async () => {
    try {
      const progressId = await startProgress("backup")
      const downloadUrl = `/settings/backups/data?progressId=${progressId || ""}`
      await download(downloadUrl, "redecruzada-backup.zip")
    } catch (error) {
      console.error("Failed to start backup:", error)
    }
  }

  return (
    <div className="container flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Baixar backup</h1>
        <div className="flex flex-row gap-4">
          <Button onClick={handleDownload} disabled={isLoading || isDownloading}>
            {isLoading ? (
              progress?.current ? (
                `Arquivando ${progress.current}/${progress.total} arquivos`
              ) : (
                "Preparando backup. Não feche a página..."
              )
            ) : isDownloading ? (
              "Arquivo criado. Baixando..."
            ) : (
              <>
                <Download className="mr-2" /> Baixar Arquivo de Dados
              </>
            )}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground max-w-xl">
          Dentro do arquivo você encontrará todos os uploads, além de arquivos JSON para transações, categorias,
          projetos, campos, moedas e configurações. Você pode visualizar, editar ou migrar seus dados para outro serviço.
        </div>
      </div>

      <Card className="flex flex-col gap-2 mt-16 p-5 bg-red-100 max-w-xl">
        <h2 className="text-xl font-semibold">Restaurar de um backup</h2>
        <p className="text-sm text-muted-foreground">
          ⚠️ Esta ação é irreversível. Restaurar um backup excluirá todos os dados existentes do seu banco de dados
          atual e removerá todos os arquivos enviados. Tenha cuidado e faça um backup primeiro!
        </p>
        <form action={restoreBackup}>
          <div className="flex flex-col gap-4 pt-4">
            <label>
              <input type="file" name="file" required />
            </label>
            <label className="flex flex-row gap-2 items-center">
              <input type="checkbox" name="removeExistingData" required />
              <span className="text-red-500">Eu entendo que isso excluirá permanentemente todos os dados existentes</span>
            </label>
            <Button type="submit" variant="destructive" disabled={restorePending}>
              {restorePending ? (
                <>
                  <Loader2 className="animate-spin" /> Restaurando do backup... (pode demorar)
                </>
              ) : (
                "Restaurar do backup"
              )}
            </Button>
          </div>
        </form>
        {restoreState?.error && <FormError>{restoreState.error}</FormError>}
      </Card>

      {restoreState?.success && (
        <Card className="flex flex-col gap-2 p-5 bg-green-100 max-w-xl">
          <h2 className="text-xl font-semibold">Backup restaurado com sucesso</h2>
          <p className="text-sm text-muted-foreground">Você já pode continuar usando o aplicativo. Estatísticas da importação:</p>
          <ul className="list-disc list-inside">
            {Object.entries(restoreState.data?.counters || {}).map(([key, value]) => (
              <li key={key}>
                <span className="font-bold">{key}</span>: {value} itens
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
