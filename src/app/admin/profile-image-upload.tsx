"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { currentUrl: string };

export default function ProfileImageUpload({ currentUrl }: Props) {
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
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Choose a JPG, PNG or WebP image.");
      setFile(null);
      event.target.value = "";
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError("The profile image must be 5 MB or smaller.");
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
      const path = `avatars/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(path, file, { contentType: file.type, cacheControl: "3600", upsert: false });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("portfolio-assets").getPublicUrl(path);
      const { error: saveError } = await supabase
        .from("portfolio_profile")
        .update({ avatar_url: data.publicUrl, updated_at: new Date().toISOString() })
        .eq("id", 1);
      if (saveError) throw saveError;
      setMessage("Profile image uploaded and published.");
      setFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload the profile image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="asset-upload">
      <div className="asset-current">
        {currentUrl ? <Image src={currentUrl} alt="Current profile image" width={112} height={112} unoptimized/> : <div className="asset-placeholder">EK</div>}
        <div><strong>Profile photo</strong><p className="muted">{currentUrl ? "This image is shown in the homepage introduction." : "No profile image is set yet."}</p></div>
      </div>
      <label className="field">Upload a new profile photo (JPG, PNG or WebP, maximum 5 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseFile}/>
      </label>
      {file && <p className="muted">Selected: {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB</p>}
      {error && <p role="alert" className="upload-error">{error}</p>}
      {message && <p role="status" className="upload-success">{message}</p>}
      <button type="button" className="btn primary" disabled={!file || busy} onClick={upload}>{busy ? "Uploading…" : "Upload and publish photo"}</button>
    </div>
  );
}
