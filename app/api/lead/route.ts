import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

export const runtime = "nodejs";

const LeadSchema = z.object({
  nome: z.string().min(2, "Nome muito curto").max(120),
  email: z.string().email("Email inválido"),
  empresa: z.string().min(2, "Empresa obrigatória").max(120),
  cargo: z.string().min(2, "Cargo obrigatório").max(120),
  dor: z.string().min(80, "Descreva sua dor com pelo menos 80 caracteres"),
  url_site: z.string().url().optional().or(z.literal("")),
  // honeypot — preenchido = bot, ignora
  _hp: z.string().max(0).optional(),
});

const RESEND_KEY = process.env.RESEND_API_KEY;
const FOUNDER_EMAIL = process.env.LEAD_INBOX_EMAIL || "r.almeidagustavo@gmail.com";
const FROM_EMAIL = process.env.LEAD_FROM_EMAIL || "leads@consultoriahorizon.com.br";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Body JSON inválido" },
      { status: 400 }
    );
  }

  const parsed = LeadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validação falhou",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Honeypot — bot detectado
  if (parsed.data._hp && parsed.data._hp.length > 0) {
    return NextResponse.json({ success: true, leadId: "hp-ignored" });
  }

  const lead = parsed.data;
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Log estruturado pra arquivo (Docker captura em stdout)
  console.log(
    JSON.stringify({
      ts: new Date().toISOString(),
      level: "info",
      msg: "lead_received",
      leadId,
      nome: lead.nome,
      email: lead.email,
      empresa: lead.empresa,
      cargo: lead.cargo,
      dor_chars: lead.dor.length,
      url_site: lead.url_site || null,
    })
  );

  // Envia email transacional via Resend
  if (!RESEND_KEY) {
    console.warn("RESEND_API_KEY ausente — skip envio email");
    return NextResponse.json({ success: true, leadId, note: "email-skipped-no-key" });
  }

  try {
    const resend = new Resend(RESEND_KEY);
    await resend.emails.send({
      from: `HorizonConsultoria <${FROM_EMAIL}>`,
      to: FOUNDER_EMAIL,
      replyTo: lead.email,
      subject: `[Lead] ${lead.empresa} — ${lead.nome} (${lead.cargo})`,
      text: [
        `Lead novo recebido em consultoriahorizon.com.br`,
        ``,
        `Lead ID: ${leadId}`,
        `Nome: ${lead.nome}`,
        `Email: ${lead.email}`,
        `Empresa: ${lead.empresa}`,
        `Cargo: ${lead.cargo}`,
        `URL do site: ${lead.url_site || "(não informado)"}`,
        ``,
        `Dor descrita:`,
        lead.dor,
        ``,
        `---`,
        `Enviado automaticamente pela LP. Reply-to aponta pro lead.`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("resend_send_failed", err);
    // Não falha o request — lead já está logado. Founder revisa logs.
    return NextResponse.json({ success: true, leadId, note: "email-failed-but-logged" });
  }

  return NextResponse.json({ success: true, leadId });
}
