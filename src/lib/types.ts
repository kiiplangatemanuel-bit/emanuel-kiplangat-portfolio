export type Profile = {
  id?: number;
  full_name: string; headline: string; bio: string; location: string;
  email: string; phone: string; github_url: string; linkedin_url: string;
  avatar_url: string; resume_url: string; availability_status?: string;
  website_url?: string; analytics_enabled?: boolean; updated_at?: string;
};

export type Project = {
  id: string; title: string; slug: string; summary: string; description: string;
  technologies: string[]; live_url: string; repo_url: string; image_url: string;
  featured: boolean; published: boolean; sort_order: number;
  problem?: string; role_and_contributions?: string; challenges_and_solutions?: string;
  outcomes?: string; gallery_urls?: string[];
};

export type Skill = { id: string; name: string; category: string; sort_order: number; proficiency?: string };
export type Education = { id: string; institution: string; qualification: string; start_year: string; end_year: string; details: string; sort_order: number };
export type Experience = { id:string; role:string; organization:string; start_date:string; end_date:string; description:string; sort_order:number; published:boolean };
export type Certification = { id:string; name:string; issuer:string; issue_date:string; credential_url:string; description:string; sort_order:number; published:boolean };
export type BlogPost = { id:string; title:string; slug:string; excerpt:string; content:string; cover_image_url:string|null; tags:string[]; published:boolean; published_at:string|null };

export const defaultProfile: Profile = {
  full_name: "Emanuel Kiplangat Kirui",
  headline: "Software Developer · Full-Stack Development",
  bio: "I build practical software solutions, web applications and integrated business systems. I am an Information Technology undergraduate at Karatina University, interested in software engineering, enterprise systems and modern web technologies.",
  location: "Kenya", email: "", phone: "",
  github_url: "https://github.com/kiiplangatemanuel-bit",
  linkedin_url: "", avatar_url: "", resume_url: "",
  availability_status: "Open to internships and collaboration"
};
