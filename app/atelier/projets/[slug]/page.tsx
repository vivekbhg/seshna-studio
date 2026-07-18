import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminPassphrase } from "@/lib/admin/auth";
import { adminGetDisciplines, adminGetProject } from "@/lib/admin/api";
import { imageUrl } from "@/lib/images";
import ConfirmButton from "../../ui/ConfirmButton";
import {
  deleteImage,
  moveImage,
  rotateImage,
  saveImageAlt,
  saveProject,
  setCover,
  uploadImages,
} from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProjet({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ ok?: string }>;
}) {
  const pass = await getAdminPassphrase();
  if (!pass) redirect("/atelier");
  const { slug } = await params;
  const { ok } = await searchParams;
  const [project, disciplines] = await Promise.all([
    adminGetProject(pass, slug),
    adminGetDisciplines(),
  ]);
  if (!project) notFound();

  const save = saveProject.bind(null, project.id, project.slug);
  const upload = uploadImages.bind(null, project.id, project.slug);

  return (
    <main className="atelier">
      <Link href="/atelier" className="back">
        ← atelier
      </Link>
      <div className="atelier-head">
        <h1>{project.title}</h1>
        <Link
          href={`/projets/${project.slug}`}
          className="action"
          target="_blank"
        >
          voir la page →
        </Link>
      </div>
      {ok && <p className="success">modifications enregistrées</p>}

      <form action={save} className="atelier-form">
        <section className="form-section">
          <h2>contenu</h2>
          <div className="form-grid">
            <label className="wide">
              titre
              <input type="text" name="title" defaultValue={project.title} required />
            </label>
            <label className="wide">
              sous-titre
              <input
                type="text"
                name="subtitle"
                defaultValue={project.subtitle ?? ""}
                placeholder="programme, maîtrise d'ouvrage…"
              />
            </label>
            <label className="wide">
              description
              <textarea
                name="description"
                rows={8}
                defaultValue={project.description ?? ""}
              />
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>détails</h2>
          <div className="form-grid">
            <label>
              discipline
              <select
                name="discipline_slug"
                defaultValue={project.seshna_disciplines.slug}
              >
                {disciplines.map((d) => (
                  <option key={d.id} value={d.slug}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              année
              <input
                type="text"
                name="year_label"
                defaultValue={project.year_label ?? ""}
                placeholder="2022 // 2026"
              />
            </label>
            <label>
              lieu
              <input type="text" name="location" defaultValue={project.location ?? ""} />
            </label>
            <label>
              maîtrise d&apos;ouvrage
              <input type="text" name="client" defaultValue={project.client ?? ""} />
            </label>
            <label>
              agence / contexte
              <input type="text" name="studio" defaultValue={project.studio ?? ""} />
            </label>
            <label>
              rôle
              <input type="text" name="role" defaultValue={project.role ?? ""} />
            </label>
            <label>
              surface (m²)
              <input
                type="number"
                step="any"
                name="area_m2"
                defaultValue={project.area_m2 ?? ""}
              />
            </label>
            <label>
              budget
              <input
                type="text"
                name="budget_label"
                defaultValue={project.budget_label ?? ""}
                placeholder="11 M€ HT"
              />
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>équipe &amp; mentions</h2>
          <div className="form-grid">
            <label className="wide">
              équipe — séparée par des virgules
              <input type="text" name="team" defaultValue={project.team.join(", ")} />
            </label>
            <label className="wide">
              certifications — séparées par des virgules
              <input
                type="text"
                name="certifications"
                defaultValue={project.certifications.join(", ")}
              />
            </label>
            <label>
              distinction
              <input
                type="text"
                name="awards"
                defaultValue={project.awards ?? ""}
                placeholder="concours lauréat"
              />
            </label>
            <label>
              crédits images
              <input
                type="text"
                name="image_credits"
                defaultValue={project.image_credits ?? ""}
              />
            </label>
          </div>
        </section>

        <div className="form-footer">
          <button type="submit" className="btn">
            enregistrer
          </button>
          <label className="check">
            <input
              type="checkbox"
              name="published"
              defaultChecked={project.published}
            />
            publié
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={project.featured}
            />
            à la une
          </label>
        </div>
      </form>

      <section className="atelier-images">
        <h2>images</h2>
        <div className="admin-image-grid">
          {project.seshna_project_images.map((img, idx) => (
            <div key={img.id} className="admin-image">
              <img
                src={imageUrl(img.storage_path, img.source)}
                alt={img.alt ?? ""}
              />
              <div className="image-meta">
                {img.is_cover ? (
                  <span className="tag">couverture</span>
                ) : (
                  <span />
                )}
                <span className="dim">
                  {img.width}×{img.height}
                </span>
              </div>
              <div className="image-actions">
                <form action={moveImage.bind(null, img.id, project.slug, -1)}>
                  <button
                    type="submit"
                    className="action"
                    disabled={idx === 0}
                    title="avancer"
                  >
                    ←
                  </button>
                </form>
                <form action={moveImage.bind(null, img.id, project.slug, 1)}>
                  <button
                    type="submit"
                    className="action"
                    disabled={idx === project.seshna_project_images.length - 1}
                    title="reculer"
                  >
                    →
                  </button>
                </form>
                <form action={rotateImage.bind(null, img.id, project.slug)}>
                  <button
                    type="submit"
                    className="action"
                    title="pivoter de 90° anti-horaire"
                  >
                    pivoter
                  </button>
                </form>
                {!img.is_cover && (
                  <form action={setCover.bind(null, img.id, project.slug)}>
                    <button type="submit" className="action">
                      couverture
                    </button>
                  </form>
                )}
                <form action={deleteImage.bind(null, img.id, project.slug)}>
                  <ConfirmButton
                    message="supprimer cette image ?"
                    className="action danger"
                  >
                    supprimer
                  </ConfirmButton>
                </form>
              </div>
              <form
                action={saveImageAlt.bind(null, img.id, project.slug)}
                className="alt-form"
              >
                <input
                  type="text"
                  name="alt"
                  placeholder="texte alternatif"
                  defaultValue={img.alt ?? ""}
                />
                <button type="submit" className="action">
                  ok
                </button>
              </form>
            </div>
          ))}
        </div>
        <form action={upload} className="upload-form">
          <label>
            ajouter des images
            <input type="file" name="files" accept="image/*" multiple required />
          </label>
          <button type="submit" className="btn">
            téléverser
          </button>
        </form>
      </section>
    </main>
  );
}
