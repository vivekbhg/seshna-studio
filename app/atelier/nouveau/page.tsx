import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminPassphrase } from "@/lib/admin/auth";
import { adminGetDisciplines } from "@/lib/admin/api";
import { createProject } from "../actions";

export const dynamic = "force-dynamic";

export default async function NouveauProjet({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const pass = await getAdminPassphrase();
  if (!pass) redirect("/atelier");
  const { erreur } = await searchParams;
  const disciplines = await adminGetDisciplines();

  return (
    <main className="atelier">
      <Link href="/atelier" className="back">
        ← atelier
      </Link>
      <h1>nouveau projet</h1>
      {erreur && <p className="error">le titre est requis</p>}
      <form action={createProject} className="atelier-form narrow">
        <label>
          titre
          <input type="text" name="title" required autoFocus />
        </label>
        <label>
          discipline
          <select name="discipline_slug" required>
            {disciplines.map((d) => (
              <option key={d.id} value={d.slug}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          adresse (optionnel — générée depuis le titre sinon)
          <input type="text" name="slug" placeholder="mon-projet" />
        </label>
        <p className="hint">
          le projet est créé en brouillon — il n&apos;apparaît sur le site
          qu&apos;une fois publié depuis sa page d&apos;édition.
        </p>
        <button type="submit" className="btn">
          créer
        </button>
      </form>
    </main>
  );
}
