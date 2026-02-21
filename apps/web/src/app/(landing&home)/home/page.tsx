import HeroSection from "@/components/homepage/HeroSection";
import TopRatedPackages from "@/components/homepage/TopRatedPackages";
import CommunityFeed from "@/components/homepage/CommunityFeed";
import { Button } from "@/components/ui/button";

export default function HomePage() {
    return (
        <>

            <main>
                <HeroSection />

                {/* Top-Rated Packages */}
                <TopRatedPackages />

                {/* Divider */}
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <hr className="border-gray-100" />
                </div>

                {/* Community Feed */}
                <CommunityFeed />

                {/* Load More */}
                <div className="flex justify-center pb-20">
                    <Button
                        variant="default"
                        className="rounded-full bg-gray-900 px-8 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Load More Stories
                    </Button>
                </div>
            </main>
        </>
    );
}
