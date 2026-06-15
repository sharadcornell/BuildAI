import { z } from "zod";

const consent = z.literal(true, {
  errorMap: () => ({ message: "Please accept to continue." }),
});
const honeypot = z.string().max(0, "Bot detected.").optional().default("");

export const pilotInquirySchema = z.object({
  college: z.string().min(2, "Required"),
  contactName: z.string().min(2, "Required"),
  role: z.enum(["TPO", "Dean", "HOD", "Principal", "Other"]),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),
  city: z.string().min(2, "Required"),
  students: z.string().min(1, "Required"),
  startTerm: z.string().optional().default(""),
  message: z.string().max(2000).optional().default(""),
  consent,
  hp: honeypot,
});
export type PilotInquiry = z.infer<typeof pilotInquirySchema>;

export const studentWaitlistSchema = z.object({
  fullName: z.string().min(2, "Required"),
  college: z.string().min(2, "Required"),
  year: z.enum(["2", "3", "4"]),
  branch: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional().default(""),
  portfolio: z.string().optional().default(""),
  why: z.string().max(1000).optional().default(""),
  consent,
  hp: honeypot,
});
export type StudentWaitlist = z.infer<typeof studentWaitlistSchema>;

export const mentorApplicationSchema = z.object({
  fullName: z.string().min(2, "Required"),
  company: z.string().min(2, "Required"),
  role: z.string().min(2, "Required"),
  yearsExp: z.string().min(1, "Required"),
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
  areas: z.string().optional().default(""),
  hoursPerWeek: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  note: z.string().max(1000).optional().default(""),
  consent,
  hp: honeypot,
});
export type MentorApplication = z.infer<typeof mentorApplicationSchema>;
