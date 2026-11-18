"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

const tableByKind = {
  experience: "portfolio_experience",
  certification: "portfolio_certifications",
  post: "portfolio_posts",
  service: "portfolio_services",
  testimonial: "portfolio_testimonials"
} as const;
type Kind = keyof typeof tableByKind;

function value(formData:FormData,key:string){return String(formData.get(key)??"").trim();}
function payload(kind:Kind,formData:FormData){
  const sort_order=Number(value(formData,"sort_order")||0);
  const published=formData.get("published")==="on";
  if(kind==="experience") return {role:value(formData,"title"),organization:value(formData,"organization"),start_date:value(formData,"start_date"),end_date:value(formData,"end_date"),description:value(formData,"description"),sort_order,published};
  if(kind==="certification") return {name:value(formData,"title"),issuer:value(formData,"organization"),issue_date:value(formData,"start_date"),credential_url:value(formData,"url"),description:value(formData,"description"),sort_order,published};
  if(kind==="post") return {title:value(formData,"title"),slug:value(formData,"slug")||value(formData,"title").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""),excerpt:value(formData,"excerpt"),content:value(formData,"description"),tags:value(formData,"tags").split(",").map(x=>x.trim()).filter(Boolean),published,published_at:published?new Date().toISOString():null,updated_at:new Date().toISOString()};
  if(kind==="service") return {title:value(formData,"title"),description:value(formData,"description"),sort_order,published};
  return {quote:value(formData,"description"),person_name:value(formData,"title"),person_role:value(formData,"organization"),organization:value(formData,"start_date"),sort_order,published};
}

export async function saveContent(formData:FormData){
  const {supabase}=await requireAdmin();
  const kind=value(formData,"kind") as Kind;
  if(!(kind in tableByKind)) throw new Error("Unsupported content type.");
  const data=payload(kind,formData);
  if(kind==="post"&&(!value(formData,"title")||!(value(formData,"slug")||value(formData,"title")))) throw new Error("Article title and slug are required.");
  if(kind==="experience"&&(!value(formData,"title")||!value(formData,"organization"))) throw new Error("Role and organization are required.");
  if(kind==="certification"&&(!value(formData,"title")||!value(formData,"organization"))) throw new Error("Certification and issuer are required.");
  if(kind==="service"&&(!value(formData,"title")||!value(formData,"description"))) throw new Error("Service title and description are required.");
  if(kind==="testimonial"&&(!value(formData,"description")||!value(formData,"title"))) throw new Error("Quote and contributor name are required.");
  const id=value(formData,"id");
  const table=tableByKind[kind];
  const result=id?await supabase.from(table).update(data).eq("id",id):await supabase.from(table).insert(data);
  if(result.error) throw new Error(result.error.message);
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin/content");
  redirect("/admin/content?saved="+kind);
}

export async function deleteContent(formData:FormData){
  const {supabase}=await requireAdmin();
  const kind=value(formData,"kind") as Kind; const id=value(formData,"id");
  if(!(kind in tableByKind)||!id) throw new Error("Content type and ID are required.");
  const {error}=await supabase.from(tableByKind[kind]).delete().eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/"); revalidatePath("/blog"); revalidatePath("/admin/content");
  redirect("/admin/content?deleted="+kind);
}

export async function updateEnquiry(formData:FormData){
  const {supabase}=await requireAdmin();
  const id=value(formData,"id"); const status=value(formData,"status");
  if(!id||!["new","read","replied","archived"].includes(status)) throw new Error("Invalid enquiry update.");
  const {error}=await supabase.from("portfolio_enquiries").update({status}).eq("id",id);
  if(error) throw new Error(error.message);
  revalidatePath("/admin/content");
  redirect("/admin/content?enquiry=updated");
}
