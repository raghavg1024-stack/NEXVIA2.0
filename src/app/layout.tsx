import type { Metadata } from "next";
import { Geist, Geist_Mono, Russo_One } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./_components/logout-button";
import { NexviaLogoMark } from "./_components/nexvia-logo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const russoOne = Russo_One({
  variable: "--font-russo-one",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Nexvia",
  description: "Discover Yourself. Learn Smarter. Build Your Future.",
  icons: {
    icon: "/favicon.svg",
  },
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmap", label: "My Roadmap" },
  { href: "/mentor", label: "AI Mentor" },
  { href: "/community", label: "Community" },
  { href: "/certificates", label: "Certificates" },
  { href: "/readiness", label: "Career Readiness" },
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
      className={`${geistSans.variable} ${geistMono.variable} ${russoOne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {user && (
          <header className="sticky top-0 z-40 border-b border-line bg-background/85 backdrop-blur">
            <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
              <NexviaLogoMark href="/dashboard" />
              <div className="hidden items-center gap-1 lg:flex">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-accent-soft hover:text-accent"
                  >
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 group-hover:text-accent">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
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