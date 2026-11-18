"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitEnquiry(_previousState: { ok: boolean; message: string }, formData: FormData) {
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
    if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFICATION_EMAIL) {
      const safe = (text: string) => text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to: [process.env.CONTACT_NOTIFICATION_EMAIL],
          reply_to: email,
          subject: `Portfolio enquiry: ${subject}`,
          html: `<h2>New portfolio enquiry</h2><p><strong>From:</strong> ${safe(name)} (${safe(email)})</p><p><strong>Type:</strong> ${safe(enquiry_type)}</p><p><strong>Subject:</strong> ${safe(subject)}</p><p>${safe(message).replace(/\\n/g,"<br>")}</p>`
        })
      });
    }
    return { ok: true, message: "Thanks for reaching out. Your message has been received." };
  } catch {
    return { ok: false, message: "The contact service is temporarily unavailable. Please email me directly." };
  }
}
