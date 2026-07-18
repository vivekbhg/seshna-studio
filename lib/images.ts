const repoBase = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "/images";
const bucketBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/seshna`;

export function imageUrl(
  storagePath: string,
  source: "repo" | "bucket" = "repo"
): string {
  return source === "bucket"
    ? `${bucketBase}/${storagePath}`
    : `${repoBase}/${storagePath}`;
}
