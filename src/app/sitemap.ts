import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://emanuel-kiplangat-portfolio.vercel.app";
  const entries: MetadataRoute.Sitemap = [
    {url:base,lastModified:new Date()},
    {url:base+"/blog",lastModified:new Date()},
    {url:base+"/cv",lastModified:new Date()}
  ];
  if(process.env.NEXT_PUBLIC_SUPABASE_URL&&process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY){
    try{
      const supabase=await createClient();
      const [projects,posts]=await Promise.all([
        supabase.from("portfolio_projects").select("slug,updated_at").eq("published",true),
        supabase.from("portfolio_posts").select("slug,updated_at,published_at").eq("published",true)
      ]);
      for(const project of projects.data??[]) entries.push({url:base+"/projects/"+project.slug,lastModified:project.updated_at?new Date(project.updated_at):new Date()});
      for(const post of posts.data??[]) entries.push({url:base+"/blog/"+post.slug,lastModified:post.updated_at?new Date(post.updated_at):new Date()});
    }catch{/* Public homepage and static routes remain in the sitemap. */}
  }
  return entries;
}
