// profile/layout.tsx
// Assembles: Navbar + Sidebar + page content + Footer

import Footer from "@/components/footer";
import Sidebar from "@/components/profile/Sidebar";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-stone-100">

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}