import { NextResponse } from "next/server";
import { mentorApplicationSchema } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { sendLeadEmail } from "@/lib/email";

export async function POST(req: Request) {
  let data;
  try {
    data = mentorApplicationSchema.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });
  }
  if (data.hp) return NextResponse.json({ ok: true });

  const row = {
    full_name: data.fullName,
    company: data.company,
    role: data.role,
    years_exp: data.yearsExp,
    linkedin: data.linkedin,
    github: data.github,
    areas: data.areas,
    hours_per_week: data.hoursPerWeek,
    email: data.email,
    note: data.note,
  };

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { error } = await supabase.from("mentor_applications").insert(row);
    if (error) {
      console.error("[mentor-application] insert failed:", error.message);
      return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });
    }
  } else {
    console.log("[mentor-application] (no DB configured)", row);
  }
  await sendLeadEmail("New mentor application — " + data.fullName, row);
  return NextResponse.json({ ok: true });
}
