'use client'
import { useEffect, useRef, useState } from 'react'
import {
  MdInsertPhoto,
  MdOutlineVideoCameraBack,
  MdLocationOn,
} from 'react-icons/md'
import { getPackagesFeedAction } from '@/actions/marketplace_actions'
import { Post } from '@/types/feed'
import { newPost } from '@/services/feedServices'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PackageOption {
  package_id: string
  title: string
}

const NewPost = () => {
  const [content, setContent] = useState('')
  type MediaType = 'image' | 'video' | null

  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [locationName, setLocationName] = useState('')
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [selectedPackage, setSelectedPackage] = useState('')
  const [isLoadingPackages, setIsLoadingPackages] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackagesFeedAction({
          status: 'public',
          page: 1,
          page_size: 50,
          sort_by: 'rating_avg',
          order: 'desc',
        })

        if (!response.success) {
          throw new Error('Failed to load packages')
        }

        setPackages(response.data.data ?? [])
      } catch {
        // Non-critical - package dropdown will show "No packages available"
      } finally {
        setIsLoadingPackages(false)
      }
    }

    fetchPackages()
  }, [])

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: MediaType
  ) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setMediaType(type)
    }
  }

  const handleLocationClick = () => {
    if (!('geolocation' in navigator)) {
      toast.error('Geolocation is not supported by your browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        // Reverse geocode via free Nominatim API
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
          )
          const data = await res.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            ''
          const country = data.address?.country || ''
          const name =
            [city, country].filter(Boolean).join(', ') ||
            `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          setLocationName(name)
          toast.success(`Location: ${name}`)
        } catch {
          const name = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
          setLocationName(name)
          toast.success(`Location pinned: ${name}`)
        }
      },
      () => {
        toast.error('Could not get your location. Check browser permissions.')
      }
    )
  }

  const handlePost = async () => {
    try {
      setIsPosting(true)

      const postData = new FormData()
      postData.append('content', content)
      postData.append('package_name', selectedPackage)

      if (mediaType) {
        postData.append('media_type', mediaType)
      }

      if (locationName) {
        postData.append('location', locationName)
      }

      if (file) {
        postData.append('media', file)
      }

      await newPost(postData)

      toast.success('Post shared!')
      setContent('')
      setFile(null)
      setMediaType(null)
      setLocationName('')
      setSelectedPackage('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (videoInputRef.current) videoInputRef.current.value = ''
    } catch {
      toast.error('Failed to create post. Please try again.')
    } finally {
      setIsPosting(false)
    }
  }
  return (
    <div className="bg-white w-full rounded-xl shadow-sm border border-gray-100 p-4">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={videoInputRef}
        onChange={(e) => handleFileChange(e, 'video')}
      />
      <div className="flex gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border border-gray-100"
          aria-label="Current user avatar"
          style={{ backgroundImage: 'url("/images/user-icon.png")' }}
        ></div>

        <div className="flex-1 flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Related Package
            </p>
            <Select
              value={selectedPackage}
              onValueChange={setSelectedPackage}
              disabled={isLoadingPackages || packages.length === 0}
            >
              <SelectTrigger className="w-full rounded-lg border-gray-100 bg-gray-50 text-left text-slate-900">
                <SelectValue
                  placeholder={
                    isLoadingPackages
                      ? 'Loading packages...'
                      : packages.length > 0
                        ? 'Choose the package related to this post'
                        : 'No packages available'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.package_id} value={pkg.title}>
                    {pkg.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-primary/50 resize-none min-h-20"
            placeholder="Share your journey..."
          ></textarea>

          {/* Preview of selected items */}
          {(file || locationName) && (
            <div className="text-xs text-primary font-medium flex gap-2 flex-wrap">
              {file && <span>📎 {file.name}</span>}
              {locationName && <span>📍 {locationName}</span>}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex gap-1">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2"
              >
                <MdInsertPhoto className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Photo
                </span>
              </button>

              <button
                onClick={() => videoInputRef.current?.click()}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2"
              >
                <MdOutlineVideoCameraBack className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Video
                </span>
              </button>

              <button
                onClick={handleLocationClick}
                className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2"
              >
                <MdLocationOn className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Location
                </span>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={(!content && !file) || !selectedPackage || isPosting}
              className="bg-primary hover:bg-primary/70 disabled:opacity-50 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost
