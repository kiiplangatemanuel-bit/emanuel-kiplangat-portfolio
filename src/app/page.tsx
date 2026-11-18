import Link from "next/link";\nimport Image from "next/image";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin, Sparkles, BriefcaseBusiness, Award, BookOpen, Code2 } from "lucide-react";
import { getPortfolioData } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import ThemeToggle from "@/components/theme-toggle";
import ProjectBrowser from "@/components/project-browser";
import GithubShowcase from "@/components/github-showcase";
import ContactForm from "@/components/contact-form";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { profile, projects, skills, education } = await getPortfolioData();
  let experience: {id:string;role:string;organization:string;start_date:string;end_date:string;description:string}[] = [];
  let certifications: {id:string;name:string;issuer:string;issue_date:string;credential_url:string;description:string}[] = [];
  let services: {id:string;title:string;description:string}[] = [];
  let testimonials: {id:string;quote:string;person_name:string;person_role:string;organization:string}[] = [];
  let posts: {id:string;title:string;slug:string;excerpt:string;published_at:string|null}[] = [];
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    try {
      const supabase = await createClient();
      const results = await Promise.all([
        supabase.from("portfolio_experience").select("*").eq("published",true).order("sort_order"),
        supabase.from("portfolio_certifications").select("*").eq("published",true).order("sort_order"),
        supabase.from("portfolio_services").select("*").eq("published",true).order("sort_order"),
        supabase.from("portfolio_testimonials").select("*").eq("published",true).order("sort_order"),
        supabase.from("portfolio_posts").select("id,title,slug,excerpt,published_at").eq("published",true).order("published_at",{ascending:false}).limit(3)
      ]);
      experience = results[0].data ?? [];
      certifications = results[1].data ?? [];
      services = results[2].data ?? [];
      testimonials = results[3].data ?? [];
      posts = results[4].data ?? [];
    } catch { /* Existing portfolio sections remain available until the content migration is applied. */ }
  }
  const skillGroups = skills.reduce<Record<string, string[]>>((groups, skill) => {
    (groups[skill.category || "Technology"] ??= []).push(skill.name + (skill.proficiency ? " · " + skill.proficiency : ""));
    return groups;
  }, {});
  const initials = profile.full_name.split(" ").map(part => part[0]).slice(0, 2).join("");

  return <main><div className="site-shell">
    <nav className="nav" aria-label="Main navigation">
      <a className="brand" href="#home" aria-label={profile.full_name + " home"}>EK<span>.</span></a>
      <div className="navlinks">
        <a href="#about">About</a><a href="#projects">Projects</a><a href="#skills">Skills</a><a href="#journey">Journey</a><a href="#contact">Contact</a><Link href="/blog">Blog</Link>
      </div>
      <div className="nav-actions"><ThemeToggle/><a className="nav-cta" href="#contact">Let’s talk <ArrowUpRight size={15}/></a></div>
    </nav>

    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span className="status-dot"/> Information Technology undergraduate · Kenya</div>
        <h1>Building digital products that <span className="gradient-text">solve real problems.</span></h1>
        <p className="hero-lead">{profile.bio}</p>
        <div className="actions">
          <a className="btn primary" href="#projects">Explore my work <ArrowUpRight size={17}/></a>
          <a className="btn secondary" href="#contact">Get in touch</a>
          {profile.resume_url && <><a className="btn secondary" href={profile.resume_url} target="_blank" rel="noreferrer">Download CV <ArrowUpRight size={15}/></a><Link className="btn secondary" href="/cv">Preview CV</Link></>}
        </div>
        <div className="hero-meta"><span><MapPin size={14}/> {profile.location || "Kenya"}</span><span><Sparkles size={14}/> {profile.availability_status || "Open to learning and collaboration"}</span></div>
      </div>
      <div className="hero-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
        <div className="profile-card">
          {profile.avatar_url ? <Image className="avatar" src={profile.avatar_url} alt={profile.full_name} width={600} height={510} unoptimized/> : <div className="avatar avatar-initials">{initials}</div>}
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
      <div><h2>Technology is most powerful when it makes everyday work better.</h2><p className="muted">I’m an Information Technology undergraduate at Karatina University, building experience through practical software projects. I’m interested in thoughtful user experiences, dependable web applications and systems that connect people with the tools they need.</p>
        <div className="about-links">{profile.github_url&&<a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={15}/> GitHub</a>}{profile.linkedin_url&&<a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={15}/> LinkedIn</a>}</div>
      </div>
    </section>

    <section className="section" id="projects">
      <div className="section-heading"><div><div className="section-kicker">02 / Selected work</div><h2>Projects & case studies</h2></div><p className="muted">A closer look at the problems I explore, the systems I build and what I learn along the way.</p></div>
      <ProjectBrowser projects={projects}/>
    </section>

    <section className="section skills-section" id="skills">
      <div className="section-heading"><div><div className="section-kicker">03 / Toolkit</div><h2>Technical skills</h2></div><p className="muted">Technologies and practices represented in my current project work. This list grows as I build and learn.</p></div>
      {Object.keys(skillGroups).length ? <div className="skills-grid">{Object.entries(skillGroups).map(([group,items])=><article className="skill-group" key={group}><h3>{group}</h3><div className="tags">{items.map(item=><span className="tag" key={item}>{item}</span>)}</div></article>)}</div> : <p className="muted">My skills list is being updated through the portfolio CMS.</p>}
    </section>

    <section className="section" id="journey">
      <div className="section-heading"><div><div className="section-kicker">04 / Development journey</div><h2>Experience & education</h2></div><p className="muted">My academic foundation and practical learning journey.</p></div>
      <div className="timeline">
        {experience.map(item=><article className="timeline-item" key={item.id}><div className="timeline-date">{item.start_date} — {item.end_date || "Present"}</div><div><h3>{item.role}</h3><p className="timeline-org">{item.organization}</p><p className="muted">{item.description}</p></div><BriefcaseBusiness size={18}/></article>)}
        {education.map(item=><article className="timeline-item" key={item.id}><div className="timeline-date">{item.start_year || "Undergraduate"} — {item.end_year || "Present"}</div><div><h3>{item.qualification}</h3><p className="timeline-org">{item.institution}</p><p className="muted">{item.details}</p></div><BookOpen size={18}/></article>)}
      </div>
    </section>

    <section className="section" id="certifications">
      <div className="section-heading"><div><div className="section-kicker">05 / Continuous learning</div><h2>Certifications & learning</h2></div><p className="muted">Verified credentials and completed learning milestones.</p></div>
      {certifications.length ? <div className="credential-grid">{certifications.map(item=><article className="credential-card" key={item.id}><Award size={19}/><h3>{item.name}</h3><p>{item.issuer}{item.issue_date?" · "+item.issue_date:""}</p>{item.description&&<p className="muted">{item.description}</p>}{item.credential_url&&<a href={item.credential_url} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={14}/></a>}</article>)}</div> : <p className="muted">Credentials will appear here when added and verified in the CMS.</p>}
    </section>

    <section className="section" id="services">
      <div className="section-heading"><div><div className="section-kicker">06 / Ways to work together</div><h2>Services & collaboration</h2></div><p className="muted">Areas where I’m open to contributing, learning and collaborating.</p></div>
      {services.length ? <div className="services-grid">{services.map(item=><article className="service-card" key={item.id}><Code2 size={19}/><h3>{item.title}</h3><p>{item.description}</p></article>)}</div> : <div className="services-grid"><article className="service-card"><Code2 size={19}/><h3>Web application development</h3><p>Building responsive interfaces and practical web experiences.</p></article><article className="service-card"><Code2 size={19}/><h3>Business systems</h3><p>Exploring connected workflows, dashboards and operational tools.</p></article><article className="service-card"><Code2 size={19}/><h3>Technical collaboration</h3><p>Contributing to projects, learning with teams and solving problems.</p></article></div>}
    </section>

    {testimonials.length>0&&<section className="section"><div className="section-heading"><div><div className="section-kicker">07 / Feedback</div><h2>What collaborators say</h2></div><p className="muted">Feedback shared with permission.</p></div><div className="testimonial-grid">{testimonials.map(item=><blockquote className="testimonial-card" key={item.id}><p>“{item.quote}”</p><footer><strong>{item.person_name}</strong><span>{item.person_role}{item.organization?" · "+item.organization:""}</span></footer></blockquote>)}</div></section>}

    <GithubShowcase/>

    <section className="section blog-preview" id="blog">
      <div className="section-heading"><div><div className="section-kicker">08 / Notes & insights</div><h2>Writing as I learn</h2></div><Link className="text-link" href="/blog">All articles <ArrowUpRight size={15}/></Link></div>
      {posts.length ? <div className="post-preview-grid">{posts.map(post=><article className="post-card" key={post.id}><div className="section-kicker">{post.published_at?new Date(post.published_at).toLocaleDateString("en",{year:"numeric",month:"short",day:"numeric"}):"INSIGHT"}</div><h3><Link href={"/blog/"+post.slug}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="text-link" href={"/blog/"+post.slug}>Read article <ArrowUpRight size={14}/></Link></article>)}</div> : <p className="muted">Technical notes and project lessons will be published here through the CMS.</p>}
    </section>

    <section className="contact-section" id="contact"><div className="contact-glow"/>
      <div className="section-kicker">09 / Contact</div><h2>Have an idea?<br/><span className="gradient-text">Let’s make it useful.</span></h2>
      <p className="muted">For internship opportunities, collaborations, freelance enquiries or a conversation about technology, send me a message.</p>
      <div className="contact-layout"><ContactForm/><aside className="contact-aside">{profile.email&&<a href={"mailto:"+profile.email}><Mail size={16}/> {profile.email}</a>}{profile.phone&&<a href={"tel:"+profile.phone}>{profile.phone}</a>}{profile.github_url&&<a href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>}{profile.linkedin_url&&<a href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}</aside></div>
    </section>
    <footer className="footer"><a className="brand" href="#home">EK<span>.</span></a><span>© {new Date().getFullYear()} {profile.full_name}. Built with curiosity.</span><a href="#home">Back to top ↑</a></footer>
  </div></main>;
}
