import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPortfolioData } from "@/lib/data";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

async function getProject(slug: string): Promise<Project | null> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("portfolio_projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
      if (data) return data as Project;
    } catch { /* fallback below */ }
  }
  const { projects } = await getPortfolioData();
  return projects.find(project => project.slug === slug) ?? null;
}

export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {slug}=await params; const project=await getProject(slug);
  return project ? {title: project.title + " | Emanuel Kiplangat Kirui",description:project.summary,openGraph:{title:project.title,description:project.summary,images:project.image_url?[project.image_url]:[]}} : {title:"Project not found"};
}

export default async function ProjectCaseStudy({params}:Props){
  const {slug}=await params; const project=await getProject(slug); if(!project) notFound();
  return <main className="site-shell detail-page">
    <nav className="detail-nav"><Link href="/#projects"><ArrowLeft size={15}/> Back to projects</Link><span>EK<span className="brand-dot">.</span></span></nav>
    <header className="detail-hero"><div className="section-kicker">PROJECT CASE STUDY / {project.featured?"FLAGSHIP":"SELECTED WORK"}</div><h1>{project.title}</h1><p className="detail-lead">{project.summary}</p><div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div><div className="actions">{project.live_url&&<a className="btn primary" href={project.live_url} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15}/></a>}{project.repo_url&&<a className="btn secondary" href={project.repo_url} target="_blank" rel="noreferrer"><Github size={15}/> Source code</a>}</div></header>
    {project.image_url&&<div className="detail-cover"><Image src={project.image_url} alt={project.title+" screenshot"} width={1440} height={810} unoptimized/></div>}{project.gallery_urls?.length ? <div className="case-study-gallery">{project.gallery_urls.map((url,index)=><Image key={url+index} src={url} alt={project.title+" screenshot "+(index+1)} width={900} height={560} unoptimized/>)}</div> : null}
    <div className="case-study-grid">
      <article><div className="section-kicker">01 / Overview</div><h2>About the project</h2><p>{project.description || project.summary}</p></article>
      <aside><div className="section-kicker">02 / Technology</div><div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div></aside>
      {project.problem&&<article><div className="section-kicker">03 / The problem</div><h2>What I set out to solve</h2><p>{project.problem}</p></article>}
      {project.role_and_contributions&&<article><div className="section-kicker">04 / My contribution</div><h2>Role & engineering work</h2><p>{project.role_and_contributions}</p></article>}
      {project.challenges_and_solutions&&<article><div className="section-kicker">05 / Engineering decisions</div><h2>Challenges & solutions</h2><p>{project.challenges_and_solutions}</p></article>}
      {project.outcomes&&<article><div className="section-kicker">06 / Outcome</div><h2>What this work demonstrates</h2><p>{project.outcomes}</p></article>}
    </div>
    <footer className="detail-footer"><Link href="/#projects">← Explore more projects</Link><span>© {new Date().getFullYear()} Emanuel Kiplangat Kirui</span></footer>
  </main>;
}
