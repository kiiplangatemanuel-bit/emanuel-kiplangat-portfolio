import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emanuel Kiplangat Kirui | Software Developer",
  description: "Portfolio of Emanuel Kiplangat Kirui — software developer and Information Technology undergraduate at Karatina University."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}