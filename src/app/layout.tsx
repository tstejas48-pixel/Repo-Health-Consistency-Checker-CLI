import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Repo Health Checker - Analyze Your Repository Quality",
  description: "Comprehensive repository health analysis tool. Check code quality, documentation, tests, CI/CD, dependencies, and best practices.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
