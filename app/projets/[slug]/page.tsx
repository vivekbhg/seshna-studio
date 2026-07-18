import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject } from "@/lib/data";
import { imageUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

const GRID_SLUGS = new Set([
  "faire-corps",
  "espace-culinaire",
  "creation-de-bijoux",
]);

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const facts: Array<[string, string | null]> = [
    ["discipline", project.seshna_disciplines.label],
    ["année", project.year_label],
    ["lieu", project.location],
    ["maîtrise d'ouvrage", project.client],
    ["agence / contexte", project.studio],
    ["rôle", project.role],
    ["surface", project.area_m2 ? `${project.area_m2.toLocaleString("fr-FR")} m²` : null],
    ["budget", project.budget_label],
    ["équipe", project.team.length ? project.team.join(", ") : null],
    [
      "certifications",
      project.certifications.length ? project.certifications.join(", ") : null,
    ],
    ["distinction", project.awards],
    ["crédits images", project.image_credits],
  ];

  const asGrid = GRID_SLUGS.has(project.slug);

  return (
    <main className="project">
      <Link href="/" className="back">
        ← projets
      </Link>
      <div className="project-head">
        <p className="discipline">{project.seshna_disciplines.label}</p>
        <h1>{project.title}</h1>
        {project.subtitle && <p className="subtitle">{project.subtitle}</p>}
      </div>
      <div className="project-body">
        <dl className="facts">
          {facts
            .filter(([, v]) => v)
            .map(([label, value]) => (
              <div className="fact" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
        </dl>
        <div>
          {project.description && (
            <p className="project-description">{project.description}</p>
          )}
          {asGrid ? (
            <div className="thumb-grid">
              {project.seshna_project_images.map((img) => (
                <img
                  key={img.id}
                  src={imageUrl(img.storage_path)}
                  alt={img.alt ?? project.title}
                  loading="lazy"
                />
              ))}
            </div>
          ) : (
            <div className="project-images">
              {project.seshna_project_images.map((img) => (
                <img
                  key={img.id}
                  src={imageUrl(img.storage_path)}
                  alt={img.alt ?? project.title}
                  loading="lazy"
                  width={img.width ?? undefined}
                  height={img.height ?? undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
