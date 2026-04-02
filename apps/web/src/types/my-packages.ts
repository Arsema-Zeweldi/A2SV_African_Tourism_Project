export interface SidebarItem {
  label: string
  icon: "package" | "bookmark" | "history" | "settings" | "support"
  active?: boolean
  href?: string
}

export interface TipCard {
  title: string
  description: string
}

export interface PackageAction {
  label: string
  variant: "primary" | "secondary" | "outline"
  href?: string
  kind?: "link" | "status-modal"
}

export interface PackageCard {
  id?: string
  title: string
  location: string
  image: string
  createdAt?: string
  priceAmount?: number
  status: {
    label: string
    tone: "success" | "neutral" | "warning"
    value?: "public" | "private" | "archived"
  }
  nextLabel?: string
  nextValue?: string
  metaLabel?: string
  metaValue?: string
  priceLabel?: string
  priceValue?: string
  priceSuffix?: string
  favorite?: boolean
  actions: PackageAction[]
}

export interface RecommendationCard {
  title: string
  image: string
  price: string
}

export interface MyPackagesPageData {
  title: string
  description: string
  sidebar: {
    dashboardItems: SidebarItem[]
    preferenceItems: SidebarItem[]
    tipCard: TipCard
  }
  packages: PackageCard[]
  recommendations: RecommendationCard[]
}

export const myPackagesPageData: MyPackagesPageData = {
  title: "My Packages",
  description: "Manage your upcoming African adventures and itineraries.",
  sidebar: {
    dashboardItems: [
      { label: "Current Packages", icon: "package", active: true },
      { label: "Saved for Later", icon: "bookmark" },
      { label: "Past Trips", icon: "history" },
    ],
    preferenceItems: [
      { label: "Account Settings", icon: "settings" },
      { label: "Support Center", icon: "support" },
    ],
    tipCard: {
      title: "Travel Tip",
      description: "Don't forget to check visa requirements for your upcoming trip to Kenya!",
    },
  },
  packages: [
    {
      title: "The Great Migration Safari",
      location: "Serengeti, Tanzania",
      image: "/images/elephant.png",
      status: {
        label: "Confirmed",
        tone: "success",
      },
      nextLabel: "Next Trip",
      nextValue: "Oct 12 - Oct 20",
      metaLabel: "Guests",
      metaValue: "2 Adults",
      actions: [
        { label: "View Itinerary", variant: "secondary" },
        { label: "Manage Trip", variant: "primary" },
      ],
    },
    {
      title: "Cape Town Coastal Escape",
      location: "Western Cape, South Africa",
      image: "/images/island.png",
      status: {
        label: "Wishlist",
        tone: "neutral",
      },
      priceLabel: "Starting From",
      priceValue: "$1,499",
      priceSuffix: "/pp",
      metaLabel: "Duration",
      metaValue: "6 Days",
      favorite: true,
      actions: [
        { label: "View Details", variant: "secondary" },
        { label: "Use Package", variant: "primary" },
      ],
    },
    {
      title: "Masai Mara Cultural Trail",
      location: "Narok County, Kenya",
      image: "/images/village.png",
      status: {
        label: "Pending Review",
        tone: "warning",
      },
      nextLabel: "Next Trip",
      nextValue: "Dec 05 - Dec 12",
      actions: [{ label: "View Itinerary", variant: "outline" }],
    },
  ],
  recommendations: [
    {
      title: "Zanzibar Shores",
      image: "/images/ocean.png",
      price: "Starting $899",
    },
    {
      title: "Namibia Desert Tour",
      image: "/images/desert.png",
      price: "Starting $1,250",
    },
    {
      title: "Victoria Falls Adventure",
      image: "/images/waterfall.png",
      price: "Starting $780",
    },
  ],
}
