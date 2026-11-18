import { ArrowUpRight, GitFork, Github, Star } from "lucide-react";

type Repo = { id: number; name: string; description: string | null; html_url: string; stargazers_count: number; forks_count: number; language: string | null; fork: boolean };
export default async function GithubShowcase() {
  let repos: Repo[] = [];
  let profile: { public_repos?: number; followers?: number } = {};
  try {
    const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
    const [repoResponse, profileResponse] = await Promise.all([
      fetch("https://api.github.com/users/kiiplangatemanuel-bit/repos?sort=updated&per_page=6", { headers, next: { revalidate: 3600 } }),
      fetch("https://api.github.com/users/kiiplangatemanuel-bit", { headers, next: { revalidate: 3600 } })
    ]);
    if (repoResponse.ok) repos = (await repoResponse.json() as Repo[]).filter(repo => !repo.fork);
    if (profileResponse.ok) profile = await profileResponse.json();
  } catch { /* The portfolio remains usable when GitHub is unavailable. */ }
  return <section className="section github-section" id="github">
    <div className="section-heading"><div><div className="section-kicker">06 / Open source</div><h2>On GitHub</h2></div><p className="muted">Recent public repositories from my GitHub profile. This list refreshes automatically.</p></div>
    <div className="github-stats"><span><strong>{profile.public_repos ?? "—"}</strong> public repositories</span><span><strong>{profile.followers ?? "—"}</strong> followers</span><a href="https://github.com/kiiplangatemanuel-bit" target="_blank" rel="noreferrer">View GitHub profile <ArrowUpRight size={15}/></a></div>
    {repos.length ? <div className="github-grid">{repos.map(repo=><a className="github-card" href={repo.html_url} key={repo.id} target="_blank" rel="noreferrer"><div><Github size={17}/><strong>{repo.name}</strong><ArrowUpRight size={15}/></div><p>{repo.description || "Public software project."}</p><small>{repo.language || "Code"} <span><Star size={12}/> {repo.stargazers_count}</span><span><GitFork size={12}/> {repo.forks_count}</span></small></a>)}</div> : <p className="muted">GitHub repositories are temporarily unavailable. Visit the profile directly for current activity.</p>}
    <p className="github-note">Explore the <a href="https://github.com/kiiplangatemanuel-bit?tab=repositories" target="_blank" rel="noreferrer">repository list</a> and <a href="https://github.com/kiiplangatemanuel-bit?tab=overview" target="_blank" rel="noreferrer">contribution overview</a> on GitHub.</p>
  </section>;
}
