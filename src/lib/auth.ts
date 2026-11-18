import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const role = user.app_metadata?.role;
  const allowedEmails = (process.env.ADMIN_EMAILS ?? "").split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
  const emailAllowed = !!user.email && allowedEmails.includes(user.email.toLowerCase());
  if (role !== "portfolio_admin" || !emailAllowed) redirect("/admin/login?error=not-authorized");
  return { supabase, user };
}