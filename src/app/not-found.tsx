import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound(){return <main className="site-shell not-found"><div className="section-kicker">404 / PAGE NOT FOUND</div><div className="not-found-code">404</div><h1>This page took a wrong turn.</h1><p className="muted">The page may have moved, or the link may be out of date. Let’s get you back to the portfolio.</p><div className="actions"><Link className="btn primary" href="/"><Home size={16}/> Back home</Link><Link className="btn secondary" href="/#projects"><ArrowLeft size={15}/> Explore projects</Link></div></main>;}
