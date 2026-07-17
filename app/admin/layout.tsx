import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Portfolio CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0c0705] text-[#fff2df]">
      {children}
    </div>
  );
}
