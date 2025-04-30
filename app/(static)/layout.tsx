import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus Dabba",
  description: "Home-cooked meals from local households",
};

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-12">
        {children}
      </main>
    </div>
  );
} 