"use client";

import { useActionState } from "react";
import { submitEnquiry } from "@/app/actions";

const initialState = { ok: false, message: "" };
export default function ContactForm() {
  const [state, action, pending] = useActionState(submitEnquiry, initialState);
  return <form action={action} className="contact-form">
    <div className="form-grid">
      <label className="field">Your name<input name="name" autoComplete="name" required minLength={2} maxLength={120}/></label>
      <label className="field">Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label>
    </div>
    <label className="field">What would you like to discuss?
      <select name="enquiry_type" defaultValue="General"><option>General</option><option>Internship / employment</option><option>Project collaboration</option><option>Freelance enquiry</option></select>
    </label>
    <label className="field">Subject<input name="subject" required minLength={2} maxLength={160}/></label>
    <label className="field">Message<textarea name="message" required minLength={10} maxLength={5000} rows={5}/></label>
    <label className="contact-honeypot" aria-hidden="true">Leave this field empty<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <button className="btn primary" type="submit" disabled={pending}>{pending ? "Sending…" : "Send message"}</button>
    {state.message && <p className={state.ok ? "upload-success" : "upload-error"} role="status">{state.message}</p>}
  </form>;
}
