import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {title:"Blog & Insights | Emanuel Kiplangat Kirui",description:"Notes on software engineering, building OneCore Digital Hub, university learning and technology experiments."};
export const dynamic = "force-dynamic";

export default async function BlogPage(){
 let posts: {id:string;title:string;slug:string;excerpt:string;tags:string[];published_at:string|null}[]=[];
 if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY){try{const supabase=await createClient();const {data}=await supabase.from("portfolio_posts").select("id,title,slug,excerpt,tags,published_at").eq("published",true).order("published_at",{ascending:false});posts=data??[];}catch{/* migration may not yet be applied */}}
 return <main className="site-shell detail-page"><nav className="detail-nav"><Link href="/"><ArrowLeft size={15}/> Back home</Link><span>EK<span className="brand-dot">.</span></span></nav><header className="detail-hero"><div className="section-kicker">WRITING / NOTES / LEARNING</div><h1>Blog & <span className="gradient-text">insights.</span></h1><p className="detail-lead">Writing about software development, lessons from building OneCore, university projects and experiments. I’ll publish articles here as they are ready.</p></header><div className="post-list">{posts.length?posts.map(post=><article className="post-card" key={post.id}><div className="section-kicker">{post.published_at?new Date(post.published_at).toLocaleDateString("en",{year:"numeric",month:"long",day:"numeric"}):"ARTICLE"}</div><h2><Link href={"/blog/"+post.slug}>{post.title} <ArrowUpRight size={17}/></Link></h2><p>{post.excerpt}</p><div className="tags">{post.tags?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div></article>):<div className="empty-state"><h2>Articles are in progress.</h2><p>New notes will appear here when published through the portfolio CMS.</p><Link href="/#contact">Suggest a topic <ArrowUpRight size={15}/></Link></div>}</div></main>;
}
