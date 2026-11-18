"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export async function saveProfile(formData: FormData) {
  const { supabase } = await requireAdmin();
  const payload = {
    id: 1,
    full_name: String(formData.get("full_name") ?? "").trim(),
    headline: String(formData.get("headline") ?? "").trim(),
    bio: String(formData.get("bio") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    github_url: String(formData.get("github_url") ?? "").trim(),
    linkedin_url: String(formData.get("linkedin_url") ?? "").trim(),
    avatar_url: String(formData.get("avatar_url") ?? "").trim(),
    updated_at: new Date().toISOString()
  };
  const { error } = await supabase.from("portfolio_profile").upsert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=profile");
}

export async function createProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")).trim();
  if (!title || !slug) throw new Error("Project title and slug are required.");
  const technologies = String(formData.get("technologies") ?? "").split(",").map(v=>v.trim()).filter(Boolean);
  const { error } = await supabase.from("portfolio_projects").insert({
    title, slug, summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    technologies, live_url: String(formData.get("live_url") ?? "").trim(),
    repo_url: String(formData.get("repo_url") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0)
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=project-created");
}

export async function updateProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!id || !title || !slug) throw new Error("Project ID, title and slug are required.");
  const technologies = String(formData.get("technologies") ?? "").split(",").map(v=>v.trim()).filter(Boolean);
  const { error } = await supabase.from("portfolio_projects").update({
    title, slug, summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    technologies, live_url: String(formData.get("live_url") ?? "").trim(),
    repo_url: String(formData.get("repo_url") ?? "").trim(),
    image_url: String(formData.get("image_url") ?? "").trim(),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
    updated_at: new Date().toISOString()
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=project-updated");
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Project ID is missing.");
  const { error } = await supabase.from("portfolio_projects").delete().eq("id",id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=project-deleted");
}


export async function createSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Skill name is required.");
  const { error } = await supabase.from("portfolio_skills").insert({
    name,
    category: String(formData.get("category") ?? "Technology").trim() || "Technology",
    sort_order: Number(formData.get("sort_order") ?? 0)
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=skill-created");
}

export async function updateSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) throw new Error("Skill ID and name are required.");
  const { error } = await supabase.from("portfolio_skills").update({
    name,
    category: String(formData.get("category") ?? "Technology").trim() || "Technology",
    sort_order: Number(formData.get("sort_order") ?? 0)
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=skill-updated");
}

export async function deleteSkill(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Skill ID is required.");
  const { error } = await supabase.from("portfolio_skills").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=skill-deleted");
}

export async function createEducation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const institution = String(formData.get("institution") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  if (!institution || !qualification) throw new Error("Institution and qualification are required.");
  const { error } = await supabase.from("portfolio_education").insert({
    institution,
    qualification,
    start_year: String(formData.get("start_year") ?? "").trim(),
    end_year: String(formData.get("end_year") ?? "").trim(),
    details: String(formData.get("details") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0)
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=education-created");
}

export async function updateEducation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const institution = String(formData.get("institution") ?? "").trim();
  const qualification = String(formData.get("qualification") ?? "").trim();
  if (!id || !institution || !qualification) throw new Error("Education ID, institution and qualification are required.");
  const { error } = await supabase.from("portfolio_education").update({
    institution,
    qualification,
    start_year: String(formData.get("start_year") ?? "").trim(),
    end_year: String(formData.get("end_year") ?? "").trim(),
    details: String(formData.get("details") ?? "").trim(),
    sort_order: Number(formData.get("sort_order") ?? 0)
  }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=education-updated");
}

export async function deleteEducation(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Education ID is required.");
  const { error } = await supabase.from("portfolio_education").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?updated=education-deleted");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}