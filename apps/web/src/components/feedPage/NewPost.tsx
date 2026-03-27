'use client'
import { useState, useRef } from 'react'
import {
  MdInsertPhoto,
  MdOutlineVideoCameraBack,
  MdLocationOn,
} from 'react-icons/md'
import { Post } from '@/types/feed'
import { newPost } from '@/services/feedServices'

interface LocationData {
  lat: number
  lng: number
}

const NewPost = () => {
  const [content, setContent] = useState('')
  type MediaType = 'image' | 'video' | null

  const [file, setFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [location, setLocation] = useState<LocationData | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

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
      // 1. Placeholder for File Upload (Simulated)
      // In a real app, you'd send 'file' to S3/Cloudinary here.
      let uploadedUrl = ''
      if (file) {
        // const uploadedUrl = await uploadFileToStorage(file);
        uploadedUrl = 'https://your-storage.com/path-to-image.jpg'
      }

      // 2. Placeholder for Reverse Geocoding (Simulated)
      // Convert {lat, lng} -> "Cape Town, South Africa"
      let locationString = ''
      if (location) {
        // locationString = await getCityName(location.lat, location.lng);
        locationString = 'Cape Town, South Africa'
      }

      const postData: Post = {
        content: content,
        media_url: uploadedUrl,
        media_type: mediaType,
        location: locationString,
        package_name: 'South Africa Coastal Tour',
        tags: [],
      }

      console.log('Sending to API:', postData)
      newPost(postData)

      setContent('')
      setFile(null)
      setMediaType(null)
      setLocation(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Post failed', error)
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
              disabled={!content && !file}
              className="bg-primary hover:bg-primary/70 disabled:opacity-50 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost
