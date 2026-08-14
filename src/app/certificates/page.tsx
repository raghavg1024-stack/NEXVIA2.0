import Link from "next/link";
import { redirect } from "next/navigation";
import { getCertificates } from "@/lib/certificates";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function CertificatesPage() {
  let authed = false;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    authed = !!user;
  } catch {}
  if (!authed) redirect("/login");

  const certificates = await getCertificates();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-100">Certificates</h1>
        <p className="mt-2 text-sm text-slate-400">
          Credentials you earn by completing your learning roadmap.
        </p>
      </header>

      {certificates.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 px-6 py-16 text-center">
          <div
            aria-hidden
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-indigo-500/50 bg-indigo-500/10"
          >
            <span className="text-lg font-bold tracking-widest text-indigo-300">
              COS
            </span>
          </div>
          <h2 className="mt-6 text-lg font-semibold text-white">
            No certificates yet
          </h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Complete your roadmap and you will earn a Career OS certificate with
            a verifiable credential ID you can show off.
          </p>
          <Link
            href="/roadmap"
            className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Go to my roadmap
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-6 pt-8"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute right-5 top-5 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-4 border-double border-indigo-400/60 bg-gradient-to-br from-indigo-600/40 to-violet-600/40 text-center text-[10px] font-bold uppercase leading-tight tracking-widest text-indigo-200"
              >
                COS
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                Certificate of Completion
              </p>
              <h2 className="mt-3 pr-16 text-xl font-bold text-white">
                {certificate.title}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Credential ID:{" "}
                <span className="font-mono text-slate-300">
                  {certificate.credential_id}
                </span>
              </p>
              <p className="mt-3 text-sm text-slate-500">
                Issued {new Date(certificate.issued_at).toLocaleDateString()}
              </p>
              <div className="mt-auto border-t border-slate-800 pt-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">
                  Career OS
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}