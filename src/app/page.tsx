import SlidePortfolio from "@/components/slide-portfolio";
import { getPortfolioData } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const { profile, projects, skills, education } = await getPortfolioData();
  return <SlidePortfolio profile={profile} projects={projects} skills={skills} education={education} />;
}
