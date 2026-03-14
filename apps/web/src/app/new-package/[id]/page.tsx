"use client";

import { useState } from "react";
import { ItineraryData, } from "../../../types/new-package";
import { ItineraryHeader } from "@/components/new-package-details/Itineraryheader";
import { DaySection } from "@/components/new-package-details/DaySection";
import { MapSidebar } from "@/components/new-package-details/MapSideBar";
import { BudgetSidebar } from "@/components/new-package-details/BudegtSideBar";
import { ActionsSidebar } from "@/components/new-package-details/ActionSideBar";
import Desclaimer from "@/components/Desclaimer";

const ITINERARY_DATA: ItineraryData = {
  title: "Cultural Dive into Kigali",
  tags: ["#HISTORY", "#LOCALEATS", "#SOLOTRAVEL"],
  daysCount: 4,
  nightsCount: 3,
  footerText: "© 2026 Amōnā. All rights reserved.",

  map: {
    cityLabel: "Kigali",
    routeLabel: "Route Day 1",
    routeDistance: "10km Total",
  },

  budget: {
    totalMin: 450,
    totalMax: 600,
    isOnTrack: true,
    categories: [
      { label: "Accommodation", amount: 200, color: "bg-orange-400", strokeColor: "#F97316" },
      { label: "Food & Dining",  amount: 150, color: "bg-green-500",  strokeColor: "#22c55e" },
      { label: "Activities",     amount: 180, color: "bg-violet-400", strokeColor: "#a78bfa" },
      { label: "Transport",      amount:  50, color: "bg-gray-300",   strokeColor: "#d1d5db" },
    ],
  },

  days: [
    {
      id: "day-1",
      dayNumber: 1,
      label: "Friday – Arrival & History",
      date: "Oct 12th",
      activities: [
        {
          id: "act-1-1",
          time: "09:00 AM",
          duration: "~2.5 Hours",
          title: "Kigali Genocide Memorial",
          description: "Deep dive into history and resilience. Guided audio tour is highly recommended for context.",
          cost: "$10 entry",
          location: "Gisozi, Kigali",
          type: "monument",
          aiPick: true,
          imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Kigali_genocide_memorial.jpg/400px-Kigali_genocide_memorial.jpg",
        },
        {
          id: "act-1-2",
          time: "01:00 PM",
          duration: "~1.5 Hours",
          title: "Lunch at Repub Lounge",
          description: "Famous for local dishes like Brochettes and Misuzu with a view over the city.",
          cost: "$15–20 est.",
          location: "Kimihurura",
          type: "food",
          imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=60",
        },
        {
          id: "act-1-3",
          time: "07:00 PM",
          duration: "~3 Hours",
          title: "Nyamirambo Walking Tour & Dinner",
          description: "Explore the vibrant Muslim quarter, finish with a traditional home-cooked meal.",
          cost: "$30 tour",
          location: "Nyamirambo",
          type: "tour",
          imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=120&q=60",
        },
      ],
    },
    {
      id: "day-2",
      dayNumber: 2,
      label: "Saturday – Art & Culture",
      date: "Oct 13th",
      activities: [
        {
          id: "act-2-1",
          time: "10:00 AM",
          duration: "~2 Hours",
          title: "Inema Arts Center",
          description: "Contemporary African art gallery run by two brothers. Vibrant paintings and live artists at work.",
          cost: "Free entry",
          location: "Kacyiru, Kigali",
          type: "monument",
          imageUrl: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=120&q=60",
        },
        {
          id: "act-2-2",
          time: "01:30 PM",
          duration: "~1 Hour",
          title: "Cuisine du Terroir",
          description: "Authentic Rwandan buffet with banana beer, isombe, and grilled tilapia.",
          cost: "$12 est.",
          location: "Remera",
          type: "food",
          imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=120&q=60",
        },
      ],
    },
    {
      id: "day-3",
      dayNumber: 3,
      label: "Sunday – Nature & Relax",
      date: "Oct 14th",
      activities: [
        {
          id: "act-3-1",
          time: "08:00 AM",
          duration: "~4 Hours",
          title: "Nyungwe Forest Day Trip",
          description: "Guided canopy walk above the ancient rainforest. Book in advance — slots fill quickly.",
          cost: "$60 guided",
          location: "Nyungwe, Rwanda",
          type: "tour",
          aiPick: true,
          imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=120&q=60",
        },
      ],
    },
  ],
};

export default function Page() {
  const [days, setDays] = useState(ITINERARY_DATA.days);

  const handleDeleteActivity = (activityId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        activities: day.activities.filter((a) => a.id !== activityId),
      }))
    );
  };

  const handleAddActivity = (dayId: string) => {
    console.log("Add activity to:", dayId);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f3]" style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <div className="mx-auto px-4 sm:px-10 py-6">
        <div
          className="grid grid-cols-1 gap-4"
          style={{ gridTemplateColumns: 'minmax(0, 1fr) 380px' }}
        >

          {/* ── Left column ── */}
          <div className="space-y-4 min-w-0">
            <ItineraryHeader data={ITINERARY_DATA} />

            {days.map((day, index) => (
              <DaySection
                key={day.id}
                day={day}
                isFirst={index === 0}
                onDeleteActivity={handleDeleteActivity}
                onAddActivity={handleAddActivity}
              />
            ))}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-3 w-95">
            <MapSidebar config={ITINERARY_DATA.map} />
            <BudgetSidebar budget={ITINERARY_DATA.budget} />
            <ActionsSidebar />
          </div>

        </div>
      </div>

      {ITINERARY_DATA.footerText && (
        <footer className="text-center py-6 text-[11px] text-gray-400">
          {ITINERARY_DATA.footerText}
        </footer>
      )}
      <Desclaimer />
    </div>
  );
}