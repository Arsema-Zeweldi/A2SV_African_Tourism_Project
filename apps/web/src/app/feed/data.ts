export interface Post {
  id: string
  userName: string
  userAvatar: string
  content: string
  liked: boolean
  photo?: string
  video?: string
  commentsCount: number
  comments: [
    {
      author: string
      authorAvatar: string
      text: string
    },
  ]
  likesCount: number
  timeAgo: string
  location: string
  packageName: string
}

export interface Trending {
  id: string
  image: string
  packageName: string
  activeTravelers: number
}

const posts: Post[] = [
  {
    id: '1',
    userName: 'John Doe',
    userAvatar: './images/user-icon.png',
    content:
      "Safari Adventure in Masai Mara. Don't forget binoculars for the morning drive in Masai Mara. The lions were active at dawn and wesome incredible close-up views! The crisp morning air is totally worth the early wake-up call. 🦁🌅",
    liked: true,
    photo: '/images/temp/Image2.png',
    commentsCount: 32,
    comments: [
      {
        author: 'Jane Doe',
        authorAvatar: '/images/user-icon.png',
        text: 'Devine',
      },
    ],
    likesCount: 256,
    timeAgo: '2 hours ago',
    location: 'Osu Castle',
    packageName: '7 days in Zanzibar Package',
  },
  {
    id: '2',
    userName: 'John Doe',
    userAvatar: './images/user-icon.png',
    content:
      'Best Burger in Town! 🍛 Found this hidden gem near Osu Castle. The spicy beef with fries is unmatched. Definitely ask for the extra ketchup on the side! 🌶️',
    liked: true,
    video: '/images/temp/test.mp4',
    commentsCount: 32,
    comments: [
      {
        author: 'Jane Doe',
        authorAvatar: '/images/user-icon.png',
        text: 'I agree',
      },
    ],
    likesCount: 256,
    timeAgo: '2 hours ago',
    location: 'Osu Castle',
    packageName: 'Taste of Ghana Tour',
  },
]

export const trendingPackages: Trending[] = [
  {
    id: '1',
    image: '/images/temp/capeTown.png',
    packageName: 'Cape Town',
    activeTravelers: 1200,
  },
  {
    id: '2',
    image: '/images/temp/capeTown.png',
    packageName: 'Giza Pyramids',
    activeTravelers: 890,
  },
  {
    id: '3',
    image: '/images/temp/capeTown.png',
    packageName: 'Victoria Falls',
    activeTravelers: 650,
  },
]

export async function getPostById(id: string): Promise<Post | undefined> {
  return posts.find((post) => post.id === id)
}

export async function getAllPosts(): Promise<Post[]> {
  return posts
}
