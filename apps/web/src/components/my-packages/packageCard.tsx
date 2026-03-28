import React from "react";
import Link from "next/link";
import { Clock3, Heart } from "lucide-react";
import type { PackageCard as MyPackageCard } from "@/types/my-packages";

const statusClasses = {
  success: "bg-[#2CC75A] text-white",
  neutral: "bg-white/90 text-[#505050]",
  warning: "bg-[#F7932D] text-white",
};

const actionClasses = {
  primary:
    "border bg-[#F48C25] text-white hover:bg-orange-600 hover:border-orange-600 shadow-[0_8px_20px_rgba(236,109,19,0.16)]",
  secondary:
    "border border-[#E7E0DA] bg-[#F3F1EE] text-[#5F5A56] hover:bg-[#ebe7e2]",
  outline:
    "border border-[#E7E0DA] bg-white text-[#5F5A56] hover:bg-[#faf8f6]",
};

interface PackageCardProps {
  item: MyPackageCard;
}

const PackageCard = ({ item }: PackageCardProps) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E8E1DB] bg-white shadow-[0_10px_30px_rgba(27,20,17,0.06)]">
      <div className="relative h-[224px] overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
          <span
            className={`rounded-full px-4 py-1.5 text-[11px] uppercase tracking-[0.06em] ${statusClasses[item.status.tone]}`}
          >
            {item.status.label}
          </span>

          {item.favorite ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-sm">
              <Heart size={16} fill="currentColor" />
            </div>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <h2 className="text-[21px] font-bold leading-tight">{item.title}</h2>
          <p className="mt-1 text-[14px] text-white/80">{item.location}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 pb-5">
          {item.priceValue ? (
            <>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#BCB2AC]">
                  {item.priceLabel}
                </p>
                <p className="mt-1 text-[18px] font-bold text-[#272221]">
                  {item.priceValue}
                  {item.priceSuffix ? (
                    <span className="ml-1 text-[14px] font-medium text-[#8E8680]">
                      {item.priceSuffix}
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] font-bold uppercase text-[#BCB2AC]">
                  {item.metaLabel}
                </p>
                <p className="mt-1 text-[18px] font-bold text-[#272221]">
                  {item.metaValue}
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="text-[11px] font-bold uppercase text-[#BCB2AC]">
                  {item.nextLabel}
                </p>
                <p className="mt-1 text-[16px] font-bold text-[#F48C25]">
                  {item.nextValue}
                </p>
              </div>
              <div className="text-right">
                {item.metaLabel ? (
                  <>
                    <p className="text-[11px] font-bold uppercase text-[#BCB2AC]">
                      {item.metaLabel}
                    </p>
                    <p className="mt-1 text-[16px] font-bold text-[#3D3836]">
                      {item.metaValue}
                    </p>
                  </>
                ) : (
                  <div className="flex h-full items-end justify-end text-[#B7ADA7]">
                    <Clock3 size={18} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className={`grid gap-3 ${item.actions.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {item.actions.map((action) => (
            <Link
              key={action.label}
              href={action.href ?? "#"}
              className={`h-11 rounded-xl px-2 text-[14px] font-semibold transition-colors ${actionClasses[action.variant]}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
};

export default PackageCard;
