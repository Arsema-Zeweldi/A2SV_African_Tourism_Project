import React from "react";
import Navbar from "@/components/navbar";
import MyPackagesSidebar from "@/components/my-packages/sidebar";
import MyPackagesToolbar from "@/components/my-packages/toolbar";
import PackageCard from "@/components/my-packages/packageCard";
import Recommendations from "@/components/my-packages/recommendations";
import { getMyPackagesPageData } from "@/lib/package-data";
import type { MyPackagesPageData } from "@/types/my-packages";

const MyPackagesPage = async () => {
  const details = await getMyPackagesPageData().catch(
    (): MyPackagesPageData => ({
    title: "My Packages",
    description: "Sign in to load the packages you have created.",
    sidebar: {
      dashboardItems: [
        { label: "Current Packages", icon: "package", active: true },
        { label: "Saved for Later", icon: "bookmark" },
        { label: "Past Trips", icon: "history" },
      ],
      preferenceItems: [
        { label: "Account Settings", icon: "settings" },
        { label: "Support Center", icon: "support" },
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

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-[232px_1fr]">
        <MyPackagesSidebar
          dashboardItems={details.sidebar.dashboardItems}
          preferenceItems={details.sidebar.preferenceItems}
          tipCard={details.sidebar.tipCard}
        />

        <section className="px-6 py-10 lg:px-10">
          <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-[44px] font-bold tracking-[-0.03em] text-[#201D1C]">
                {details.title}
              </h1>
              <p className="mt-2 text-[15px] text-[#7A716D]">
                {details.description}
              </p>
            </div>

            <MyPackagesToolbar />
          </div>

          {details.packages.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-3">
              {details.packages.map((item) => (
                <PackageCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#DDD2CA] bg-white px-6 py-12 text-center text-[#7A716D]">
              No packages found yet.
            </div>
          )}

          {details.recommendations.length > 0 ? (
            <>
              <div className="mt-10 border-t border-dashed border-[#DDD2CA]" />
              <Recommendations items={details.recommendations} />
            </>
          ) : null}
        </section>
      </main>

      <footer className="border-t border-[#E6E0DA] bg-[#FCFAF8] py-10 text-center text-[14px] text-[#9A7360]">
        © 2026 Amọnà. All rights reserved.
      </footer>
    </div>
  );
};

export default MyPackagesPage;
