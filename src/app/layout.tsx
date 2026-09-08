import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ChatWithSai — Ask about Sai",
  description:
    "Professional AI profile for Balasubramanya Sai Kumar. Ask about Application Security experience, skills, projects, and career fit.",
  keywords: [
    "Application Security",
    "Sai Kumar",
    "AppSec",
    "DevSecOps",
    "Threat Modeling",
    "ChatWithSai",
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
