import Navbar from "@/components/navbar";
import MyPackagesPageShell from "@/components/my-packages/page-shell";
import { getMyPackagesPageData } from "@/lib/package-data";
import type { MyPackagesPageData } from "@/types/my-packages";

const MyPackagesPage = async () => {
  const details = await getMyPackagesPageData().catch(
    (): MyPackagesPageData => ({
    title: "My Packages",
    description: "Sign in to load the packages you have created.",
    sidebar: {
      dashboardItems: [
        { label: "Current Packages", icon: "package", active: true, href: "/my-packages" },
        { label: "Saved for Later", icon: "bookmark", href: "/my-packages/saved-for-later" },
        { label: "Past Trips", icon: "history", href: "/my-packages/past-trips" },
      ],
      preferenceItems: [
        { label: "Account Settings", icon: "settings", href: "/profile" },
        { label: "Support Center", icon: "support", href: "/my-packages/support-center" },
      ],
      tipCard: {
        title: "Travel Tip",
        description: "Create and publish packages from saved itineraries after signing in.",
      },
    },
    packages: [],
    recommendations: [],
    }),
  );

  return (
    <div className="min-h-screen bg-[#FCFAF8] font-sans text-slate-900">
      <Navbar />

      <MyPackagesPageShell details={details} />

      <footer className="border-t border-[#E6E0DA] bg-[#FCFAF8] py-10 text-center text-[14px] text-[#9A7360]">
        © 2026 Amọnà. All rights reserved.
      </footer>
    </div>
  );
};

export default MyPackagesPage;
