import { supabase } from "./supabase";
import type { Discipline, Experience, Profile, Project } from "./types";

const PROJECT_SELECT =
  "*, seshna_disciplines(*), seshna_project_images(*)";

export async function getDisciplines(): Promise<Discipline[]> {
  const { data, error } = await supabase
    .from("seshna_disciplines")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("seshna_projects")
    .select(PROJECT_SELECT)
    .order("sort_order");
  if (error) throw error;
  for (const p of data) {
    p.seshna_project_images.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    );
  }
  return data;
}

export async function getProject(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from("seshna_projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (data) {
    data.seshna_project_images.sort(
      (a: { sort_order: number }, b: { sort_order: number }) =>
        a.sort_order - b.sort_order
    );
  }
  return data;
}

export async function getProfile(): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("seshna_profile")
    .select("*")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from("seshna_experiences")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}
