import type { Metadata } from "next";
import "./globals.css";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description:
    "Professional AI profile for Balasubramanya Sai Kumar. Ask about Application Security experience, skills, projects, and career fit.",
  keywords: [
    "Application Security",
    "Sai Kumar",
    "AppSec",
    "DevSecOps",
    "Threat Modeling",
    brand.name,
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
