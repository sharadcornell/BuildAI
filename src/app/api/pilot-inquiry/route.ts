import { NextResponse } from "next/server";
import { pilotInquirySchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendLeadEmail } from "@/lib/email";

export async function POST(req: Request) {
  let data;
  try {
    data = pilotInquirySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }
  if (data.hp) return NextResponse.json({ ok: true }); // honeypot tripped

  const row = {
    college: data.college,
    contact_name: data.contactName,
    role: data.role,
    email: data.email,
    phone: data.phone,
    city: data.city,
    students_estimate: data.students,
    start_term: data.startTerm,
    message: data.message,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("pilot_inquiries").insert(row);
    if (error) {
      console.error("[pilot-inquiry] insert failed:", error.message);
      return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
    }
  } else {
    console.log("[pilot-inquiry] (no DB configured)", row);
  }
  await sendLeadEmail("New pilot inquiry — " + data.college, row);
  return NextResponse.json({ ok: true });
}
