'use client'
import { useEffect, useRef, useState } from 'react'
import {
  MdInsertPhoto,
  MdOutlineVideoCameraBack,
  MdLocationOn,
} from 'react-icons/md'
import { Post } from '@/types/feed'
import { newPost } from '@/services/feedServices'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface LocationData {
  lat: number
  lng: number
}

interface PackageOption {
  package_id: string
  title: string
}

const NewPost = () => {
  const [content, setContent] = useState('')
  type MediaType = 'image' | 'video' | null

  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [selectedPackage, setSelectedPackage] = useState('')
  const [isLoadingPackages, setIsLoadingPackages] = useState(true)
  const [isPosting, setIsPosting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/packages?status=public&page=1&page_size=50&sort_by=rating_avg&order=desc`,
          {
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load packages')
        }

        const data = await response.json()
        setPackages(data.data ?? [])
      } catch (error) {
        console.error('Failed to fetch package options', error)
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
      console.log(`Uploaded a ${type}:`, selectedFile.name)
    }
  }

  const handleLocationClick = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({ lat: latitude, lng: longitude })
          alert(`Location captured: ${latitude}, ${longitude}`)
        },
        (error) => {
          console.error('Error fetching location:', error)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser.')
    }
  }

  const handlePost = async () => {
    try {
      setIsPosting(true)

      // 2. Placeholder for Reverse Geocoding (Simulated)
      // Convert {lat, lng} -> "Cape Town, South Africa"
      let locationString = ''
      if (location) {
        // locationString = await getCityName(location.lat, location.lng);
        locationString = 'Cape Town, South Africa'
      }

      const postData = new FormData()
      postData.append('content', content)
      postData.append('package_name', selectedPackage)

      if (mediaType) {
        postData.append('media_type', mediaType)
      }

      if (locationString) {
        postData.append('location', locationString)
      }

      if (file) {
        postData.append('media', file)
      }

      console.log('Sending to API:', postData)
      await newPost(postData)

      setContent('')
      setFile(null)
      setMediaType(null)
      setLocation(null)
      setSelectedPackage('')
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (videoInputRef.current) videoInputRef.current.value = ''
    } catch (error) {
      console.error('Post failed', error)
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
          {(file || location) && (
            <div className="text-xs text-primary font-medium flex gap-2">
              {file && <span>📎 {file.name}</span>}
              {location && <span>📍 Location pinned</span>}
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
