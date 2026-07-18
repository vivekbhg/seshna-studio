import Link from "next/link";
import { getAdminPassphrase } from "@/lib/admin/auth";
import { adminGetProjects } from "@/lib/admin/api";
import { login, logout } from "./actions";

export const dynamic = "force-dynamic";

function LoginForm({ error }: { error: boolean }) {
  return (
    <main className="atelier">
      <div className="login">
        <h1>atelier</h1>
        <form action={login}>
          <input
            type="password"
            name="passphrase"
            placeholder="phrase de passe"
            autoFocus
            required
          />
          <button type="submit">entrer</button>
        </form>
        {error && <p className="error">phrase de passe incorrecte</p>}
      </div>
    </main>
  );
}

export default async function AtelierPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const pass = await getAdminPassphrase();
  if (!pass) return <LoginForm error={Boolean(erreur)} />;

  const projects = await adminGetProjects(pass);

  return (
    <main className="atelier">
      <div className="atelier-head">
        <h1>atelier</h1>
        <div className="atelier-actions">
          <Link href="/atelier/nouveau" className="btn">
            + nouveau projet
          </Link>
          <form action={logout}>
            <button type="submit" className="btn muted">
              sortir
            </button>
          </form>
        </div>
      </div>
      <table className="atelier-table">
        <thead>
          <tr>
            <th>projet</th>
            <th>discipline</th>
            <th>images</th>
            <th>état</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className={p.published ? "" : "unpublished"}>
              <td>
                <Link href={`/atelier/projets/${p.slug}`}>{p.title}</Link>
              </td>
              <td>{p.seshna_disciplines.label}</td>
              <td>{p.seshna_project_images.length}</td>
              <td>
                {p.published ? "publié" : "brouillon"}
                {p.featured ? " · à la une" : ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
