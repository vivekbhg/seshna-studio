import { getExperiences, getProfile } from "@/lib/data";
import { imageUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export const metadata = { title: "à propos — seshna gungah" };

export default async function AboutPage() {
  const [profile, experiences] = await Promise.all([
    getProfile(),
    getExperiences(),
  ]);

  return (
    <main className="about">
      <aside className="about-side">
        {profile?.portrait_path && (
          <img src={imageUrl(profile.portrait_path)} alt={profile.full_name} />
        )}
        <div className="contact">
          {profile?.email && (
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          )}
          {profile?.phone && <span>{profile.phone}</span>}
          {profile?.instagram && (
            <a
              href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
              target="_blank"
              rel="noreferrer"
            >
              {profile.instagram}
            </a>
          )}
        </div>
      </aside>
      <div className="about-main">
        {profile?.bio && <p className="bio">{profile.bio}</p>}
        <h2>parcours</h2>
        {experiences.map((xp) => (
          <div key={xp.id} className="experience">
            <span className="period">{xp.period_label}</span>
            <div>
              <h3>
                {xp.role} <span className="org">— {xp.organization}</span>
                {xp.city && <span className="org">, {xp.city}</span>}
              </h3>
              {xp.details.length > 0 && (
                <ul>
                  {xp.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
        {profile && profile.software.length > 0 && (
          <p className="software">logiciels — {profile.software.join(", ")}</p>
        )}
      </div>
    </main>
  );
}
