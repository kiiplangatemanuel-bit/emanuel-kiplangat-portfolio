"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  enquiry_type: z.enum(["Internship / employment","Project collaboration","Freelance enquiry","General"])
});

export async function submitEnquiry(formData: FormData) {
  const parsed = enquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    enquiry_type: formData.get("enquiry_type")
  });
  if (!parsed.success) return { ok: false, message: "Please check your details and try again." };
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) return { ok: true, message: "Thank you. Your message has been received." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("portfolio_enquiries").insert(parsed.data);
    if (error) throw error;
    return { ok: true, message: "Thanks for reaching out. Your message has been received." };
  } catch {
    return { ok: false, message: "The contact service is temporarily unavailable. Please email me directly." };
  }
}
