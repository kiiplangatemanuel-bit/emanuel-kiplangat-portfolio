import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { deleteContent, saveContent, updateEnquiry } from "./actions";

export const dynamic="force-dynamic";
type Row={id:string;title?:string;name?:string;role?:string;organization?:string;issuer?:string;quote?:string;person_name?:string;person_role?:string;excerpt?:string;description?:string;content?:string;slug?:string;tags?:string[];start_date?:string;end_date?:string;issue_date?:string;credential_url?:string;url?:string;published?:boolean;sort_order?:number;published_at?:string|null};
const sections=[
 {kind:"experience",title:"Experience timeline",hint:"Add only genuine roles, placements, volunteering or project responsibilities.",titleLabel:"Role / position",orgLabel:"Organization",dateLabel:"Start date",extraDate:"End date",descLabel:"Description"},
 {kind:"certification",title:"Certifications",hint:"Add credentials you have actually earned, with issuer and credential link.",titleLabel:"Certification name",orgLabel:"Issuing organization",dateLabel:"Issue date",descLabel:"Description"},
 {kind:"post",title:"Blog articles",hint:"Publish learning notes, engineering write-ups and project retrospectives.",titleLabel:"Article title",orgLabel:"Slug",dateLabel:"Tags (comma separated)",descLabel:"Article content"},
 {kind:"service",title:"Services",hint:"Describe the work you are genuinely prepared to offer.",titleLabel:"Service",descLabel:"Description"},
 {kind:"testimonial",title:"Testimonials",hint:"Only publish genuine feedback with the contributor’s permission.",titleLabel:"Contributor name",orgLabel:"Role / organization",dateLabel:"Organization",descLabel:"Exact testimonial quote"}
] as const;

export default async function ContentAdmin({searchParams}:{searchParams:Promise<{saved?:string;deleted?:string;enquiry?:string}>}){
 const {supabase,user}=await requireAdmin();
 const [experience,certifications,posts,services,testimonials,enquiries]=await Promise.all([
  supabase.from("portfolio_experience").select("*").order("sort_order"),
  supabase.from("portfolio_certifications").select("*").order("sort_order"),
  supabase.from("portfolio_posts").select("*").order("created_at",{ascending:false}),
  supabase.from("portfolio_services").select("*").order("sort_order"),
  supabase.from("portfolio_testimonials").select("*").order("sort_order"),
  supabase.from("portfolio_enquiries").select("*").order("created_at",{ascending:false})
 ]);
 const data:Record<string,Row[]>={experience:experience.data??[],certification:certifications.data??[],post:posts.data??[],service:services.data??[],testimonial:testimonials.data??[]};
 const params=await searchParams;
 return <main className="admin-shell"><div className="container">
  <header className="admin-header"><div><div className="eyebrow">Portfolio CMS / Extended content</div><h1>Portfolio content.</h1><p className="muted">Signed in as {user.email}. Manage the additional public sections here.</p></div><div className="admin-header-actions"><Link className="btn secondary" href="/admin">← Main dashboard</Link><Link className="btn secondary" href="/">View website ↗</Link></div></header>
  {(params.saved||params.deleted||params.enquiry)&&<p className="notice" role="status">Your changes have been saved.</p>}
  {sections.map(section=><section className="admin-panel" key={section.kind}><div className="section-kicker">CONTENT / {section.kind.toUpperCase()}</div><h2>{section.title}</h2><p className="muted">{section.hint}</p>
   <details className="cms-create"><summary>Add {section.kind}</summary><form action={saveContent} className="form"><input type="hidden" name="kind" value={section.kind}/>
    <label className="field">{section.titleLabel}<input name="title" required/></label>
    {("orgLabel" in section)&&<label className="field">{section.orgLabel}<input name={section.kind==="post"?"slug":section.kind==="certification"?"organization":"organization"}/></label>}
    {("dateLabel" in section)&&<label className="field">{section.dateLabel}<input name={section.kind==="post"?"tags":"start_date"}/></label>}
    {section.kind==="experience"&&<label className="field">End date<input name="end_date" placeholder="Present"/></label>}
    {section.kind==="certification"&&<label className="field">Credential URL<input name="url" type="url"/></label>}
    {section.kind==="post"&&<label className="field">Short excerpt<input name="excerpt" required/></label>}
    <label className="field">{section.descLabel}<textarea name="description" rows={section.kind==="post"?10:4} required/></label>
    {section.kind!=="service"&&<label className="field">Display order<input name="sort_order" type="number" defaultValue="0"/></label>}
    <label className="check-field"><input type="checkbox" name="published" defaultChecked={section.kind!=="testimonial"}/> Publish publicly</label>
    <button className="btn primary">Save {section.kind}</button></form></details>
   <div className="cms-list">{data[section.kind].map(row=><article className="cms-item" key={row.id}><div className="cms-item-heading"><div><h3>{row.title||row.name||row.role||row.person_name}</h3><p className="muted">{row.published?"Published":"Draft"}</p></div></div><details><summary>Edit item</summary><form action={saveContent} className="form cms-edit-form"><input type="hidden" name="kind" value={section.kind}/><input type="hidden" name="id" value={row.id}/>
    <label className="field">{section.titleLabel}<input name="title" required defaultValue={row.title||row.name||row.role||row.person_name||""}/></label>
    {("orgLabel" in section)&&<label className="field">{section.orgLabel}<input name={section.kind==="post"?"slug":"organization"} defaultValue={row.slug||row.organization||row.issuer||row.person_role||""}/></label>}
    {("dateLabel" in section)&&<label className="field">{section.dateLabel}<input name={section.kind==="post"?"tags":"start_date"} defaultValue={section.kind==="post"?(row.tags||[]).join(", "):row.start_date||row.issue_date||""}/></label>}
    {section.kind==="experience"&&<label className="field">End date<input name="end_date" defaultValue={row.end_date||""}/></label>}
    {section.kind==="certification"&&<label className="field">Credential URL<input name="url" type="url" defaultValue={row.credential_url||""}/></label>}
    {section.kind==="post"&&<label className="field">Short excerpt<input name="excerpt" defaultValue={row.excerpt||""}/></label>}
    <label className="field">{section.descLabel}<textarea name="description" rows={section.kind==="post"?10:4} defaultValue={row.description||row.content||row.quote||""}/></label>
    <label className="check-field"><input type="checkbox" name="published" defaultChecked={row.published}/> Publish publicly</label><button className="btn primary">Update</button></form></details>
    <form action={deleteContent} className="delete-form"><input type="hidden" name="kind" value={section.kind}/><input type="hidden" name="id" value={row.id}/><button className="btn danger">Delete</button></form>
   </article>)}</div>
  </section>)}
  <section className="admin-panel"><div className="section-kicker">INBOX / CONTACT</div><h2>Contact enquiries</h2><p className="muted">Messages submitted through the public contact form.</p>
   {(enquiries.data??[]).length? <div className="cms-list">{(enquiries.data??[]).map(item=><article className="cms-item" key={item.id}><div className="cms-item-heading"><div><h3>{item.subject}</h3><p className="muted">{item.name} · {item.email} · {item.enquiry_type}</p></div><span className="cms-id">{item.status}</span></div><p className="muted">{item.message}</p><form action={updateEnquiry} className="inline-edit"><input type="hidden" name="id" value={item.id}/><label className="field">Status<select name="status" defaultValue={item.status}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select></label><button className="btn primary">Update status</button></form></article>)}</div>:<p className="empty-note">No enquiries received yet.</p>}
  </section>
 </div></main>;
}
