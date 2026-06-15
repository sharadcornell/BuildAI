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
  try {
    const { data, error } = await resend.emails.send({
      from: "BuildAI <onboarding@resend.dev>", // replace with contact@buildai.global once domain is verified in Resend
      to,
      subject,
      text,
    });
    // Resend returns errors in the payload rather than throwing — surface them
    // so a silently-dropped notification can't masquerade as a sent one.
    if (error) {
      console.error(`[email] Resend rejected "${subject}":`, error.message ?? error);
      return;
    }
    console.log(`[email] Resend accepted "${subject}" (id: ${data?.id ?? "unknown"})`);
  } catch (err) {
    // Never let an email failure break an already-saved lead.
    console.error(`[email] Resend threw for "${subject}":`, err instanceof Error ? err.message : err);
  }
}
