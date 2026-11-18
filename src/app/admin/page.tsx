import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { defaultProfile } from "@/lib/types";
import {
  createEducation, createProject, createSkill, deleteEducation, deleteProject,
  deleteSkill, saveProfile, signOut, updateEducation, updateProject, updateSkill
} from "./actions";
import ResumeUpload from "./resume-upload";
import ProfileImageUpload from "./profile-image-upload";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({searchParams}:{searchParams:Promise<{updated?:string}>}) {
  const { supabase, user } = await requireAdmin();
  const [{data:profile},{data:projects},{data:skills},{data:education}] = await Promise.all([
    supabase.from("portfolio_profile").select("*").eq("id",1).maybeSingle(),
    supabase.from("portfolio_projects").select("*").order("sort_order"),
    supabase.from("portfolio_skills").select("*").order("sort_order"),
    supabase.from("portfolio_education").select("*").order("sort_order")
  ]);
  const p = profile ?? defaultProfile;
  const params = await searchParams;

  return <main className="admin-shell"><div className="container">
    <header className="admin-header">
      <div><div className="eyebrow">Private workspace / Portfolio CMS</div><h1>Manage your portfolio.</h1><p className="muted">Signed in as {user.email}. Changes are reflected on your public website.</p></div>
      <div className="admin-header-actions"><Link className="btn secondary" href="/">View public website ↗</Link><form action={signOut}><button className="btn secondary">Sign out</button></form></div>
    </header>
    <nav className="admin-nav" aria-label="CMS sections">
      <a className="btn secondary" href="#profile">Profile</a><a className="btn secondary" href="#resume">CV</a><a className="btn secondary" href="#projects">Projects</a><a className="btn secondary" href="#skills">Skills</a><a className="btn secondary" href="#education">Education</a>
    </nav>
    {params.updated && <p className="notice" role="status">Changes saved successfully.</p>}

    <section className="admin-panel" id="profile">
      <div className="section-kicker">01 / Identity</div><h2>Profile and contact</h2><p className="muted">This information appears on your public portfolio.</p>
      <form action={saveProfile} className="form">
        <div className="grid">
          <label className="field">Full name<input name="full_name" required defaultValue={p.full_name}/></label>
          <label className="field">Professional headline<input name="headline" defaultValue={p.headline}/></label>
          <label className="field">Location<input name="location" defaultValue={p.location}/></label>
          <label className="field">Public email<input name="email" type="email" defaultValue={p.email}/></label>
          <label className="field">Phone number<input name="phone" type="tel" defaultValue={p.phone}/></label>
          <label className="field">Profile image URL<input name="avatar_url" type="url" defaultValue={p.avatar_url}/></label>
          <label className="field">GitHub URL<input name="github_url" type="url" defaultValue={p.github_url}/></label>
          <label className="field">LinkedIn URL<input name="linkedin_url" type="url" defaultValue={p.linkedin_url}/></label>
        </div>
        <label className="field">Biography<textarea name="bio" defaultValue={p.bio}/></label>
        <button className="btn primary">Save profile</button>
      </form>
      <ProfileImageUpload currentUrl={p.avatar_url ?? ""}/>
    </section>

    <section className="admin-panel" id="resume">
      <div className="section-kicker">02 / Documents</div><h2>Curriculum vitae</h2><p className="muted">Upload a PDF CV. The file is stored in your portfolio storage and becomes publicly downloadable.</p>
      <ResumeUpload currentUrl={p.resume_url ?? ""}/>
    </section>

    <section className="admin-panel" id="projects">
      <div className="section-kicker">03 / Work</div><h2>Projects</h2><p className="muted">Create, edit, publish or remove projects from your public portfolio.</p>
      <details className="cms-create" open><summary>Add a new project</summary>
        <form action={createProject} className="form">
          <div className="grid">
            <label className="field">Project title<input name="title" required placeholder="Project title"/></label>
            <label className="field">URL slug<input name="slug" placeholder="project-name"/></label>
            <label className="field">Technologies (comma separated)<input name="technologies" placeholder="Next.js, TypeScript, PostgreSQL"/></label>
            <label className="field">Live website URL<input name="live_url" type="url"/></label>
            <label className="field">Repository URL<input name="repo_url" type="url"/></label>
            <label className="field">Project image URL<input name="image_url" type="url"/></label>
          </div>
          <label className="field">Short summary<textarea name="summary" required/></label>
          <label className="field">Full description<textarea name="description"/></label>
          <label className="field">Display order<input name="sort_order" type="number" defaultValue="0"/></label>
          <label className="check-field"><input type="checkbox" name="featured"/> Featured project</label>
          <label className="check-field"><input type="checkbox" name="published" defaultChecked/> Publish on public website</label>
          <button className="btn primary">Create project</button>
        </form>
      </details>
      <div className="cms-list">{(projects ?? []).map(project=><article className="cms-item" key={project.id}>
        <div className="cms-item-heading"><div><h3>{project.title}</h3><p className="muted">{project.published ? "Published" : "Draft"}{project.featured ? " · Featured" : ""}</p></div><span className="cms-id">PROJECT</span></div>
        <details><summary>Edit project</summary>
          <form action={updateProject} className="form cms-edit-form">
            <input type="hidden" name="id" value={project.id}/>
            <div className="grid">
              <label className="field">Title<input name="title" required defaultValue={project.title}/></label>
              <label className="field">Slug<input name="slug" required defaultValue={project.slug}/></label>
              <label className="field">Technologies<input name="technologies" defaultValue={(project.technologies ?? []).join(", ")}/></label>
              <label className="field">Live website URL<input name="live_url" type="url" defaultValue={project.live_url}/></label>
              <label className="field">Repository URL<input name="repo_url" type="url" defaultValue={project.repo_url}/></label>
              <label className="field">Image URL<input name="image_url" type="url" defaultValue={project.image_url}/></label>
              <label className="field">Display order<input name="sort_order" type="number" defaultValue={project.sort_order}/></label>
            </div>
            <label className="field">Short summary<textarea name="summary" defaultValue={project.summary}/></label>
            <label className="field">Full description<textarea name="description" defaultValue={project.description}/></label>
            <label className="check-field"><input type="checkbox" name="featured" defaultChecked={project.featured}/> Featured</label>
            <label className="check-field"><input type="checkbox" name="published" defaultChecked={project.published}/> Published</label>
            <button className="btn primary">Save project</button>
          </form>
        </details>
        <form action={deleteProject} className="delete-form"><input type="hidden" name="id" value={project.id}/><button className="btn danger">Delete project</button></form>
      </article>)}</div>
    </section>

    <section className="admin-panel" id="skills">
      <div className="section-kicker">04 / Capabilities</div><h2>Skills and technologies</h2><p className="muted">Only add skills you can confidently discuss and demonstrate.</p>
      <details className="cms-create"><summary>Add a skill</summary>
        <form action={createSkill} className="form">
          <div className="grid">
            <label className="field">Skill name<input name="name" required placeholder="TypeScript"/></label>
            <label className="field">Category<input name="category" defaultValue="Technology" placeholder="Development"/></label>
            <label className="field">Display order<input name="sort_order" type="number" defaultValue="0"/></label>
          </div>
          <button className="btn primary">Add skill</button>
        </form>
      </details>
      <div className="cms-list">{(skills ?? []).map(skill=><article className="cms-item compact" key={skill.id}>
        <form action={updateSkill} className="form inline-edit"><input type="hidden" name="id" value={skill.id}/>
          <label className="field">Skill<input name="name" required defaultValue={skill.name}/></label>
          <label className="field">Category<input name="category" defaultValue={skill.category}/></label>
          <label className="field">Order<input name="sort_order" type="number" defaultValue={skill.sort_order}/></label>
          <button className="btn primary">Save</button>
        </form>
        <form action={deleteSkill} className="delete-form"><input type="hidden" name="id" value={skill.id}/><button className="btn danger">Delete</button></form>
      </article>)}</div>
      {(!skills || skills.length === 0) && <p className="empty-note">No skills added yet.</p>}
    </section>

    <section className="admin-panel" id="education">
      <div className="section-kicker">05 / Background</div><h2>Education</h2><p className="muted">Keep course and graduation information accurate and up to date.</p>
      <details className="cms-create"><summary>Add education</summary>
        <form action={createEducation} className="form">
          <div className="grid">
            <label className="field">Institution<input name="institution" required placeholder="Karatina University"/></label>
            <label className="field">Qualification<input name="qualification" required placeholder="Bachelor of Science in Information Technology"/></label>
            <label className="field">Start year<input name="start_year" placeholder="2023"/></label>
            <label className="field">End year / expected year<input name="end_year" placeholder="2027"/></label>
            <label className="field">Display order<input name="sort_order" type="number" defaultValue="0"/></label>
          </div>
          <label className="field">Details<textarea name="details" placeholder="Expected graduation in 2027."/></label>
          <button className="btn primary">Add education</button>
        </form>
      </details>
      <div className="cms-list">{(education ?? []).map(item=><article className="cms-item" key={item.id}>
        <form action={updateEducation} className="form">
          <input type="hidden" name="id" value={item.id}/>
          <div className="grid">
            <label className="field">Institution<input name="institution" required defaultValue={item.institution}/></label>
            <label className="field">Qualification<input name="qualification" required defaultValue={item.qualification}/></label>
            <label className="field">Start year<input name="start_year" defaultValue={item.start_year}/></label>
            <label className="field">End year<input name="end_year" defaultValue={item.end_year}/></label>
            <label className="field">Display order<input name="sort_order" type="number" defaultValue={item.sort_order}/></label>
          </div>
          <label className="field">Details<textarea name="details" defaultValue={item.details}/></label>
          <div className="cms-actions"><button className="btn primary">Save education</button></div>
        </form>
        <form action={deleteEducation} className="delete-form"><input type="hidden" name="id" value={item.id}/><button className="btn danger">Delete education</button></form>
      </article>)}</div>
    </section>
    <footer className="admin-footer"><span>Portfolio CMS · Changes are saved to your Supabase project.</span><Link href="/">Return to public portfolio ↗</Link></footer>
  </div></main>;
}
