export interface PackageCardData {
    id: string;
    title: string;
    location: string;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    currency: string;
    duration: string;
    category: string;
    groupSize: string;
}

export interface CommunityPostData {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    image: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
}
