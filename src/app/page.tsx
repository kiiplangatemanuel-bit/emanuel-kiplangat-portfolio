import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { getPortfolioData } from "@/lib/data";

export const revalidate = 0;

export default async function HomePage() {
  const { profile, projects, skills, education } = await getPortfolioData();
  const initials = profile.full_name.split(" ").map(part => part[0]).slice(0, 2).join("");
  const skillGroups = skills.reduce<Record<string, string[]>>((groups, skill) => {
    (groups[skill.category || "Technology"] ??= []).push(skill.name);
    return groups;
  }, {});

  return (
    <main>
      <div className="container">
        <nav className="nav">
          <a className="brand" href="#home">{profile.full_name.split(" ")[0]}<span style={{color:"var(--accent)"}}>.</span></a>
          <div className="navlinks"><a href="#about">About</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#contact">Contact</a></div>
        </nav>
        <section className="hero" id="home">
          <div>
            <div className="eyebrow">Software developer · Based in {profile.location || "Kenya"}</div>
            <h1>{profile.full_name}</h1>
            <p className="lead">{profile.headline}</p>
            <p className="muted">{profile.bio}</p>
            <div className="actions"><a className="btn primary" href="#projects">Explore my work <ArrowUpRight size={17}/></a><a className="btn" href="#contact">Get in touch</a></div>
          </div>
          <div className="profile-card">
            {profile.avatar_url ? <img className="avatar" src={profile.avatar_url} alt={profile.full_name}/> : <div className="avatar">{initials}</div>}
            <p className="eyebrow" style={{marginTop:22}}>Currently focused on</p>
            <p className="muted">Building useful digital products, enterprise applications and reliable web experiences.</p>
          </div>
        </section>

        <section className="section" id="about">
          <div className="eyebrow">01 / About</div><h2>Turning ideas into useful software.</h2>
          <p className="lead">{profile.bio}</p>
          <p className="muted">I am studying for a Bachelor of Science in Information Technology at Karatina University, with expected graduation in 2027. I enjoy learning through practical projects and solving real operational problems with technology.</p>
          {education.length > 0 && <div className="grid" style={{marginTop:24}}>{education.map(item=><article className="card" key={item.id}><div className="eyebrow">{item.start_year} – {item.end_year || "Present"}</div><h3>{item.qualification}</h3><p className="muted">{item.institution}</p><p className="muted">{item.details}</p></article>)}</div>}
        </section>

        <section className="section" id="projects">
          <div className="eyebrow">02 / Selected work</div><h2>Projects I have worked on.</h2>
          <div className="grid">
            {projects.map(project=><article className="card" key={project.id}>
              {project.image_url ? <img className="project-image" src={project.image_url} alt={project.title}/> : <div className="project-image" />}
              <h3>{project.title}</h3><p className="muted">{project.summary}</p>
              <div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div>
              <div className="actions">{project.live_url && <a className="btn" href={project.live_url} target="_blank" rel="noreferrer">Live site <ArrowUpRight size={15}/></a>}{project.repo_url && <a className="btn" href={project.repo_url} target="_blank" rel="noreferrer"><Github size={15}/> Source</a>}</div>
            </article>)}
            {projects.length === 0 && <article className="card"><h3>OneCore Digital Hub</h3><p className="muted">An enterprise-oriented digital platform for connected business operations. Project details will be managed from the admin dashboard.</p><a className="muted" href="https://github.com/kiiplangatemanuel-bit/onecore-digital-hub">View repository ↗</a></article>}
          </div>
        </section>

        <section className="section" id="skills">
          <div className="eyebrow">03 / Toolkit</div><h2>Technologies and skills.</h2>
          {Object.keys(skillGroups).length ? <div className="grid">{Object.entries(skillGroups).map(([group,items])=><article className="card" key={group}><h3>{group}</h3><div className="tags">{items.map(item=><span className="tag" key={item}>{item}</span>)}</div></article>)}</div> : <p className="muted">Skills and technologies will be added and maintained through the admin dashboard.</p>}
        </section>

        <section className="section" id="contact">
          <div className="eyebrow">04 / Contact</div><h2>Let’s build something meaningful.</h2>
          <p className="lead">I am open to software development opportunities, collaborations and conversations about technology.</p>
          <div className="actions">
            {profile.email && <a className="btn primary" href={`mailto:${profile.email}`}><Mail size={16}/> Email me</a>}
            {profile.phone && <a className="btn" href={`tel:${profile.phone}`}>Call {profile.phone}</a>}
            {profile.github_url && <a className="btn" href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>}
            {profile.linkedin_url && <a className="btn" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}
          </div>
        </section>
        <footer className="footer"><span>© {new Date().getFullYear()} {profile.full_name}</span><span>Designed and built with care.</span></footer>
      </div>
    </main>
  );
}