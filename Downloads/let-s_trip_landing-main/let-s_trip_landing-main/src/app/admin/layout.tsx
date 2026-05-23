import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LetsTrip Admin | Package Management",
  description: "Admin panel for managing LetsTrip travel packages and destinations.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050B1F]">
      {children}
    </div>
  );
}
