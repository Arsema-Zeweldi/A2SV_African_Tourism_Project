
import { useState } from "react";
import { ItineraryData } from "../../types/new-package";
import { ItineraryHeader } from "./Itineraryheader";
import { DaySection }      from "./DaySection";
import { MapSidebar }      from "./MapSideBar";
import { BudgetSidebar }   from "./BudegtSideBar";
import { ActionsSidebar }  from "./ActionSideBar";

interface ItineraryPageProps {
  data: ItineraryData;
}

export function ItineraryPage({ data }: ItineraryPageProps) {
  // Mirror days in local state so delete / add work without a backend
  const [days, setDays] = useState(data.days);

  const handleDeleteActivity = (activityId: string) => {
    setDays((prev) =>
      prev.map((day) => ({
        ...day,
        activities: day.activities.filter((a) => a.id !== activityId),
      }))
    );
  };

  const handleAddActivity = (dayId: string) => {
    // TODO: open your add-activity modal here
    console.log("Add activity to day:", dayId);
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f3]"
      style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
    >
      <div className="mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-4">

          {/* ── Left column ── */}
          <div className="lg:flex-1 space-y-4">
            <ItineraryHeader data={data} />

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
          <div className="lg:w-95 lg:shrink-0 space-y-3">
            <MapSidebar config={data.map} />
            <BudgetSidebar budget={data.budget} />
            <ActionsSidebar
              onSave={()    => console.log("Save trip")}
              onShare={()   => console.log("Share trip")}
              onPublishToggle={(v) => console.log("Publish:", v)}
            />
          </div>

        </div>
      </div>

      {data.footerText && (
        <footer className="text-center py-6 text-[11px] text-gray-400">
          {data.footerText}
        </footer>
      )}
    </div>
  );
}