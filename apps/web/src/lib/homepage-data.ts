import { PackageCardData, CommunityPostData } from "@/types/homepage";

export const topRatedPackages: PackageCardData[] = [
    {
        id: "serengeti-safari",
        title: "Serengeti Safari",
        location: "Tanzania",
        image: "/homepage/top_rated3.png",
        rating: 4.8,
        reviewCount: 245,
        price: 2400,
        currency: "$",
        duration: "7 Days",
        category: "Safari",
        groupSize: "Family",
    },
    {
        id: "cape-town-coastal",
        title: "Cape Town Coastal",
        location: "South Africa",
        image: "/homepage/top_rated2.png",
        rating: 4.7,
        reviewCount: 189,
        price: 1899,
        currency: "$",
        duration: "5 Days",
        category: "Coastal",
        groupSize: "Couples",
    },
    {
        id: "victoria-falls-expedition",
        title: "Victoria Falls Expedition",
        location: "Zimbabwe",
        image: "/homepage/top_rated1.png",
        rating: 4.9,
        reviewCount: 312,
        price: 1350,
        currency: "$",
        duration: "4 Days",
        category: "Adventure",
        groupSize: "Group",
    },
];

export const communityPosts: CommunityPostData[] = [
    {
        id: "post-1",
        author: {
            name: "Guetiwidrow",
            avatar: "/homepage/community3.png",
        },
        image: "/homepage/community3.png",
        description:
            "Unreal experience in spotting this beauty on safari. Got up close to a Leopard&Pella. Tips: Stay quiet and patient.",
        likes: 456,
        comments: 174,
        shares: 45,
    },
    {
        id: "post-2",
        author: {
            name: "Merous Dires",
            avatar: "/homepage/community2.png",
        },
        image: "/homepage/community2.png",
        description:
            "Learning about Masai Mara traditions was the highlight of all our adventures. Their hospitality was amazing.",
        likes: 512,
        comments: 143,
        shares: 67,
    },
    {
        id: "post-3",
        author: {
            name: "Dinarchstignon",
            avatar: "/homepage/community1.png",
        },
        image: "/homepage/community1.png",
        description:
            "Who's done glamping? I could live the beauty of sleeping in the middle of nature. Book now!",
        likes: 389,
        comments: 98,
        shares: 34,
    },
];

export const navLinks = [
    { label: "Home", href: "/", active: true },
    { label: "Marketplace", href: "/marketplace", active: false },
    { label: "My Packages", href: "/my-packages", active: false },
    { label: "My Trips", href: "/my-trips", active: false },
    { label: "Feed", href: "/feed", active: false },
];
