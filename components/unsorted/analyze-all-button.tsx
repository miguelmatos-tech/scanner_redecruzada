"use client"

import { Button } from "@/components/ui/button"
import { Save, Swords, Loader2 } from "lucide-react"
import { useState } from "react"
import { analyzeAllFilesAction } from "@/app/(app)/unsorted/actions"
import { toast } from "sonner"

export function AnalyzeAllButton({ 
  fileIds, 
  settings, 
  fields, 
  categories, 
  projects 
}: { 
  fileIds: string[], 
  settings: any, 
  fields: any[], 
  categories: any[], 
  projects: any[] 
}) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true)
    toast.info("Iniciando análise em massa de alta performance...")
    
    try {
      const result = await analyzeAllFilesAction(fileIds, settings, fields, categories, projects)
      if (result.success) {
        toast.success("Análise concluída com sucesso!")
        window.location.reload()
      } else {
        toast.error("Erro na análise: " + result.error)
      }
    } catch (error) {
      toast.error("Erro inesperado durante a análise")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSaveAll = () => {
    if (typeof document !== "undefined") {
      document.querySelectorAll("button[data-save-button]").forEach((button) => {
        ;(button as HTMLButtonElement).click()
      })
    }
  }

  return (
    <div className="flex flex-row flex-wrap gap-2 justify-end">
      <Button variant="outline" className="flex items-center gap-2" onClick={handleSaveAll} disabled={isAnalyzing}>
        <Save className="h-4 w-4" />
        Salvar tudo
      </Button>
      <Button 
        className="flex items-center gap-2" 
        onClick={handleAnalyzeAll} 
        disabled={isAnalyzing || fileIds.length === 0}
      >
        {isAnalyzing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Swords className="h-4 w-4" />
        )}
        {isAnalyzing ? "Analisando em massa..." : "Analisar tudo (Turbo)"}
      </Button>
    </div>
  )
}
