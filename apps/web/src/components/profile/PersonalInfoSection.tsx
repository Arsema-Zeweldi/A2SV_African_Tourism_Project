// profile/components/PersonalInfoSection.tsx

"use client";

import { useRef } from "react";
import { Camera, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Profile } from "@/hooks/useProfile";

interface Props {
  profile: Profile;
  updateField: <K extends keyof Profile>(field: K, value: Profile[K]) => void;
}

const BIO_MAX = 250;

export default function PersonalInfoSection({ profile, updateField }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Replace with: POST FormData to /api/profile/avatar, then updateField("avatarUrl", data.url)
    updateField("avatarUrl", URL.createObjectURL(file));
  };

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex gap-7 items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-stone-200">
                <AvatarImage src={profile.avatarUrl ?? ""} alt={profile.fullName} />
                <AvatarFallback className="bg-stone-100 text-stone-400 text-lg font-semibold">
                  {initials || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white hover:bg-orange-600 transition-colors"
                aria-label="Change avatar"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-[11px] text-stone-400 text-center leading-tight">
              JPG or PNG.<br />Max 5MB
            </p>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-stone-500">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm"
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-stone-500">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-medium text-stone-500">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  e.target.value.length <= BIO_MAX && updateField("bio", e.target.value)
                }
                rows={4}
                className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm resize-none"
                placeholder="Tell us about yourself…"
              />
              <p className="text-right text-[11px] text-stone-400">
                {profile.bio.length}/{BIO_MAX} characters
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}