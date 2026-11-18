import { createClient } from "@/lib/supabase/server";
import { defaultProfile, type Education, type Profile, type Project, type Skill } from "@/lib/types";

export async function getPortfolioData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return { profile: defaultProfile, projects: [] as Project[], skills: [] as Skill[], education: [] as Education[] };
  }
  try {
    const supabase = await createClient();
    const [profileResult, projectsResult, skillsResult, educationResult] = await Promise.all([
      supabase.from("portfolio_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("portfolio_projects").select("*").eq("published", true).order("sort_order"),
      supabase.from("portfolio_skills").select("*").order("sort_order"),
      supabase.from("portfolio_education").select("*").order("sort_order")
    ]);
    return {
      profile: (profileResult.data as Profile | null) ?? defaultProfile,
      projects: (projectsResult.data as Project[] | null) ?? [],
      skills: (skillsResult.data as Skill[] | null) ?? [],
      education: (educationResult.data as Education[] | null) ?? []
    };
  } catch {
    return { profile: defaultProfile, projects: [] as Project[], skills: [] as Skill[], education: [] as Education[] };
  }
}