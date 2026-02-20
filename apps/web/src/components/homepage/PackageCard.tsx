import Image from "next/image";
import { PackageCardData } from "@/types/homepage";
import { Star, Clock, Users, MapPin, Trees } from "lucide-react";
import { cn } from "@/lib/utils";

interface PackageCardProps {
    package_: PackageCardData;
}

const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
        case "safari":
            return "bg-[#9CA389] text-white"; // Sage Green
        case "coastal":
            return "bg-[#5D8AA8] text-white"; // Air Force Blue
        case "adventure":
            return "bg-[#C17C5F] text-white"; // Terracotta
        default:
            return "bg-white/90 text-gray-800";
    }
};

export default function PackageCard({ package_ }: PackageCardProps) {
    return (
        <div className="group relative h-[420px] w-full flex-shrink-0 cursor-pointer overflow-hidden rounded-[2rem] bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* Background Image */}
            <div className="absolute inset-0 h-full w-full">
                <Image
                    src={package_.image}
                    alt={package_.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>

            {/* Dark Gradient Overlay (Bottom only) */}
            <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Rating Badge (Top Right) */}
            <div className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 shadow-sm transition-transform duration-300 group-hover:scale-110">
                <Star className="h-3.5 w-3.5 fill-[#ec6d13] text-[#ec6d13]" />
                <span className="text-sm font-bold text-gray-900">
                    {package_.rating}
                </span>
            </div>

            {/* Content Container */}
            <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end p-6">
                {/* Tags Row */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {/* Category Tag */}
                    <div
                        className={cn(
                            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                            getCategoryColor(package_.category)
                        )}
                    >
                        <Trees className="h-3 w-3" />
                        {package_.category}
                    </div>

                    {/* Duration Tag */}
                    <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 backdrop-blur-md">
                        <Clock className="h-3 w-3" />
                        {package_.duration}
                    </div>

                    {/* Group Size Tag */}
                    <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-800 backdrop-blur-md">
                        <Users className="h-3 w-3" />
                        {package_.groupSize}
                    </div>
                </div>

                {/* Title and Price Row */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="texl-xl font-bold leading-tight text-white sm:text-2xl">
                            {package_.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/80">
                            <MapPin className="h-3.5 w-3.5" />
                            <span className="text-sm font-medium">{package_.location}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="mb-[-2px] text-[10px] font-medium uppercase tracking-wide text-white/70">
                            FROM
                        </span>
                        <span className="text-2xl font-bold text-[#ec6d13]">
                            {package_.currency}
                            {package_.price.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
