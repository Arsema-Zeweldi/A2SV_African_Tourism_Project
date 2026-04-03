import Navbar from "@/components/navbar";
import MyPackagesPageShell from "@/components/my-packages/page-shell";
import SupportCenterContent from "./support-center-content";
import type { MyPackagesPageData } from "@/types/my-packages";

const supportCenterData: MyPackagesPageData = {
  title: "Support Center",
  description: "Need help with your packages or account? Send us a note and we will follow up by email.",
  sidebar: {
    dashboardItems: [
      { label: "Current Packages", icon: "package", href: "/my-packages" },
      { label: "Saved for Later", icon: "bookmark", href: "/my-packages/saved-for-later" },
      { label: "Past Trips", icon: "history", href: "/my-packages/past-trips" },
    ],
    preferenceItems: [
      { label: "Account Settings", icon: "settings", href: "/profile" },
      { label: "Support Center", icon: "support", active: true, href: "/my-packages/support-center" },
    ],
    tipCard: {
      title: "Support Tip",
      description: "Include screenshots, the action you took, and the device you were using so we can help faster.",
    },
  },
  packages: [],
  recommendations: [],
};

const SupportCenterPage = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <MyPackagesPageShell details={supportCenterData}>
        <SupportCenterContent />
      </MyPackagesPageShell>
      <footer className="border-t border-[#E6E0DA] bg-[#faf8f5] py-10 text-center text-sm text-[#9A7360]">
        &copy; {new Date().getFullYear()} Amona. All rights reserved.
      </footer>
    </div>
  );
};

export default SupportCenterPage;
