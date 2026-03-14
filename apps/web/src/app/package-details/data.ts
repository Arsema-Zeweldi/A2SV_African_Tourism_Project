export interface PackageDetails {
    name: string;
    owner: {
        name: string;
        avatar: string;
    };
    cost: string;
    isPublic: boolean;
    review: Reviews[];
    description: string;
    image: string;
    viralMoment?: {
        thumbnail?: string;
        description?: string;
    },
    location: string;
    itinerary: Itinerary[];
    costBreakdown: CostBreakdowns[];
    communityChat: CommunityChats[];
}

export interface Reviews {
    author: string;
    avatar: string;
    text: string;
    date: string;
}

export interface CommunityChats {
    name: string;
    text: string;
    timeStamp: string;
}

export interface Itinerary {
    day: number;
    name: string;
    description: string;
    cost?: string;
    requirement?: string;
}
export interface CostBreakdowns {
    category: string;
    item: string;
    notes?: string;
    cost: number;
}

export const packageDetails: PackageDetails = {
    name: "The Ultimate Lagos to Accra Roadtrip",
    owner: {
        name: "@TravelNaija",
        avatar: "/images/profile.png"
    },
    cost: "$500 - $700",
    isPublic: true,
    review: [
        {
            author: "Tunde B.",
            avatar: "/images/review-image-1.png",
            text: "The itenerary was spot on! The bus prices had increased slightly but the route map was a lifesaver.",
            date: "2 days ago"
        },
        {
            author: "Amara G.",
            avatar: "/images/review-image-2.png",
            text: "I loved the beach day in Lomé. The local food was amazing!",
            date: "1 week ago"
        }
    ],
    description: "Experience the chaotic charm and coastal beauty of West Africa on this 5-day adventure. From the bustling markets of Lagos to the golden beaches of Lomé, and finally arriving in the vibrant city of Accra. This itinerary is designed for the adventurous soul ready to embrace local transport, street food, and border crossings.",
    image: "/images/package-details-pic-1.png",
    viralMoment: {
        thumbnail: "/images/package-details-pic-2.png",
        description: "Watch: iShowSpeed tries fufu in Accra for the first time"
    },
    location: "Lagos, Nigeria → Lomé, Togo → Accra, Ghana",
    itinerary: [
        {
            day: 1,
            name: "Departure from Lagos",
            description: "Early morning start from CMS Park. Boarding the Chisco Transport bus. Prepare for traffic getting out of Lagos.",
            cost: "N15,000 (~$12)",
            requirement: "Bus ticket"
        },
        {
            day: 2,
            name: "Seme Border & Benin Crossing",
            description: "Crossing into Benin Republic. Make sure your Yellow Card is ready. Stop for lunch in Cotonou.",
            requirement: "Yellow Card, Passport"
        },
        {
            day: 3,
            name: "Arrival in Accra & Nightlife",
            description: "Check into hotel in Osu. Evening exploring Oxford Street. Dinner at Buka Restaurant.",
        },
        {
            day: 4,
            name: "Labadi Beach Day",
            description: "Relaxing by the ocean. Horse riding available. Entrance fee required.",
            cost: "GHS 20 (~$3.50)",
            requirement: "Entrance fee"
        }
    ],
    costBreakdown: [
        {
            category: "Transport",
            item: "Bus (Lagos to Accra)",
            notes: "One-way ticket",
            cost: 45.00
        },
        {
            category: "Accommodation",
            item: "3 Nights in Osu",
            notes: "Airbnb shared apartment",
            cost: 180.00
        },
        {
            category: "Food & Drink",
            item: "Daily Meals",
            notes: "Mix of street food & restaurants",
            cost: 120.00
        }
    ],
    communityChat: [
        {
            name: "Kofi.Travels",
            text: "Is the Seme border crossing busy on Sundays?",
            timeStamp: "10:30 AM"
        },
        {
            name: "You",
            text: "Usually less busy than Mondays. Try to arrive before 8am though.",
            timeStamp: "10:32 AM"
        },
        {
            name: "Amara_G",
            text: "Thanks for the tip! Also, do they accept Naira at the border or should I change to CFA beforehand?",
            timeStamp: "10:45 AM"
        }
    ]
}