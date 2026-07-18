import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "seshna gungah — architecte urbaniste",
  description:
    "Portfolio de Seshna Gungah — architecture, urbanisme, scénographie de concerts et festivals, création de bijoux.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <div className="container">
          <header className="site-header">
            <Link href="/" className="site-title">
              seshna gungah<span>architecte urbaniste</span>
            </Link>
            <nav className="site-nav">
              <Link href="/#architecture">architecture</Link>
              <Link href="/#scenographie">scénographie</Link>
              <Link href="/#bijoux">bijoux</Link>
              <Link href="/a-propos">à propos</Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <div>
              <a href="mailto:seshna.gungah.archi@gmail.com">
                seshna.gungah.archi@gmail.com
              </a>
              {" — 06 62 12 56 36"}
            </div>
            <div className="handles">
              <a
                href="https://instagram.com/seshna.gungah"
                target="_blank"
                rel="noreferrer"
              >
                @seshna.gungah
              </a>
              <a
                href="https://instagram.com/studio_saigu"
                target="_blank"
                rel="noreferrer"
              >
                @studio_saigu
              </a>
              <a
                href="https://instagram.com/la_dhal_"
                target="_blank"
                rel="noreferrer"
              >
                @la_dhal_
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
