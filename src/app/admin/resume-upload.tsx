"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { currentUrl: string };

export default function ResumeUpload({ currentUrl }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setError("");
    setMessage("");
    if (!selected) { setFile(null); return; }
    if (selected.type !== "application/pdf") {
      setError("Please select a PDF document.");
      setFile(null);
      event.target.value = "";
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("The CV must be 5 MB or smaller.");
      setFile(null);
      event.target.value = "";
      return;
    }
    setFile(selected);
  }

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const supabase = createClient();
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]+/g, "-");
      const path = `resume/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(path, file, { contentType: "application/pdf", cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      const { error: saveError } = await supabase
        .from("portfolio_profile")
        .update({ resume_url: data.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (saveError) throw saveError;
      setMessage("CV uploaded and published successfully.");
      setFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload the CV. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="resume-upload">
      <div className="resume-current">
        <div><strong>Public CV</strong><p className="muted">{currentUrl ? "A downloadable CV is currently linked to your portfolio." : "No CV has been uploaded yet."}</p></div>
        {currentUrl && <a className="btn secondary" href={currentUrl} target="_blank" rel="noreferrer">View current CV ↗</a>}
      </div>
      <label className="field">Upload a new CV (PDF, maximum 5 MB)
        <input type="file" accept="application/pdf,.pdf" onChange={chooseFile}/>
      </label>
      {file && <p className="muted">Selected: {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
      {error && <p role="alert" className="upload-error">{error}</p>}
      {message && <p role="status" className="upload-success">{message}</p>}
      <button type="button" className="btn primary" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload and publish CV"}</button>
    </div>
  );
}
