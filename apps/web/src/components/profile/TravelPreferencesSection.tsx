// profile/components/TravelPreferencesSection.tsx

"use client";

import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CLIMATE_OPTIONS, LANGUAGE_OPTIONS, ALL_VIBES, type Profile } from "@/hooks/useProfile";

interface Props {
  profile: Profile;
  updateField: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
  toggleVibe: (vibe: string) => void;
}

export default function TravelPreferencesSection({ profile, updateField, toggleVibe }: Props) {
  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
          Travel Preferences
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="climate" className="text-xs font-medium text-stone-500">
              Default Climate
            </Label>
            <Select
              value={profile.defaultClimate}
              onValueChange={(val) => updateField("defaultClimate", val)}
            >
              <SelectTrigger
                id="climate"
                className="border-stone-200 bg-stone-50 focus:ring-orange-400 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLIMATE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="language" className="text-xs font-medium text-stone-500">
              Preferred Language
            </Label>
            <Select
              value={profile.preferredLanguage}
              onValueChange={(val) => updateField("preferredLanguage", val)}
            >
              <SelectTrigger
                id="language"
                className="border-stone-200 bg-stone-50 focus:ring-orange-400 text-sm"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Vibe tags */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-stone-500">Travel Vibe Interests</Label>
          <div className="flex flex-wrap gap-2">
            {ALL_VIBES.map((vibe) => {
              const active = profile.travelVibes.includes(vibe);
              return (
                <Badge
                  key={vibe}
                  variant="outline"
                  onClick={() => toggleVibe(vibe)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1 text-xs font-medium border transition-all select-none",
                    active
                      ? "bg-orange-500 text-white border-orange-500 hover:bg-orange-600 hover:border-orange-600"
                      : "bg-stone-50 text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
                  )}
                >
                  {vibe}
                </Badge>
              );
            })}

            {/* "Add Interest" placeholder — wire to a custom input/dialog when ready */}
            <Badge
              variant="outline"
              className="cursor-default rounded-full px-3 py-1 text-xs font-medium border border-dashed border-stone-300 text-stone-400 bg-transparent gap-1"
            >
              <Plus className="h-3 w-3" />
              Add Interest
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}