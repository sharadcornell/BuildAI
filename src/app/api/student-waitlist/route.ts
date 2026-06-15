import { NextResponse } from "next/server";
import { studentWaitlistSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendLeadEmail } from "@/lib/email";

export async function POST(req: Request) {
  let data;
  try {
    data = studentWaitlistSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }
  if (data.hp) return NextResponse.json({ ok: true });

  const row = {
    full_name: data.fullName,
    college: data.college,
    year: data.year,
    branch: data.branch,
    email: data.email,
    phone: data.phone,
    portfolio: data.portfolio,
    reason: data.why,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("student_waitlist").insert(row);
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  } else {
    console.log("[student-waitlist] (no DB configured)", row);
  }
  await sendLeadEmail("New student waitlist signup", row);
  return NextResponse.json({ ok: true });
}
