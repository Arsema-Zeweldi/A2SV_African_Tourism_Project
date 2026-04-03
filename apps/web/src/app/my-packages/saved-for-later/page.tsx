import Navbar from "@/components/navbar";
import MyPackagesPageShell from "@/components/my-packages/page-shell";
import type { MyPackagesPageData } from "@/types/my-packages";

const savedForLaterData: MyPackagesPageData = {
  title: "Saved for Later",
  description: "Keep tabs on the packages you want to revisit before booking.",
  sidebar: {
    dashboardItems: [
      { label: "Current Packages", icon: "package", href: "/my-packages" },
      { label: "Saved for Later", icon: "bookmark", active: true, href: "/my-packages/saved-for-later" },
      { label: "Past Trips", icon: "history", href: "/my-packages/past-trips" },
    ],
    preferenceItems: [
      { label: "Account Settings", icon: "settings", href: "/profile" },
      { label: "Support Center", icon: "support", href: "/my-packages/support-center" },
    ],
    tipCard: {
      title: "Planning Tip",
      description: "Save packages while comparing routes, then come back when your travel window and budget are set.",
    },
  },
  packages: [
    {
      id: "saved-zanzibar-shores",
      title: "Zanzibar Shores Escape",
      location: "Unguja, Tanzania",
      image: "/images/ocean.png",
      status: {
        label: "Saved",
        tone: "neutral",
      },
      priceLabel: "Starting From",
      priceValue: "$899",
      priceSuffix: "/pp",
      metaLabel: "Duration",
      metaValue: "4 Days",
      favorite: true,
      actions: [
        { label: "View Details", variant: "secondary", href: "/marketplace?q=Zanzibar%20Shores%20Escape" },
        { label: "Use Package", variant: "primary", href: "/plan-your-trip" },
      ],
    },
    {
      id: "saved-namibia-desert",
      title: "Namibia Desert Circuit",
      location: "Sossusvlei, Namibia",
      image: "/images/desert.png",
      status: {
        label: "Saved",
        tone: "neutral",
      },
      priceLabel: "Starting From",
      priceValue: "$1,250",
      priceSuffix: "/pp",
      metaLabel: "Duration",
      metaValue: "6 Days",
      actions: [
        { label: "View Details", variant: "secondary", href: "/marketplace?q=Namibia%20Desert%20Circuit" },
        { label: "Use Package", variant: "primary", href: "/plan-your-trip" },
      ],
    },
  ],
  recommendations: [],
};

const SavedForLaterPage = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans text-slate-900">
      <Navbar />
      <MyPackagesPageShell details={savedForLaterData} />
      <footer className="border-t border-[#E6E0DA] bg-[#faf8f5] py-10 text-center text-sm text-[#9A7360]">
        &copy; {new Date().getFullYear()} Amona. All rights reserved.
      </footer>
    </div>
  );
};

export default SavedForLaterPage;
