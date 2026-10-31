import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/** Verified user (checked with the Auth server), memoised per request. */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
});

export const getProfile = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return data;
});

/** The MVP supports one workspace per user: the first membership. */
export const getWorkspace = cache(async () => {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("workspace_members")
    .select("role, workspaces(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!data?.workspaces) return null;
  return { workspace: data.workspaces as Workspace, role: data.role };
});
