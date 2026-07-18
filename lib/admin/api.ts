import "server-only";
import { supabase } from "../supabase";
import type { Discipline, Project } from "../types";

const FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/seshna-admin-files`;

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message);
  return data as T;
}

// Admin reads (include unpublished projects)
export function adminGetProjects(passphrase: string): Promise<Project[]> {
  return rpc("seshna_admin_get_projects", { p_passphrase: passphrase });
}

export function adminGetProject(
  passphrase: string,
  slug: string
): Promise<Project | null> {
  return rpc("seshna_admin_get_project", {
    p_passphrase: passphrase,
    p_slug: slug,
  });
}

export async function adminGetDisciplines(): Promise<Discipline[]> {
  const { data, error } = await supabase
    .from("seshna_disciplines")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data;
}

// Admin writes
export function adminUpdateProject(
  passphrase: string,
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  return rpc("seshna_admin_update_project", {
    p_passphrase: passphrase,
    p_id: id,
    p_patch: patch,
  });
}

export function adminCreateProject(
  passphrase: string,
  slug: string,
  title: string,
  disciplineSlug: string
): Promise<string> {
  return rpc("seshna_admin_create_project", {
    p_passphrase: passphrase,
    p_slug: slug,
    p_title: title,
    p_discipline_slug: disciplineSlug,
    p_patch: {},
  });
}

export function adminAddImage(
  passphrase: string,
  projectId: string,
  path: string,
  width: number,
  height: number
): Promise<string> {
  return rpc("seshna_admin_add_image", {
    p_passphrase: passphrase,
    p_project_id: projectId,
    p_path: path,
    p_width: width,
    p_height: height,
    p_source: "bucket",
  });
}

export function adminUpdateImage(
  passphrase: string,
  id: string,
  patch: Record<string, unknown>
): Promise<void> {
  return rpc("seshna_admin_update_image", {
    p_passphrase: passphrase,
    p_id: id,
    p_patch: patch,
  });
}

export function adminDeleteImage(
  passphrase: string,
  id: string
): Promise<{ storage_path: string; source: string }> {
  return rpc("seshna_admin_delete_image", { p_passphrase: passphrase, p_id: id });
}

export function adminMoveImage(
  passphrase: string,
  id: string,
  dir: -1 | 1
): Promise<void> {
  return rpc("seshna_admin_move_image", {
    p_passphrase: passphrase,
    p_id: id,
    p_dir: dir,
  });
}

// Storage file operations, through the seshna-admin-files edge function
async function fileOp(passphrase: string, payload: Record<string, unknown>) {
  const res = await fetch(FUNCTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      "x-admin-passphrase": passphrase,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `file op failed (${res.status})`);
  return data;
}

export function uploadToBucket(
  passphrase: string,
  path: string,
  bytes: Buffer,
  contentType = "image/jpeg"
) {
  return fileOp(passphrase, {
    action: "upload",
    path,
    content_type: contentType,
    data_base64: bytes.toString("base64"),
  });
}

export function deleteFromBucket(passphrase: string, path: string) {
  return fileOp(passphrase, { action: "delete", path });
}
