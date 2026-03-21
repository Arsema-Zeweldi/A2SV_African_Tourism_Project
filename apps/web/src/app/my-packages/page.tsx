import React from "react";
import Navbar from "@/components/navbar";
import MyPackagesSidebar from "@/components/my-packages/sidebar";
import MyPackagesToolbar from "@/components/my-packages/toolbar";
import PackageCard from "@/components/my-packages/packageCard";
import Recommendations from "@/components/my-packages/recommendations";
import { myPackagesPageData } from "./data";

const MyPackagesPage = () => {
  const details = myPackagesPageData;

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

          <div className="grid gap-6 xl:grid-cols-3">
            {details.packages.map((item) => (
              <PackageCard key={item.title} item={item} />
            ))}
          </div>

          <div className="mt-10 border-t border-dashed border-[#DDD2CA]" />
          <Recommendations items={details.recommendations} />
        </section>
      </main>

      <footer className="border-t border-[#E6E0DA] bg-[#FCFAF8] py-10 text-center text-[14px] text-[#9A7360]">
        © 2026 Amọnà. All rights reserved.
      </footer>
    </div>
  );
};

export default MyPackagesPage;
