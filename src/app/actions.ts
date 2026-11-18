"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitEnquiry(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const enquiry_type = String(formData.get("enquiry_type") ?? "General");
  const allowed = ["Internship / employment","Project collaboration","Freelance enquiry","General"];
  if (name.length < 2 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || subject.length < 2 || subject.length > 160 || message.length < 10 || message.length > 5000 || !allowed.includes(enquiry_type)) {
    return { ok: false, message: "Please check your details and try again." };
  }
  if (String(formData.get("website") ?? "")) return { ok: true, message: "Thank you. Your message has been received." };
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("portfolio_enquiries").insert({name,email,subject,message,enquiry_type});
    if (error) throw error;
    return { ok: true, message: "Thanks for reaching out. Your message has been received." };
  } catch {
    return { ok: false, message: "The contact service is temporarily unavailable. Please email me directly." };
  }
}
