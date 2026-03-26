import React from "react";
import {
  Bookmark,
  History,
  Package2,
  Settings,
  UserRoundCog,
} from "lucide-react";
import type { SidebarItem, TipCard } from "@/types/my-packages";

const sidebarIcons = {
  package: Package2,
  bookmark: Bookmark,
  history: History,
  settings: Settings,
  support: UserRoundCog,
};

interface MyPackagesSidebarProps {
  dashboardItems: SidebarItem[];
  preferenceItems: SidebarItem[];
  tipCard: TipCard;
}

const MyPackagesSidebar = ({
  dashboardItems,
  preferenceItems,
  tipCard,
}: MyPackagesSidebarProps) => {
  return (
    <aside className="border-r border-[#E6E0DA] px-6 py-8">
      <div className="space-y-10">
        <section>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B3A8A0]">
            Dashboard
          </p>
          <div className="space-y-1">
            {dashboardItems.map((item) => {
              const Icon = sidebarIcons[item.icon];

              return (
                <button
                  key={item.label}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-5 text-left text-[14px] font-medium transition-colors ${
                    item.active
                      ? "bg-[#F48C25] text-white shadow-[0_14px_30px_rgba(236,109,19,0.22)]"
                      : "text-[#625A56] hover:bg-white"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#B3A8A0]">
            Preference
          </p>
          <div className="space-y-2">
            {preferenceItems.map((item) => {
              const Icon = sidebarIcons[item.icon];

              return (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-[15px] font-medium text-[#625A56] transition-colors hover:bg-white"
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="rounded-2xl border border-[#EDC7A5] bg-[#F7EDE4] px-4 py-5 text-[#7A6456]">
          <p className="mb-3 text-[15px] font-semibold text-primary">
            {tipCard.title}
          </p>
          <p className="text-[14px] leading-7">{tipCard.description}</p>
        </div>
      </div>
    </aside>
  );
};

export default MyPackagesSidebar;
