"use client"

import { bulkDeleteTransactionsAction } from "@/app/(app)/transactions/actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"

interface BulkActionsMenuProps {
  selectedIds: string[]
  onActionComplete?: () => void
}

export function BulkActionsMenu({ selectedIds, onActionComplete }: BulkActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    const confirmMessage =
      "Tem certeza que deseja excluir estas transações e todos os seus arquivos? Esta ação não pode ser desfeita."
    if (!confirm(confirmMessage)) return

    try {
      setIsLoading(true)
      const result = await bulkDeleteTransactionsAction(selectedIds)
      if (!result.success) {
        throw new Error(result.error)
      }
      onActionComplete?.()
    } catch (error) {
      console.error("Failed to delete transactions:", error)
      alert(`Falha ao excluir transações: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="destructive" className="min-w-48 gap-2" disabled={isLoading} onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
        Excluir {selectedIds.length} transações
      </Button>
    </div>
  )
}
