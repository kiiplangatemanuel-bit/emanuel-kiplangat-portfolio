export type Profile = {
  id?: number;
  full_name: string;
  headline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  avatar_url: string;
  updated_at?: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  technologies: string[];
  live_url: string;
  repo_url: string;
  image_url: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

export type Skill = { id: string; name: string; category: string; sort_order: number };
export type Education = { id: string; institution: string; qualification: string; start_year: string; end_year: string; details: string; sort_order: number };

export const defaultProfile: Profile = {
  full_name: "Emanuel Kiplangat Kirui",
  headline: "Software Developer · Full-Stack Development",
  bio: "I build practical software solutions, web applications and integrated business systems. I am an Information Technology undergraduate at Karatina University, interested in software engineering, enterprise systems and modern web technologies.",
  location: "Kenya",
  email: "",
  phone: "",
  github_url: "https://github.com/kiiplangatemanuel-bit",
  linkedin_url: "",
  avatar_url: ""
};