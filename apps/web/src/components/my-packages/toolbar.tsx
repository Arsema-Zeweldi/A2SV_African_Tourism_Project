import React from "react";
import { Filter, Grid2x2 } from "lucide-react";

const baseButtonClass =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[14px] font-medium transition-colors";

const MyPackagesToolbar = () => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        className={`${baseButtonClass} border border-[#E6E0DA] bg-white text-[#433F3C] shadow-sm`}
      >
        <Grid2x2 size={15} />
        Grid View
      </button>
      <button className={`${baseButtonClass} border border-transparent bg-transparent text-[#9A908A]`}>
        List View
      </button>
      <button
        className={`${baseButtonClass} border border-[#E6E0DA] bg-white text-[#433F3C] shadow-sm`}
      >
        <Filter size={15} />
        Sort by: Newest
      </button>
    </div>
  );
};

export default MyPackagesToolbar;
