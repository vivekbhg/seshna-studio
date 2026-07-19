import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/app/ui/motion";
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
      <Reveal>
        <div className="project-head">
          <p className="discipline">{project.seshna_disciplines.label}</p>
          <h1>{project.title}</h1>
          {project.subtitle && <p className="subtitle">{project.subtitle}</p>}
        </div>
      </Reveal>
      <div className="project-body">
        <Reveal className="facts-slot" delay={0.1}>
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
        </Reveal>
        <div>
          {project.description && (
            <Reveal delay={0.15}>
              <p className="project-description">{project.description}</p>
            </Reveal>
          )}
          {asGrid ? (
            <div className="thumb-grid">
              {project.seshna_project_images.map((img, i) => (
                <Reveal key={img.id} delay={(i % 4) * 0.06}>
                  <img
                    src={imageUrl(img.storage_path, img.source)}
                    alt={img.alt ?? project.title}
                    loading="lazy"
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="project-images">
              {project.seshna_project_images.map((img) => (
                <Reveal key={img.id}>
                  <img
                    src={imageUrl(img.storage_path, img.source)}
                    alt={img.alt ?? project.title}
                    loading="lazy"
                    width={img.width ?? undefined}
                    height={img.height ?? undefined}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
