"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.app_metadata?.role !== "portfolio_admin") {
        await supabase.auth.signOut();
        throw new Error("This account is not authorized to manage this portfolio.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in. Please try again.");
    } finally { setBusy(false); }
  }

  return <main className="admin-shell"><div className="container" style={{maxWidth:480}}>
    <Link href="/" className="muted">← Back to portfolio</Link>
    <div className="admin-panel" style={{marginTop:24}}>
      <div className="eyebrow">Private administration</div><h2 style={{marginTop:12}}>Sign in to manage your website</h2>
      <p className="muted">Only the portfolio administrator can access this area.</p>
      {params.get("error")==="not-authorized" && <p className="notice">This account does not have administrator access.</p>}
      {error && <p role="alert" style={{color:"#fca5a5"}}>{error}</p>}
      <form className="form" onSubmit={submit}>
        <label className="field">Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
        <label className="field">Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
        <button className="btn primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  </div></main>;
}