import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://emanuel-kiplangat-portfolio.vercel.app";return [{url:base,lastModified:new Date()},{url:base+"/blog",lastModified:new Date()}];}
