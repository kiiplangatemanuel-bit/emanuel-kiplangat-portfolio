import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { defaultProfile } from "@/lib/types";
import { createProject, deleteProject, saveProfile, signOut, updateProject } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({searchParams}:{searchParams:Promise<{updated?:string}>}) {
  const { supabase, user } = await requireAdmin();
  const [{data:profile},{data:projects}] = await Promise.all([
    supabase.from("portfolio_profile").select("*").eq("id",1).maybeSingle(),
    supabase.from("portfolio_projects").select("*").order("created_at",{ascending:false})
  ]);
  const p = profile ?? defaultProfile;
  const params = await searchParams;
  return <main className="admin-shell"><div className="container">
    <div className="nav"><div><div className="eyebrow">Portfolio CMS</div><h2 style={{margin:"8px 0"}}>Website administration</h2><p className="muted">{user.email}</p></div><form action={signOut}><button className="btn">Sign out</button></form></div>
    <div className="admin-nav"><a className="btn" href="#profile">Profile & contact</a><a className="btn" href="#projects">Projects</a><Link className="btn" href="/">View public website ↗</Link></div>
    {params.updated && <p className="notice">Changes saved successfully.</p>}
    <section className="admin-panel" id="profile" style={{marginTop:24}}>
      <div className="eyebrow">01 / Public profile</div><h2 style={{marginTop:10}}>Profile and contact details</h2>
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
        <button className="btn primary">Save profile and contact details</button>
      </form>
    </section>

    <section className="admin-panel" id="projects" style={{marginTop:24}}>
      <div className="eyebrow">02 / Portfolio content</div><h2 style={{marginTop:10}}>Add a project</h2>
      <form action={createProject} className="form">
        <div className="grid">
          <label className="field">Project title<input name="title" required placeholder="OneCore Digital Hub"/></label>
          <label className="field">URL slug<input name="slug" placeholder="onecore-digital-hub"/></label>
          <label className="field">Technologies (comma separated)<input name="technologies" placeholder="Next.js, TypeScript, PostgreSQL"/></label>
          <label className="field">Live website URL<input name="live_url" type="url"/></label>
          <label className="field">Repository URL<input name="repo_url" type="url"/></label>
          <label className="field">Project image URL<input name="image_url" type="url"/></label>
        </div>
        <label className="field">Short summary<textarea name="summary" required/></label>
        <label className="field">Full description<textarea name="description"/></label>
        <label className="field">Display order<input name="sort_order" type="number" defaultValue="0"/></label>
        <label className="field" style={{display:"flex",flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="featured"/> Featured project</label>
        <label className="field" style={{display:"flex",flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="published" defaultChecked/> Publish on public website</label>
        <button className="btn primary">Add project</button>
      </form>
      <h2 style={{marginTop:36}}>Manage existing projects</h2>
      <div className="grid">{(projects ?? []).map(project=><article className="card" key={project.id}>
        <h3>{project.title}</h3><p className="muted">Current status: {project.published ? "Published" : "Draft"}</p>
        <details><summary style={{cursor:"pointer",color:"var(--accent)",margin:"14px 0"}}>Edit project details</summary>
          <form action={updateProject} className="form" style={{marginTop:14}}>
            <input type="hidden" name="id" value={project.id}/>
            <label className="field">Title<input name="title" required defaultValue={project.title}/></label>
            <label className="field">Slug<input name="slug" required defaultValue={project.slug}/></label>
            <label className="field">Short summary<textarea name="summary" defaultValue={project.summary}/></label>
            <label className="field">Full description<textarea name="description" defaultValue={project.description}/></label>
            <label className="field">Technologies (comma separated)<input name="technologies" defaultValue={(project.technologies ?? []).join(", ")}/></label>
            <label className="field">Live website URL<input name="live_url" type="url" defaultValue={project.live_url}/></label>
            <label className="field">Repository URL<input name="repo_url" type="url" defaultValue={project.repo_url}/></label>
            <label className="field">Image URL<input name="image_url" type="url" defaultValue={project.image_url}/></label>
            <label className="field">Display order<input name="sort_order" type="number" defaultValue={project.sort_order}/></label>
            <label className="field" style={{display:"flex",flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="featured" defaultChecked={project.featured}/> Featured project</label>
            <label className="field" style={{display:"flex",flexDirection:"row",alignItems:"center"}}><input type="checkbox" name="published" defaultChecked={project.published}/> Published</label>
            <button className="btn primary">Save project changes</button>
          </form>
        </details>
        <form action={deleteProject} style={{marginTop:12}}><input type="hidden" name="id" value={project.id}/><button className="btn" style={{color:"#fca5a5"}}>Delete project</button></form>
      </article>)}</div>
    </section>
    <p className="muted" style={{marginTop:24}}>You can manage your public profile, contact information and project portfolio here. Dedicated editing forms for skills, education, CV files and image uploads are planned as the next CMS increment.</p>
  </div></main>;
}