// app/api/send/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialisation de Resend avec la clé d'API (stockée dans ton fichier .env.local)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Validation basique côté serveur
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 },
      );
    }

    // Envoi de l'email via Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Utilise onboarding@resend.dev pour les tests
      to: ["founkengbavel@gmail.com"], // Ton adresse de réception
      subject: `[Portfolio] ${subject}`,
      replyTo: email, // Permet de répondre directement au visiteur en cliquant sur "Répondre"

      html: `
  <div style="background-color: #08091a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 24px; border: 1px solid rgba(255,255,255,0.07);">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.2); border-radius: 12px; color: #22d3ee; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">
        Nouveau Message Portfolio
      </div>
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin-top: 15px; margin-bottom: 0;">
        Travaillons <span style="color: #22d3ee;">ensemble</span>
      </h1>
    </div>

    <!-- Contenu principal -->
    <div style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 25px; border-radius: 16px; margin-bottom: 30px;">
      <p style="margin-top: 0; font-size: 14px;"><strong style="color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Expéditeur :</strong><br/><span style="color: #ffffff; font-weight: 600; font-size: 16px;">${name}</span></p>
      
      <p style="font-size: 14px;"><strong style="color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Adresse Email :</strong><br/><a href="mailto:${email}" style="color: #22d3ee; text-decoration: none;">${email}</a></p>
      
      <p style="font-size: 14px;"><strong style="color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Sujet :</strong><br/><span style="color: #e2e8f0;">${subject}</span></p>
      
      <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 20px 0;" />
      
      <p style="font-size: 14px; margin-bottom: 0;"><strong style="color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Message :</strong></p>
      <div style="color: #cbd5e1; font-size: 14px; line-height: 1.6; white-space: pre-wrap; background-color: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.02); margin-top: 8px;">${message}</div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
      <p style="color: #475569; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} fkbf — Conçu avec Next.js & Resend
      </p>
    </div>
  </div>
`,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: "Une erreur interne est survenue." },
      { status: 500 },
    );
  }
}
