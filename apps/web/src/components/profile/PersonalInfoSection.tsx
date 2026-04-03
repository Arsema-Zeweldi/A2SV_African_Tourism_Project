"use client"

import { useRef } from "react"
import { Camera, User, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Profile } from "@/hooks/useProfile"

interface Props {
  profile: Profile
  isUploadingAvatar?: boolean
  updateField: <K extends keyof Profile>(field: K, value: Profile[K]) => void
  onAvatarUpload: (file: File) => void
}

const BIO_MAX = 250

export default function PersonalInfoSection({
  profile,
  isUploadingAvatar,
  updateField,
  onAvatarUpload,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    onAvatarUpload(file)
  }

  const initials = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="border-stone-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-stone-900">
          <span className="block w-0.5 h-5 rounded-full bg-orange-500" />
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-7">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-stone-200">
                {isUploadingAvatar ? (
                  <div className="flex h-full w-full items-center justify-center bg-stone-100 rounded-full">
                    <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                  </div>
                ) : (
                  <>
                    <AvatarImage
                      src={profile.avatarUrl ?? ""}
                      alt={`${profile.firstName} ${profile.lastName}`}
                    />
                    <AvatarFallback className="bg-stone-100 text-stone-400 text-lg font-semibold">
                      {initials || <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-orange-500 text-white flex items-center justify-center border-2 border-white hover:bg-orange-600 transition-colors disabled:opacity-50"
                aria-label="Change avatar"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <p className="text-[11px] text-stone-400 text-center leading-tight">
              JPG, PNG or WebP.<br />Max 5 MB
            </p>
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-4 min-w-0">
            {/* First Name + Last Name */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-xs font-medium text-stone-500">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm"
                  placeholder="First name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-xs font-medium text-stone-500">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email (read-only) + Country */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-stone-500">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  readOnly
                  className="border-stone-200 bg-stone-100 text-stone-500 text-sm cursor-not-allowed"
                  title="Email cannot be changed here"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-xs font-medium text-stone-500">
                  Country
                </Label>
                <Input
                  id="country"
                  value={profile.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="border-stone-200 bg-stone-50 focus-visible:ring-orange-400 text-sm"
                  placeholder="e.g. Ethiopia"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-medium text-stone-500">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) =>
                  e.target.value.length <= BIO_MAX &&
                  updateField("bio", e.target.value)
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
  )
}
