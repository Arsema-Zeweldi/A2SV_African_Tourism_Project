import React from "react";
import { CirclePlus, Sparkles } from "lucide-react";
import type { RecommendationCard } from "@/types/my-packages";

interface RecommendationsProps {
  items: RecommendationCard[];
}

const Recommendations = ({ items }: RecommendationsProps) => {
  return (
    <section className="pt-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="inline-flex items-center gap-2 text-[20px] font-bold text-[#282422]">
          <Sparkles size={18} className="text-primary" />
          Recommended for You
        </h2>
        <button className="inline-flex h-10 items-center justify-center rounded-xl px-3 text-[14px] font-semibold text-primary transition-colors hover:bg-orange-50">
          See all recommendations
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article key={item.title}>
            <div className="relative h-[124px] overflow-hidden rounded-2xl">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <p className="absolute bottom-3 left-3 text-white">{item.title}</p>
            </div>
            <p className="mt-3 text-[13px] font-normal uppercase tracking-[0.06em] text-primary">
              {item.price}
            </p>
          </article>
        ))}

        <button className="flex h-[125px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDD2CA] bg-[#FBF8F5] text-[#B7ADA7] transition-colors hover:bg-white">
          <CirclePlus size={26} />
          <span className="mt-4 text-[13px] font-bold uppercase tracking-[0.08em]">
            Explore More
          </span>
        </button>
      </div>
    </section>
  );
};

export default Recommendations;
