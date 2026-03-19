import { NewsletterWelcomeEmail } from "@/components/emails/newsletter-welcome-email"
import { OTPEmail } from "@/components/emails/otp-email"
import React from "react"
import { Resend } from "resend"
import config from "./config"

export const resend = new Resend(config.email.apiKey || "re_dummy_key_for_testing_purposes")

export async function sendOTPCodeEmail({ email, otp }: { email: string; otp: string }) {
  const html = React.createElement(OTPEmail, { otp })

  return await resend.emails.send({
    from: config.email.from,
    to: email,
    subject: "Seu código de verificação - Rede Cruzada",
    react: html,
  })
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const html = React.createElement(NewsletterWelcomeEmail)

  return await resend.emails.send({
    from: config.email.from,
    to: email,
    subject: "Bem-vindo à Rede Cruzada!",
    react: html,
  })
}
