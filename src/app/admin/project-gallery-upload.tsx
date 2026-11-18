"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = { projectId: string; currentUrls: string[]; currentCoverUrl: string };

export default function ProjectGalleryUpload({projectId,currentUrls,currentCoverUrl}:Props){
  const router=useRouter();
  const [files,setFiles]=useState<File[]>([]);
  const [urls,setUrls]=useState(currentUrls);
  const [coverUrl,setCoverUrl]=useState(currentCoverUrl);
  const [coverFile,setCoverFile]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  function chooseCover(event:ChangeEvent<HTMLInputElement>){
    const selected=event.target.files?.[0]??null;
    setError("");setMessage("");
    if(selected&&(!["image/jpeg","image/png","image/webp"].includes(selected.type)||selected.size>5*1024*1024)){
      setError("Choose a JPG, PNG or WebP cover image no larger than 5 MB.");setCoverFile(null);event.target.value="";return;
    }
    setCoverFile(selected);
  }
  async function uploadCover(){
    if(!coverFile)return;
    setBusy(true);setError("");setMessage("");
    try{
      const supabase=createClient();
      const safe=coverFile.name.toLowerCase().replace(/[^a-z0-9.-]+/g,"-");
      const path=`projects/${projectId}/cover-${Date.now()}-${crypto.randomUUID()}-${safe}`;
      const {error:uploadError}=await supabase.storage.from("portfolio-assets").upload(path,coverFile,{contentType:coverFile.type,cacheControl:"3600",upsert:false});
      if(uploadError)throw uploadError;
      const publicUrl=supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
      const {error:saveError}=await supabase.from("portfolio_projects").update({image_url:publicUrl,updated_at:new Date().toISOString()}).eq("id",projectId);
      if(saveError)throw saveError;
      setCoverUrl(publicUrl);setCoverFile(null);setMessage("Project cover image uploaded and saved.");router.refresh();
    }catch(err){setError(err instanceof Error?err.message:"Unable to upload project cover image.");}
    finally{setBusy(false);}
  }
  function choose(event:ChangeEvent<HTMLInputElement>){
    const selected=Array.from(event.target.files??[]);
    setError("");setMessage("");
    const invalid=selected.find(file=>!["image/jpeg","image/png","image/webp"].includes(file.type)||file.size>5*1024*1024);
    if(invalid){setError("Choose JPG, PNG or WebP screenshots, each no larger than 5 MB.");setFiles([]);event.target.value="";return;}
    setFiles(selected);
  }
  async function upload(){
    if(!files.length)return;
    setBusy(true);setError("");setMessage("");
    try{
      const supabase=createClient();
      const uploaded:string[]=[];
      for(const file of files){
        const safe=file.name.toLowerCase().replace(/[^a-z0-9.-]+/g,"-");
        const path=`projects/${projectId}/${Date.now()}-${crypto.randomUUID()}-${safe}`;
        const {error:uploadError}=await supabase.storage.from("portfolio-assets").upload(path,file,{contentType:file.type,cacheControl:"3600",upsert:false});
        if(uploadError)throw uploadError;
        uploaded.push(supabase.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl);
      }
      const next=[...urls,...uploaded];
      const update:Record<string,unknown>={gallery_urls:next,updated_at:new Date().toISOString()};
      if(!currentCoverUrl&&uploaded[0])update.image_url=uploaded[0];
      const {error:saveError}=await supabase.from("portfolio_projects").update(update).eq("id",projectId);
      if(saveError)throw saveError;
      setUrls(next);setFiles([]);setMessage(`${uploaded.length} screenshot(s) uploaded and saved.`);
      router.refresh();
    }catch(err){setError(err instanceof Error?err.message:"Unable to upload project screenshots.");}
    finally{setBusy(false);}
  }
  return <div className="asset-upload project-gallery-upload">
    <strong>Project screenshots</strong>
    <p className="muted">Upload JPG, PNG or WebP files (maximum 5 MB each). The first uploaded image also becomes the cover if no cover is set.</p>
    {urls.length>0&&<div className="project-upload-preview">{urls.map((url,index)=><div key={url+index}><Image src={url} alt={`Project screenshot ${index+1}`} width={180} height={112} unoptimized/><span>Screenshot {index+1}</span></div>)}</div>}
    <label className="field">Choose screenshots<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={choose}/></label>
    {files.length>0&&<p className="muted">{files.length} file(s) selected.</p>}
    {error&&<p role="alert" className="upload-error">{error}</p>}
    {message&&<p role="status" className="upload-success">{message}</p>}
    <button type="button" className="btn primary" disabled={!files.length||busy} onClick={upload}>{busy?"Uploading…":"Upload screenshots"}</button>
  </div>;
}
