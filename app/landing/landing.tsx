"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import config from "@/lib/config"
import { FileSearch, Layers, ShieldCheck, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      {/* Header */}
      <header className="py-4 px-6 md:px-12 bg-white border-b border-gray-100 fixed w-full z-50 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/256.png"
              alt="Rede Cruzada"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="text-xl font-bold text-[#004a99]">Rede Cruzada</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/enter">
              <Button variant="outline" className="rounded-full border-[#004a99] text-[#004a99] hover:bg-[#004a99] hover:text-white px-6">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative">
          {/* Decorative accents */}
          <div className="absolute top-10 -left-20 w-64 h-64 bg-[#f37021] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -right-20 w-80 h-80 bg-[#a0c33a] opacity-5 rounded-full blur-3xl" />

          <div className="inline-block px-4 py-1.5 rounded-full bg-[#f37021]/10 text-[#f37021] text-sm font-semibold mb-6">
            GESTÃO EFICIENTE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-[#004a99]">
            Scanner e Gestão de Documentos <br />
            <span className="text-gray-800 italic">Rede Cruzada</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl font-medium leading-relaxed">
            Digitalize notas fiscais, recibos e documentos com inteligência. 
            Organização automática para a prestação de contas das suas unidades.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-md justify-center">
            <Link href="/enter" className="w-full">
              <Button size="lg" className="w-full rounded-full bg-[#004a99] hover:bg-[#003366] text-white font-bold h-14 text-lg shadow-lg hover:shadow-xl transition-all">
                Acessar o Sistema
              </Button>
            </Link>
          </div>

          {/* Video/Image Preview Container */}
          <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
             <div className="absolute inset-0 bg-blue-900/5 z-10 pointer-events-none" />
             <Image 
               src="/landing/ai-scanner-big.webp" 
               alt="Scanner em Funcionamento" 
               width={1728} 
               height={1080} 
               priority 
               className="w-full h-auto"
             />
          </div>
        </div>
      </section>

      {/* Features - Objective and Visual */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Como funciona o Scanner?</h2>
            <div className="w-20 h-1.5 bg-[#f37021] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-none bg-blue-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#004a99] flex items-center justify-center mb-6">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#004a99]">Digitalização Instantânea</h3>
              <p className="text-gray-600 leading-relaxed">
                Basta carregar o PDF ou a foto da nota fiscal. O sistema identifica automaticamente 
                valores, datas e fornecedores, eliminando o erro humano.
              </p>
            </Card>

            <Card className="p-8 border-none bg-orange-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#f37021] flex items-center justify-center mb-6">
                <Layers className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#f37021]">Foco Total nas Unidades</h3>
              <p className="text-gray-600 leading-relaxed">
                Separe os lançamentos por unidade e projeto. Tenha uma visão detalhada 
                de cada centavo investido no impacto social das crianças.
              </p>
            </Card>

            <Card className="p-8 border-none bg-green-50/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#a0c33a] flex items-center justify-center mb-6">
                <ShieldCheck className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#50631d]">Segurança e Controle</h3>
              <p className="text-gray-600 leading-relaxed">
                Baseado em permissões rigorosas. Apenas gestores autorizados acessam os dados 
                financeiros, garantindo transparência e integridade.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Secondary Feature with Image */}
      <section className="py-20 px-6 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Análise Inteligente e <br />
              <span className="text-[#004a99]">Relatórios Automáticos</span>
            </h2>
            <p className="text-lg text-gray-600">
              Esqueça planilhas complexas. Nosso sistema analisa os documentos enviados e 
              organiza tudo para sua prestação de contas mensal de forma automatizada.
            </p>
            <ul className="space-y-4">
              {[
                "Reconhecimento de NF-e, NFS-e e Cupons",
                "Separação por categorias de gastos",
                "Busca inteligente por qualquer termo no documento",
                "Exportação prática para relatórios de prestação de contas"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white fill-current" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#004a99]/20 to-transparent blur-2xl rounded-full" />
            <div className="relative rounded-2xl overflow-hidden shadow-xl ring-8 ring-white">
              <Image 
                src="/landing/transactions.webp" 
                alt="Tabela de Transações" 
                width={1000} 
                height={640} 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-center md:text-left">
            <div className="flex justify-center md:justify-start items-center gap-3">
              <Image
                src="/logo/256.png"
                alt="Rede Cruzada"
                width={32}
                height={32}
                className="h-8 w-auto brightness-200"
              />
              <span className="text-lg font-bold">Rede Cruzada</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Transformando o futuro através da educação integral. <br />
              Tecnologia a serviço do impacto social.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 justify-center md:justify-end text-sm text-gray-400">
            <Link href={`mailto:${config.app.supportEmail}`} className="hover:text-white transition-colors">Contato</Link>
            <Link href="/docs/terms" className="hover:text-white transition-colors">Termos</Link>
            <Link href="/docs/privacy_policy" className="hover:text-white transition-colors">Privacidade</Link>
            <span className="text-gray-600">v{config.app.version}</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Rede Cruzada. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}
