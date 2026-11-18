import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
type Props={params:Promise<{slug:string}>};
async function getPost(slug:string){if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)return null;try{const supabase=await createClient();const {data}=await supabase.from("portfolio_posts").select("*").eq("slug",slug).eq("published",true).maybeSingle();return data;}catch{return null;}}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const post=await getPost(slug);return post?{title:post.title+" | Emanuel Kiplangat Kirui",description:post.excerpt}:{title:"Article not found"};}
export default async function BlogPost({params}:Props){const {slug}=await params;const post=await getPost(slug);if(!post)notFound();return <main className="site-shell detail-page"><nav className="detail-nav"><Link href="/blog"><ArrowLeft size={15}/> All articles</Link><span>EK<span className="brand-dot">.</span></span></nav><article className="article-body"><div className="section-kicker">BLOG / INSIGHTS</div><h1>{post.title}</h1><p className="detail-lead">{post.excerpt}</p><div className="tags">{(post.tags??[]).map((tag:string)=><span className="tag" key={tag}>{tag}</span>)}</div><div className="article-content">{post.content}</div></article></main>;}
