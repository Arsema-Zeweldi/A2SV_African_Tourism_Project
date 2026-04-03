'use client';

import { ReactNode, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import MyPackagesSidebar from "@/components/my-packages/sidebar";
import MyPackagesToolbar, {
  type MyPackagesSortOption,
} from "@/components/my-packages/toolbar";
import PackageCard from "@/components/my-packages/packageCard";
import Recommendations from "@/components/my-packages/recommendations";
import { updatePackageStatus } from "@/actions/package_actions";
import type {
  PackageAction,
  MyPackagesPageData,
  PackageCard as MyPackageCard,
} from "@/types/my-packages";

interface MyPackagesPageShellProps {
  details: MyPackagesPageData;
  children?: ReactNode;
}

const toggleButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-[#E6E0DA] bg-white px-4 py-3 text-[14px] font-medium text-[#433F3C] shadow-sm transition-colors hover:bg-[#F8F4F0] lg:hidden";

const MyPackagesPageShell = ({ details, children }: MyPackagesPageShellProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [packages, setPackages] = useState(details.packages);
  const [sortBy, setSortBy] = useState<MyPackagesSortOption>("newest");
  const [selectedPackage, setSelectedPackage] = useState<MyPackageCard | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<"public" | "private" | "archived">("private");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const statusOptions = useMemo(
    () => [
      { value: "private", label: "Private" },
      { value: "public", label: "Public" },
      { value: "archived", label: "Archived" },
    ] as const,
    []
  );

  const statusMap: Record<"public" | "private" | "archived", MyPackageCard["status"]> = {
    public: { label: "Public", tone: "success", value: "public" },
    private: { label: "Private", tone: "neutral", value: "private" },
    archived: { label: "Archived", tone: "warning", value: "archived" },
  };

  const sortedPackages = useMemo(() => {
    const items = [...packages];

    items.sort((a, b) => {
      if (sortBy === "cost") {
        return (b.priceAmount ?? 0) - (a.priceAmount ?? 0);
      }

      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;

      return sortBy === "oldest" ? aDate - bDate : bDate - aDate;
    });

    return items;
  }, [packages, sortBy]);

  const openStatusModal = (_action: PackageAction, item: MyPackageCard) => {
    const currentStatus = item.status.value ?? "private";
    setSelectedPackage(item);
    setSelectedStatus(currentStatus);
  };

  const closeStatusModal = () => {
    if (isUpdatingStatus) return;
    setSelectedPackage(null);
  };

  const handleStatusSave = async () => {
    if (!selectedPackage?.id) return;

    setIsUpdatingStatus(true);
    const result = await updatePackageStatus(selectedPackage.id, selectedStatus);
    setIsUpdatingStatus(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    setPackages((prev) =>
      prev.map((item) =>
        item.id === selectedPackage.id
          ? { ...item, status: statusMap[selectedStatus] }
          : item
      )
    );
    toast.success("Package status updated.");
    setSelectedPackage(null);
  };

  return (
    <main className="mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-[232px_minmax(0,1fr)]">
      {isSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[280px] overflow-y-auto bg-[#FCFAF8] transition-transform duration-200 lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-[0_20px_40px_rgba(27,20,17,0.12)]" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#E6E0DA] px-6 py-5 lg:hidden">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#9A908A]">
            Explore
          </p>
          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-full p-2 text-[#625A56] transition-colors hover:bg-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <MyPackagesSidebar
          dashboardItems={details.sidebar.dashboardItems}
          preferenceItems={details.sidebar.preferenceItems}
          tipCard={details.sidebar.tipCard}
        />
      </div>

      <section className="min-w-0 px-6 py-10 lg:px-10">
        <div className="mb-10 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <button
              type="button"
              className={toggleButtonClass}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={16} />
              Open sidebar
            </button>
            <h1 className="mt-4 text-3xl sm:text-[44px] font-bold tracking-[-0.03em] text-[#201D1C] lg:mt-0">
              {details.title}
            </h1>
            <p className="mt-2 text-[15px] text-[#7A716D]">
              {details.description}
            </p>
          </div>

          {!children && (
            <MyPackagesToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}
        </div>

        {children ? (
          children
        ) : sortedPackages.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 xl:grid-cols-3"
                : "flex flex-col gap-6"
            }
          >
            {sortedPackages.map((item) => (
              <PackageCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                onAction={openStatusModal}
              />
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

        {selectedPackage ? (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(27,20,17,0.18)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[24px] font-bold text-[#201D1C]">
                    Update Package Status
                  </h2>
                  <p className="mt-2 text-[14px] text-[#7A716D]">
                    Change the status for {selectedPackage.title}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="rounded-full p-2 text-[#625A56] transition-colors hover:bg-[#F8F4F0]"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-6 space-y-3">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors ${
                      selectedStatus === option.value
                        ? "border-[#F48C25] bg-[#FFF4E8]"
                        : "border-[#E6E0DA] bg-white hover:bg-[#FCFAF8]"
                    }`}
                  >
                    <div>
                      <p className="text-[14px] font-semibold text-[#201D1C]">
                        {option.label}
                      </p>
                      <p className="text-[12px] text-[#7A716D]">
                        Set this package to {option.label.toLowerCase()}.
                      </p>
                    </div>
                    <input
                      type="radio"
                      name="package-status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={() => setSelectedStatus(option.value)}
                      className="h-4 w-4 accent-[#F48C25]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeStatusModal}
                  disabled={isUpdatingStatus}
                  className="rounded-xl border border-[#E6E0DA] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#5F5A56] transition-colors hover:bg-[#FCFAF8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => void handleStatusSave()}
                  disabled={isUpdatingStatus}
                  className="rounded-xl bg-[#F48C25] px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingStatus ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default MyPackagesPageShell;
