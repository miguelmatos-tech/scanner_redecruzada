import { createClient } from "@supabase/supabase-js"
import { prisma } from "../lib/db"
import { createUserDefaults } from "../models/defaults"
import config from "../lib/config"

async function setupYan() {
  const email = "yan.oliveira@redecruzada.org.br"
  const password = "12345678"
  const name = "Yan Oliveira"

  console.log(`⏳ Iniciando configuração para: ${email}...`)

  // 1. Initialize Supabase Admin
  const supabaseUrl = config.supabase.url || process.env.SUPABASE_URL || ""
  const supabaseKey = config.supabase.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env")
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  // 2. Create User in Supabase Auth
  console.log(`⏳ Criando usuário no Supabase Auth...`)
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  })

  if (authError) {
    if (authError.message.includes("already registered")) {
        console.log("ℹ️ Usuário já existe no Auth. Continuando...")
    } else {
        throw authError
    }
  } else {
    console.log(`✅ Usuário criado no Auth: ${authUser.user.id}`)
  }

  // 3. Create/Update User in Prisma DB
  console.log(`⏳ Criando registro do usuário no Banco de Dados...`)
  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      role: "ADMIN_GERAL",
      name: name
    },
    create: {
      email: email.toLowerCase(),
      name: name,
      role: "ADMIN_GERAL",
    },
  })

  // 4. Create Rules (Categories, Projects, Fields)
  console.log(`⏳ Inicializando regras (Categorias, Projetos e Campos)...`)
  await createUserDefaults(user.id)

  console.log(`✅ Configuração concluída com sucesso para ${user.email}!`)
}

setupYan()
  .catch((e) => {
    console.error("❌ Erro:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
