"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
      <AnimatePresence>
        {open && (
          <motion.nav
            className="menu-overlay"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            {LINKS.map((l, i) => (
              <motion.div
                key={l.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.05 + i * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
