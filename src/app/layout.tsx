import type { Metadata } from "next";
import "./globals.css";\nimport PortfolioAnalytics from "@/components/portfolio-analytics";

const siteUrl = "https://emanuel-kiplangat-portfolio.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Emanuel Kiplangat Kirui | Software Developer", template: "%s | Emanuel Kiplangat Kirui" },
  description: "Portfolio of Emanuel Kiplangat Kirui — Information Technology undergraduate at Karatina University, building practical software, web applications and integrated business systems.",
  applicationName: "Emanuel Kiplangat Kirui Portfolio",
  keywords: ["Emanuel Kiplangat Kirui","Software Developer","Information Technology","Karatina University","OneCore Digital Hub","Web Development","Kenya"],
  alternates: { canonical: siteUrl },
  openGraph: { type:"website", url:siteUrl, siteName:"Emanuel Kiplangat Kirui Portfolio", title:"Emanuel Kiplangat Kirui | Software Developer", description:"Building digital products that solve real problems.", locale:"en_KE" },
  twitter: { card:"summary_large_image", title:"Emanuel Kiplangat Kirui | Software Developer", description:"Building digital products that solve real problems." },
  robots: { index:true, follow:true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><body>{children}<PortfolioAnalytics/></body></html>;
}
