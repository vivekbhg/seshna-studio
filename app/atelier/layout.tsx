import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "atelier — seshna gungah",
  robots: { index: false, follow: false },
};

export default function AtelierLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
