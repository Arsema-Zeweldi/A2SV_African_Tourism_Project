'use client'

import { TourismCard } from '@/components/tourism-card'

export default function TourismCardsDemo() {
  const tourismData = [
    {
      id: '1',
      title: 'Serengeti Safari',
      location: 'Tanzania',
      image: '/serengeti.jpg',
      price: 2400,
      rating: 4.8,
      reviews: 324,
      tags: ['Safari', 'Adventure'],
    },
    {
      id: '2',
      title: 'Cape Town Coast',
      location: 'South Africa',
      image: '/cape.jpg',
      price: 1890,
      rating: 4.9,
      reviews: 568,
      tags: ['Coastal', 'Scenic'],
    },
    {
      id: '3',
      title: 'Kilimanjaro Trek',
      location: 'Tanzania',
      image: '/kilomanjaro.jpg',
      price: 3200,
      rating: 4.7,
      reviews: 192,
      tags: ['Trekking', 'Mountain'],
    },
    {
      id: '4',
      title: 'Victoria Falls',
      location: 'Zimbabwe',
      image: '/victoria_falls.jpg',
      price: 1650,
      rating: 4.9,
      reviews: 445,
      tags: ['Nature', 'Waterfall'],
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {tourismData.map((tour) => (
            <TourismCard key={tour.id} {...tour} />
          ))}
        </div>
      </div>
    </main>
  )
}
