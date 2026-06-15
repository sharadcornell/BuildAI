import { Resend } from "resend";

/** Sends a lead notification. No-ops (logs) if Resend is not configured yet. */
export async function sendLeadEmail(
  subject: string,
  payload: Record<string, unknown>,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_TO;
  if (!apiKey || !to) {
    console.warn(`[email] Resend not configured — skipping "${subject}"`);
    return;
  }
  const text = Object.entries(payload)
    .map(([k, v]) => `${k}: ${String(v ?? "")}`)
    .join("\n");
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: "BuildAI <onboarding@resend.dev>", // replace with contact@buildai.global once domain is verified in Resend
    to,
    subject,
    text,
  });
}
