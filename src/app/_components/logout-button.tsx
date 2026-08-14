"use client";

import { useFormStatus } from "react-dom";
import { logout } from "@/lib/rewards";

function LogoutSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white disabled:opacity-60"
    >
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutSubmit />
    </form>
  );
}