import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
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
      <div className="site-shell">
        <nav className="nav" aria-label="Main navigation">
          <a className="brand" href="#home" aria-label={profile.full_name + " home"}>EK<span>.</span></a>
          <div className="navlinks">
            <a href="#about">About</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#education">Education</a>
          </div>
          <a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={15}/></a>
        </nav>

        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="status-dot"/> Information Technology undergraduate · Kenya</div>
            <h1>Building digital products that <span className="gradient-text">solve real problems.</span></h1>
            <p className="hero-lead">{profile.bio}</p>
            <div className="actions">
              <a className="btn primary" href="#projects">Explore my work <ArrowUpRight size={17}/></a>
              <a className="btn secondary" href="#contact">Get in touch</a>
            </div>
            <div className="hero-meta"><span><MapPin size={14}/> {profile.location || "Kenya"}</span><span><Sparkles size={14}/> Open to learning and collaboration</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
            <div className="profile-card">
              {profile.avatar_url ? <img className="avatar" src={profile.avatar_url} alt={profile.full_name}/> : <div className="avatar avatar-initials">{initials}</div>}
              <div className="profile-card-copy"><div className="eyebrow">Hello, I’m</div><h2>{profile.full_name}</h2><p>{profile.headline}</p></div>
              <div className="profile-card-footer"><span className="status-dot"/> Creating, learning, improving</div>
            </div>
            <div className="floating-chip chip-top"><span className="chip-icon">✳</span> Curious by nature</div>
            <div className="floating-chip chip-bottom"><span className="chip-icon">⌘</span> Practical problem solving</div>
          </div>
          <a className="scroll-cue" href="#about"><ArrowDown size={15}/> Scroll to explore</a>
        </section>

        <section className="intro-strip" id="about">
          <div className="section-kicker">01 / About me</div>
          <div><h2>Technology is most powerful when it makes everyday work better.</h2><p className="muted">I’m an Information Technology student at Karatina University, building my experience through practical software projects. I’m interested in thoughtful user experiences, dependable web applications and systems that connect people with the tools they need.</p></div>
        </section>

        <section className="section" id="projects">
          <div className="section-heading"><div><div className="section-kicker">02 / Selected work</div><h2>Projects & experiments</h2></div><p className="muted">A selection of things I’m building, exploring and learning from.</p></div>
          <div className="project-grid">
            {projects.map((project, index) => <article className="project-card" key={project.id}>
              <div className="project-art">
                {project.image_url ? <img className="project-image" src={project.image_url} alt={project.title + " project preview"}/> : <div className={"project-placeholder project-placeholder-" + (index % 3)}><span>{String(index + 1).padStart(2,"0")}</span><div className="placeholder-window"><i/><i/><i/><b>{project.title}</b><small>{project.technologies?.slice(0,3).join(" · ") || "Digital product"}</small></div></div>}
                {project.featured && <span className="featured-label">Featured project</span>}
              </div>
              <div className="project-content"><div className="project-index">PROJECT / {String(index + 1).padStart(2,"0")}</div><h3>{project.title}</h3><p className="muted">{project.summary}</p>
                <div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div>
                <div className="project-links">{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">View live <ArrowUpRight size={15}/></a>}{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer"><Github size={15}/> Source code</a>}</div>
              </div>
            </article>)}
            {projects.length === 0 && <article className="project-card project-empty"><div className="section-kicker">More work coming soon</div><h3>New projects are in progress.</h3><p className="muted">Check back as I continue documenting and publishing my work.</p></article>}
          </div>
        </section>

        <section className="section skills-section" id="skills">
          <div className="section-heading"><div><div className="section-kicker">03 / Toolkit</div><h2>Skills I’m developing</h2></div><p className="muted">A growing set of technologies and practices I use in my projects.</p></div>
          {Object.keys(skillGroups).length ? <div className="skills-grid">{Object.entries(skillGroups).map(([group,items])=><article className="skill-group" key={group}><h3>{group}</h3><div className="tags">{items.map(item=><span className="tag" key={item}>{item}</span>)}</div></article>)}</div> : <p className="muted">My skills list is being updated. Please check back soon.</p>}
        </section>

        <section className="section education-section" id="education">
          <div className="section-heading"><div><div className="section-kicker">04 / Education</div><h2>Learning with purpose</h2></div><p className="muted">Building a strong foundation and applying it through practical work.</p></div>
          <div className="education-list">{education.map(item=><article className="education-item" key={item.id}><div className="education-date">{item.start_year || "Current"} — {item.end_year || "Present"}</div><div><h3>{item.qualification}</h3><p>{item.institution}</p>{item.details && <p className="muted">{item.details}</p>}</div><span className="education-mark">↗</span></article>)}</div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-glow"/>
          <div className="section-kicker">05 / Contact</div><h2>Have an idea?<br/><span className="gradient-text">Let’s make it useful.</span></h2>
          <p className="muted">I’m open to conversations about technology, collaborations, learning opportunities and meaningful software projects.</p>
          <div className="actions">
            {profile.email && <a className="btn primary" href={`mailto:${profile.email}`}><Mail size={16}/> Email me</a>}
            {profile.phone && <a className="btn secondary" href={`tel:${profile.phone}`}>Call me</a>}
            {profile.github_url && <a className="btn secondary" href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>}
            {profile.linkedin_url && <a className="btn secondary" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}
          </div>
        </section>
        <footer className="footer"><a className="brand" href="#home">EK<span>.</span></a><span>© {new Date().getFullYear()} {profile.full_name}. Built with curiosity.</span><a href="#home">Back to top ↑</a></footer>
      </div>
    </main>
  );
}
