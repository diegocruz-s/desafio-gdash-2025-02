import { Navbar } from "@/components/navbar/navbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* Espaçamento automático para não cobrir o conteúdo */}
      <div className="pt-24 px-6 max-w-7xl mx-auto">{children}</div>
    </>
  );
}
