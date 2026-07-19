import Link from "next/link";
import { Reveal } from "./ui/motion";
import { getDisciplines, getProjects } from "@/lib/data";
import { imageUrl } from "@/lib/images";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

function ProjectCard({ project }: { project: Project }) {
  const cover =
    project.seshna_project_images.find((i) => i.is_cover) ??
    project.seshna_project_images[0];
  return (
    <Link href={`/projets/${project.slug}`} className="card">
      <div className="frame">
        {cover && (
          <img
            src={imageUrl(cover.storage_path, cover.source)}
            alt={cover.alt ?? project.title}
            loading="lazy"
            width={cover.width ?? undefined}
            height={cover.height ?? undefined}
          />
        )}
      </div>
      <div className="caption">
        <h3>
          <span className="num">
            {String(project.sort_order).padStart(2, "0")}
          </span>
          {project.title}
        </h3>
        <p>
          {[project.subtitle, project.year_label].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}

export default async function Home() {
  const [disciplines, projects] = await Promise.all([
    getDisciplines(),
    getProjects(),
  ]);

  return (
    <main>
      {disciplines.map((d) => {
        const items = projects.filter(
          (p) => p.seshna_disciplines.slug === d.slug
        );
        if (items.length === 0) return null;
        return (
          <section key={d.id} id={d.slug} className="section">
            <Reveal>
              <div className="section-head">
                <h2>{d.label}</h2>
                <span className="count">{items.length}</span>
              </div>
            </Reveal>
            <div className="grid">
              {items.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
