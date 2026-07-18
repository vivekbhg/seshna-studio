"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/", label: "index" },
  { href: "/#architecture", label: "architecture" },
  { href: "/#urbanisme", label: "urbanisme" },
  { href: "/#scenographie", label: "scénographie" },
  { href: "/#bijoux", label: "bijoux" },
  { href: "/about", label: "about" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header-row">
        <Link href="/" className="site-title" onClick={() => setOpen(false)}>
          seshna gungah
        </Link>
        <nav className="site-nav">
          {LINKS.slice(1).map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "fermer le menu" : "ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "×" : "+"}
        </button>
      </div>
      {open && (
        <nav className="menu-overlay">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
