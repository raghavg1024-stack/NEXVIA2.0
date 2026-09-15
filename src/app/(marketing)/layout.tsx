import { PublicNav } from "@/app/_components/public-nav";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[#070a12] text-slate-200">
      <PublicNav />
      {children}
    </div>
  );
}
