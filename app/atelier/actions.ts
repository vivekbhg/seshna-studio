"use server";

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, getAdminPassphrase, verifyPassphrase } from "@/lib/admin/auth";
import {
  adminAddImage,
  adminCreateProject,
  adminDeleteImage,
  adminGetProject,
  adminMoveImage,
  adminUpdateImage,
  adminUpdateProject,
  deleteFromBucket,
  uploadToBucket,
} from "@/lib/admin/api";
import { imageUrl } from "@/lib/images";

async function requireAdmin(): Promise<string> {
  const pass = await getAdminPassphrase();
  if (!pass) redirect("/atelier");
  return pass;
}

function refresh(slug?: string) {
  revalidatePath("/");
  revalidatePath("/atelier");
  if (slug) {
    revalidatePath(`/projets/${slug}`);
    revalidatePath(`/atelier/projets/${slug}`);
  }
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// --- session ---

export async function login(formData: FormData) {
  const pass = String(formData.get("passphrase") ?? "");
  const ok = pass && (await verifyPassphrase(pass));
  if (!ok) redirect("/atelier?erreur=1");
  const store = await cookies();
  store.set(ADMIN_COOKIE, pass, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/atelier");
}

export async function logout() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/atelier");
}

// --- projects ---

export async function saveProject(
  projectId: string,
  slug: string,
  formData: FormData
) {
  const pass = await requireAdmin();
  const patch: Record<string, unknown> = {
    title: String(formData.get("title") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    description: String(formData.get("description") ?? ""),
    year_label: String(formData.get("year_label") ?? ""),
    location: String(formData.get("location") ?? ""),
    client: String(formData.get("client") ?? ""),
    studio: String(formData.get("studio") ?? ""),
    role: String(formData.get("role") ?? ""),
    area_m2: String(formData.get("area_m2") ?? ""),
    budget_label: String(formData.get("budget_label") ?? ""),
    awards: String(formData.get("awards") ?? ""),
    image_credits: String(formData.get("image_credits") ?? ""),
    team: splitList(formData.get("team")),
    certifications: splitList(formData.get("certifications")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    discipline_slug: String(formData.get("discipline_slug") ?? ""),
  };
  await adminUpdateProject(pass, projectId, patch);
  refresh(slug);
  redirect(`/atelier/projets/${slug}?ok=1`);
}

export async function createProject(formData: FormData) {
  const pass = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) redirect("/atelier/nouveau?erreur=titre");
  const slug =
    slugify(String(formData.get("slug") ?? "")) || slugify(title);
  const discipline = String(formData.get("discipline_slug") ?? "");
  await adminCreateProject(pass, slug, title, discipline);
  refresh(slug);
  redirect(`/atelier/projets/${slug}`);
}

// --- images ---

export async function uploadImages(
  projectId: string,
  slug: string,
  formData: FormData
) {
  const pass = await requireAdmin();
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    const input = Buffer.from(await file.arrayBuffer());
    const processed = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toBuffer();
    const meta = await sharp(processed).metadata();
    const dest = `${slug}/${Date.now()}-${Math.floor(Math.random() * 1e6)}.jpg`;
    await uploadToBucket(pass, dest, processed);
    await adminAddImage(pass, projectId, dest, meta.width ?? 0, meta.height ?? 0);
  }
  refresh(slug);
}

export async function rotateImage(imageId: string, slug: string) {
  const pass = await requireAdmin();
  const project = await adminGetProject(pass, slug);
  const img = project?.seshna_project_images.find((i) => i.id === imageId);
  if (!img) throw new Error("image introuvable");

  let input: Buffer;
  if (img.source === "repo") {
    const safe = path.normalize(img.storage_path);
    if (safe.startsWith("..") || path.isAbsolute(safe)) {
      throw new Error("chemin invalide");
    }
    input = await fs.readFile(path.join(process.cwd(), "public/images", safe));
  } else {
    const res = await fetch(imageUrl(img.storage_path, "bucket"));
    if (!res.ok) throw new Error("image inaccessible");
    input = Buffer.from(await res.arrayBuffer());
  }

  const rotated = await sharp(input)
    .rotate(270) // 90° anticlockwise
    .jpeg({ quality: 85 })
    .toBuffer();
  const meta = await sharp(rotated).metadata();
  const dest = `${slug}/rot-${Date.now()}.jpg`;
  await uploadToBucket(pass, dest, rotated);
  await adminUpdateImage(pass, imageId, {
    storage_path: dest,
    width: meta.width,
    height: meta.height,
    source: "bucket",
  });
  if (img.source === "bucket") {
    await deleteFromBucket(pass, img.storage_path).catch(() => {});
  }
  refresh(slug);
}

export async function deleteImage(imageId: string, slug: string) {
  const pass = await requireAdmin();
  const removed = await adminDeleteImage(pass, imageId);
  if (removed.source === "bucket") {
    await deleteFromBucket(pass, removed.storage_path).catch(() => {});
  }
  refresh(slug);
}

export async function moveImage(imageId: string, slug: string, dir: -1 | 1) {
  const pass = await requireAdmin();
  await adminMoveImage(pass, imageId, dir);
  refresh(slug);
}

export async function setCover(imageId: string, slug: string) {
  const pass = await requireAdmin();
  await adminUpdateImage(pass, imageId, { is_cover: true });
  refresh(slug);
}

export async function saveImageAlt(
  imageId: string,
  slug: string,
  formData: FormData
) {
  const pass = await requireAdmin();
  await adminUpdateImage(pass, imageId, {
    alt: String(formData.get("alt") ?? ""),
  });
  refresh(slug);
}
