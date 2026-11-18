import { createClient } from "@/lib/supabase/server";
import { defaultProfile, type Education, type Profile, type Project, type Skill } from "@/lib/types";

const fallbackProjects: Project[] = [{
  id: "onecore-digital-hub",
  title: "OneCore Digital Hub",
  slug: "onecore-digital-hub",
  summary: "An enterprise-oriented digital platform bringing business operations and industry workflows together.",
  description: "A practical software project focused on connected business operations, application workflows and integrated digital services.",
  technologies: [],
  live_url: "https://onecore-digital-hub.vercel.app/",
  repo_url: "https://github.com/kiiplangatemanuel-bit/onecore-digital-hub",
  image_url: "",
  featured: true,
  published: true,
  sort_order: 1
}];

const fallbackEducation: Education[] = [{
  id: "karatina-university-bsc-it",
  institution: "Karatina University",
  qualification: "Bachelor of Science in Information Technology",
  start_year: "",
  end_year: "2027",
  details: "Undergraduate studies; expected graduation in 2027.",
  sort_order: 1
}];

const fallback = () => ({
  profile: defaultProfile,
  projects: fallbackProjects,
  skills: [] as Skill[],
  education: fallbackEducation
});

export async function getPortfolioData() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return fallback();
  }
  try {
    const supabase = await createClient();
    const [profileResult, projectsResult, skillsResult, educationResult] = await Promise.all([
      supabase.from("portfolio_profile").select("*").eq("id", 1).maybeSingle(),
      supabase.from("portfolio_projects").select("*").eq("published", true).order("featured", { ascending: false }).order("sort_order"),
      supabase.from("portfolio_skills").select("*").order("sort_order"),
      supabase.from("portfolio_education").select("*").order("sort_order")
    ]);
    return {
      profile: (profileResult.data as Profile | null) ?? defaultProfile,
      projects: (projectsResult.data as Project[] | null) ?? fallbackProjects,
      skills: (skillsResult.data as Skill[] | null) ?? [],
      education: (educationResult.data as Education[] | null) ?? fallbackEducation
    };
  } catch {
    return fallback();
  }
}