import React from "react";
import { Filter, Grid2x2, List } from "lucide-react";

const baseButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-medium transition-colors";

export type MyPackagesSortOption = "newest" | "oldest" | "cost";

interface MyPackagesToolbarProps {
  viewMode: "grid" | "list";
  onViewModeChange: (viewMode: "grid" | "list") => void;
  sortBy: MyPackagesSortOption;
  onSortChange: (sortBy: MyPackagesSortOption) => void;
}

const MyPackagesToolbar = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: MyPackagesToolbarProps) => {
  const sortLabel =
    sortBy === "oldest" ? "Oldest" : sortBy === "cost" ? "Cost" : "Newest";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => onViewModeChange("grid")}
        className={`${baseButtonClass} ${
          viewMode === "grid"
            ? "border border-[#E6E0DA] bg-white text-[#433F3C] shadow-sm"
            : "border border-transparent bg-transparent text-[#9A908A]"
        }`}
      >
        <Grid2x2 size={15} />
        Grid View
      </button>
      <button
        type="button"
        onClick={() => onViewModeChange("list")}
        className={`${baseButtonClass} ${
          viewMode === "list"
            ? "border border-[#E6E0DA] bg-white text-[#433F3C] shadow-sm"
            : "border border-transparent bg-transparent text-[#9A908A]"
        }`}
      >
        <List size={15} />
        List View
      </button>
      <label
        className={`${baseButtonClass} border border-[#E6E0DA] bg-white text-[#433F3C] shadow-sm`}
      >
        <Filter size={15} />
        <span>Sort by:</span>
        <select
          value={sortBy}
          onChange={(event) =>
            onSortChange(event.target.value as MyPackagesSortOption)
          }
          className="bg-transparent text-[14px] font-medium text-[#433F3C] outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="cost">Cost</option>
        </select>
        <span className="sr-only">Current sort: {sortLabel}</span>
      </label>
    </div>
  );
};

export default MyPackagesToolbar;
