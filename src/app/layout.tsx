import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./_components/logout-button";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Career OS",
  description: "Discover Yourself. Learn Smarter. Build Your Future.",
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "My Roadmap" },
  { href: "/rewards", label: "Rewards" },
  { href: "/profile", label: "Profile" },
];

async function getSessionUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        {user && (
          <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-lg font-semibold tracking-tight text-white"
              >
                <span
                  className="inline-block h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600"
                  aria-hidden="true"
                />
                Career OS
              </Link>
              <div className="hidden items-center gap-1 sm:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <LogoutButton />
            </nav>
          </header>
        )}
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}