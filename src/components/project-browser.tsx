"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectBrowser({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.flatMap(p => p.technologies ?? []))).sort()], [projects]);
  const visible = filter === "All" ? projects : projects.filter(p => p.technologies?.includes(filter));
  return <>
    <div className="project-filters" aria-label="Filter projects by technology">{categories.map(category => <button key={category} className={filter === category ? "filter-chip active" : "filter-chip"} onClick={() => setFilter(category)}>{category}</button>)}</div>
    <div className="project-grid">
      {visible.map((project, index) => <article className="project-card" key={project.id}>
        <div className="project-art">
          {project.image_url ? <Image className="project-image" src={project.image_url} alt={project.title + " preview"} width={960} height={540} unoptimized/> : <div className={"project-placeholder project-placeholder-" + (index % 3)}><span>{String(index + 1).padStart(2,"0")}</span><div className="placeholder-window"><i/><i/><i/><b>{project.title}</b><small>{project.technologies?.slice(0,3).join(" · ") || "Digital product"}</small></div></div>}
          {project.featured && <span className="featured-label">Featured project</span>}
        </div>
        <div className="project-content"><div className="project-index">PROJECT / {String(index + 1).padStart(2,"0")}</div><h3>{project.title}</h3><p className="muted">{project.summary}</p>
          <div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div>
          <div className="project-links"><Link href={"/projects/" + project.slug}>Case study <ArrowUpRight size={15}/></Link>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">View live <ArrowUpRight size={15}/></a>}{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer"><Github size={15}/> Source code</a>}</div>
        </div>
      </article>)}
      {visible.length === 0 && <p className="muted">No projects match this technology yet.</p>}
    </div>
  </>;
}
