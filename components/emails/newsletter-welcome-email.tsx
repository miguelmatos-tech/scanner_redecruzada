import React from "react"
import { EmailLayout } from "./email-layout"

export const NewsletterWelcomeEmail: React.FC = () => (
  <EmailLayout preview="Bem-vindo à Rede Cruzada!">
    <h2 style={{ color: "#4f46e5" }}>👋 Bem-vindo à Rede Cruzada!</h2>

    <p style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
      Obrigado por se inscrever para receber nossas atualizações. Manteremos você informado sobre:
    </p>
    <ul
      style={{
        paddingLeft: "20px",
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#333",
      }}
    >
      <li>Novas funcionalidades e melhorias</li>
      <li>Nossos planos e cronogramas</li>
      <li>Atualizações sobre o sistema</li>
    </ul>
    <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
      <p style={{ fontSize: "16px", color: "#333" }}>
        Atenciosamente,
        <br />
        Equipe Rede Cruzada
      </p>
    </div>
  </EmailLayout>
)

