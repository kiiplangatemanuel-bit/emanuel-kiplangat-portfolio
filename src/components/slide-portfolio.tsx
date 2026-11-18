"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";
import type { Education, Profile, Project, Skill } from "@/lib/types";

type Props = { profile: Profile; projects: Project[]; skills: Skill[]; education: Education[] };

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\\D/g, "");
  if (digits.startsWith("0")) return "254" + digits.slice(1);
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("7") || digits.startsWith("1")) return "254" + digits;
  return digits;
}

const slides = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export default function SlidePortfolio({ profile, projects, skills, education }: Props) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const initials = profile.full_name.split(" ").map(part => part[0]).slice(0, 2).join("");
  const skillGroups = skills.reduce<Record<string, string[]>>((groups, skill) => {
    (groups[skill.category || "Technology"] ??= []).push(skill.name + (skill.proficiency ? " · " + skill.proficiency : ""));
    return groups;
  }, {});

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, index));
    setActive(next);
    window.history.replaceState(null, "", "#" + slides[next].id);
    const currentSlide = trackRef.current?.children.item(next) as HTMLElement | null;
    if (currentSlide) currentSlide.scrollTop = 0;
    trackRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const initial = slides.findIndex(slide => slide.id === hash);
    const initialFrame = initial >= 0 ? window.requestAnimationFrame(() => setActive(initial)) : null;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (
        target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "SUMMARY"].includes(target.tagName) ||
        target.closest('[contenteditable="true"], [role="textbox"], [data-slide-keyboard-lock]')
      )) return;
      if (["ArrowRight", "PageDown"].includes(event.key)) { event.preventDefault(); setActive(value => { const next = Math.min(slides.length - 1, value + 1); window.history.replaceState(null, "", "#" + slides[next].id); return next; }); }
      if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); setActive(value => { const next = Math.max(0, value - 1); window.history.replaceState(null, "", "#" + slides[next].id); return next; }); }
      if (event.key === "Home") { event.preventDefault(); goTo(0); }
      if (event.key === "End") { event.preventDefault(); goTo(slides.length - 1); }
    };
    const onHash = () => {
      const index = slides.findIndex(slide => slide.id === window.location.hash.slice(1));
      if (index >= 0) setActive(index);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("hashchange", onHash);
    return () => { if (initialFrame !== null) window.cancelAnimationFrame(initialFrame); window.removeEventListener("keydown", onKeyDown); window.removeEventListener("hashchange", onHash); };
  }, [goTo]);

  const onTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, input, textarea, select, [data-slide-swipe-lock]")) {
      touchStart.current = null;
      return;
    }
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (!touchStart.current) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) goTo(active + (dx < 0 ? 1 : -1));
    touchStart.current = null;
  };

  return (
    <main className="slide-portfolio">
      <div className="site-shell slide-shell">
        <nav className="nav slide-nav" aria-label="Main navigation">
          <a className="brand" href="#home" onClick={event => { event.preventDefault(); goTo(0); }} aria-label={profile.full_name + " home"}>EK<span>.</span></a>
          <div className="navlinks" aria-label="Portfolio sections">
            {slides.slice(1, 5).map((slide, index) => <button key={slide.id} type="button" className={active === index + 1 ? "active" : ""} onClick={() => goTo(index + 1)} aria-current={active === index + 1 ? "page" : undefined}>{slide.label}</button>)}<Link href="/portfolio">Portfolio 2.0</Link><Link href="/blog">Blog</Link><Link href="/cv">CV</Link>
          </div>
          <button className="nav-cta" type="button" onClick={() => goTo(5)}>Let’s talk <ArrowUpRight size={15}/></button>
        </nav>

        <div
          className="slide-progress"
          role="progressbar"
          aria-label="Portfolio section progress"
          aria-valuemin={1}
          aria-valuemax={slides.length}
          aria-valuenow={active + 1}
          aria-valuetext={`${slides[active].label}, slide ${active + 1} of ${slides.length}`}
        >
          <span aria-hidden="true" style={{ width: ((active + 1) / slides.length) * 100 + "%" }}/>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {slides[active].label}, slide {active + 1} of {slides.length}
        </p>

        <div className="slide-track-viewport" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div
            ref={trackRef}
            className="slide-track"
            style={{ transform: `translate3d(-${active * 100}%, 0, 0)` }}
            tabIndex={-1}
            role="region"
            aria-label="Portfolio sections"
          >
            <section className="portfolio-slide hero" id="home" inert={active !== 0} aria-hidden={active !== 0} aria-label="Home" aria-roledescription="slide">
              <div className="hero-copy">
                <div className="eyebrow"><span className="status-dot"/> Information Technology undergraduate · Kenya</div>
                <h1>Building digital products that <span className="gradient-text">solve real problems.</span></h1>
                <p className="hero-lead">{profile.bio}</p>
                <div className="actions">
                  <button className="btn primary" type="button" onClick={() => goTo(2)}>Explore my work <ArrowUpRight size={17}/></button>
                  <button className="btn secondary" type="button" onClick={() => goTo(5)}>Get in touch</button>
                  {profile.resume_url && <a className="btn secondary" href={profile.resume_url} target="_blank" rel="noreferrer">Download CV <ArrowUpRight size={15}/></a>}<Link className="btn secondary" href="/portfolio">Explore Portfolio 2.0 <ArrowUpRight size={15}/></Link>
                </div>
                <div className="hero-meta"><span><MapPin size={14}/> {profile.location || "Kenya"}</span><span><Sparkles size={14}/> {profile.availability_status || "Open to learning and collaboration"}</span></div>
              </div>
              <div className="hero-visual">
                <div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/>
                <div className="profile-card">
                  {profile.avatar_url ? <Image className="avatar" src={profile.avatar_url} alt={profile.full_name} width={600} height={510} unoptimized/> : <div className="avatar avatar-initials">{initials}</div>}
                  <div className="profile-card-copy"><div className="eyebrow">Hello, I’m</div><h2>{profile.full_name}</h2><p>{profile.headline}</p></div>
                  <div className="profile-card-footer"><span className="status-dot"/> Creating, learning, improving</div>
                </div>
                <div className="floating-chip chip-top"><span className="chip-icon">✳</span> Curious by nature</div>
                <div className="floating-chip chip-bottom"><span className="chip-icon">⌘</span> Practical problem solving</div>
              </div>
              <button className="scroll-cue" type="button" onClick={() => goTo(1)} aria-label="Go to About section"><ArrowDown size={15}/> Explore about me</button>
            </section>

            <section className="portfolio-slide intro-strip" id="about" inert={active !== 1} aria-hidden={active !== 1} aria-label="About me" aria-roledescription="slide">
              <div className="section-kicker">01 / About me</div>
              <div><h2>Technology is most powerful when it makes everyday work better.</h2><p className="muted">I’m an Information Technology student at Karatina University, building my experience through practical software projects. I’m interested in thoughtful user experiences, dependable web applications and systems that connect people with the tools they need.</p><div className="slide-inline-actions"><button className="btn secondary" type="button" onClick={() => goTo(2)}>See selected work <ArrowRight size={15}/></button></div></div>
            </section>

            <section className="portfolio-slide section" id="projects" inert={active !== 2} aria-hidden={active !== 2} aria-label="Selected projects" aria-roledescription="slide">
              <div className="section-heading"><div><div className="section-kicker">02 / Selected work</div><h2>Projects & experiments</h2></div><p className="muted">A selection of things I’m building, exploring and learning from.</p></div>
              <div className="project-grid">
                {projects.map((project, index) => <article className="project-card" key={project.id}>
                  <div className="project-art">
                    {project.image_url ? <Image className="project-image" src={project.image_url} alt={project.title + " project preview"} width={960} height={540} unoptimized/> : <div className={"project-placeholder project-placeholder-" + (index % 3)}><span>{String(index + 1).padStart(2,"0")}</span><div className="placeholder-window"><i/><i/><i/><b>{project.title}</b><small>{project.technologies?.slice(0,3).join(" · ") || "Digital product"}</small></div></div>}
                    {project.featured && <span className="featured-label">Featured project</span>}
                  </div>
                  <div className="project-content"><div className="project-index">PROJECT / {String(index + 1).padStart(2,"0")}</div><h3>{project.title}</h3><p className="muted">{project.summary}</p><div className="tags">{project.technologies?.map(tag=><span className="tag" key={tag}>{tag}</span>)}</div><div className="project-links"><Link href={"/projects/" + project.slug}>Case study <ArrowUpRight size={15}/></Link>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer">View live <ArrowUpRight size={15}/></a>}{project.repo_url && <a href={project.repo_url} target="_blank" rel="noreferrer"><Github size={15}/> Source code</a>}</div></div>
                </article>)}
                {projects.length === 0 && <article className="project-card project-empty"><div className="section-kicker">More work coming soon</div><h3>New projects are in progress.</h3><p className="muted">Check back as I continue documenting and publishing my work.</p></article>}
              </div>
            </section>

            <section className="portfolio-slide section skills-section" id="skills" inert={active !== 3} aria-hidden={active !== 3} aria-label="Technical skills" aria-roledescription="slide">
              <div className="section-heading"><div><div className="section-kicker">03 / Toolkit</div><h2>Skills I’m developing</h2></div><p className="muted">A growing set of technologies and practices I use in my projects.</p></div>
              {Object.keys(skillGroups).length ? <div className="skills-grid">{Object.entries(skillGroups).map(([group,items])=><article className="skill-group" key={group}><h3>{group}</h3><div className="tags">{items.map(item=><span className="tag" key={item}>{item}</span>)}</div></article>)}</div> : <p className="muted">My skills list is being updated. Please check back soon.</p>}
            </section>

            <section className="portfolio-slide section education-section" id="education" inert={active !== 4} aria-hidden={active !== 4} aria-label="Education" aria-roledescription="slide">
              <div className="section-heading"><div><div className="section-kicker">04 / Education</div><h2>Learning with purpose</h2></div><p className="muted">Building a strong foundation and applying it through practical work.</p></div>
              <div className="education-list">{education.map(item=><article className="education-item" key={item.id}><div className="education-date">{item.start_year || "Current"} — {item.end_year || "Present"}</div><div><h3>{item.qualification}</h3><p>{item.institution}</p>{item.details && <p className="muted">{item.details}</p>}</div><span className="education-mark">↗</span></article>)}</div>
            </section>

            <section className="portfolio-slide contact-slide" id="contact" inert={active !== 5} aria-hidden={active !== 5} aria-label="Contact" aria-roledescription="slide">
              <div className="contact-section"><div className="contact-glow"/><div className="section-kicker">05 / Contact</div><h2>Have an idea?<br/><span className="gradient-text">Let’s make it useful.</span></h2><p className="muted">I’m open to conversations about technology, collaborations, learning opportunities and meaningful software projects.</p>
                <div className="actions">
                  {profile.email && <a className="btn primary" href={`mailto:${profile.email}`}><Mail size={16}/> Email me</a>}
                  {profile.phone && <>
                    <a className="btn secondary" href={`tel:${profile.phone}`}>Call me</a>
                    <a className="btn secondary" href={`https://wa.me/${getWhatsAppNumber(profile.phone)}?text=${encodeURIComponent("Hello Emanuel, I found your portfolio and would like to connect.")}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a>
                  </>}
                  {profile.github_url && <a className="btn secondary" href={profile.github_url} target="_blank" rel="noreferrer"><Github size={16}/> GitHub</a>}
                  {profile.linkedin_url && <a className="btn secondary" href={profile.linkedin_url} target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn</a>}
                </div>
              </div>
              <footer className="footer"><a className="brand" href="#home" onClick={event => { event.preventDefault(); goTo(0); }}>EK<span>.</span></a><span>© {new Date().getFullYear()} {profile.full_name}. Built with curiosity.</span><button type="button" onClick={() => goTo(0)}>Back to start ↑</button></footer>
            </section>
          </div>
        </div>

        <div className="slide-controls" role="group" aria-label="Slide controls">
          <button type="button" className="slide-arrow" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous slide"><ArrowLeft size={17}/></button>
          <div className="slide-dots">{slides.map((slide, index) => <button key={slide.id} type="button" onClick={() => goTo(index)} className={active === index ? "current" : ""} aria-label={`Go to ${slide.label} slide`} aria-current={active === index ? "step" : undefined}/>)}</div>
          <span className="slide-count">{String(active + 1).padStart(2,"0")} <i>/</i> {String(slides.length).padStart(2,"0")}</span>
          <button type="button" className="slide-arrow" onClick={() => goTo(active + 1)} disabled={active === slides.length - 1} aria-label="Next slide"><ArrowRight size={17}/></button>
        </div>
        <p className="slide-hint">Use the section links, slide controls, or swipe to explore</p>
      </div>
    </main>
  );
}
