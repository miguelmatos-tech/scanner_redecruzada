import { prisma } from "../lib/db"
import { createUserDefaults } from "../models/defaults"

async function main() {
  const email = "miguel.matos@redecruzada.org.br"
  const name = "Miguel Matos"

  console.log(`⏳ Configurando admin para: ${email}...`)

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      role: "ADMIN_GERAL",
    },
    create: {
      email: email.toLowerCase(),
      name: name,
      role: "ADMIN_GERAL",
    },
  })

  console.log(`⏳ Criando configurações padrões para o usuário...`)
  await createUserDefaults(user.id)

  console.log(`✅ Usuário ${user.email} configurado com sucesso!`)
}

main()
  .catch((e) => {
    console.error("❌ Erro ao configurar admin:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
