import React from 'react'
import {
  MdInsertPhoto,
  MdOutlineVideoCameraBack,
  MdLocationOn,
} from 'react-icons/md'

const NewPost = () => {
  return (
    <div className="bg-white w-full rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-4">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border border-gray-100"
          aria-label="Current user avatar"
          style={{ backgroundImage: 'url("/images/user-icon.png")' }}
        ></div>

        <div className="flex-1 flex flex-col gap-3">
          <textarea
            className="w-full bg-gray-50 border-none rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-1 focus:ring-primary/50 resize-none min-h-20"
            placeholder="Share your journey..."
          ></textarea>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex gap-1">
              <button className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2">
                <MdInsertPhoto className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Photo
                </span>
              </button>
              <button className="cursor-pointer p-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2">
                <MdOutlineVideoCameraBack className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Video
                </span>
              </button>
              <button className="cursor-pointerp-2 rounded-full hover:bg-gray-100 text-primary transition-colors flex items-center gap-2">
                <MdLocationOn className="text-xl" />
                <span className="text-xs font-medium hidden sm:inline">
                  Location
                </span>
              </button>
            </div>
            <button className="bg-primary hover:bg-primary/70 text-white px-6 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPost
