const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "/images";

export function imageUrl(storagePath: string): string {
  return `${base}/${storagePath}`;
}
