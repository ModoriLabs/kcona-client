'use client'

interface VideoPopupProps {
  isOpen: boolean
  onClose: () => void
  videoSrc: string
  title?: string
}

export function VideoPopup({
  isOpen,
  onClose,
  videoSrc,
  title = 'Video Player',
}: VideoPopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Popup Content */}
      <aside className="relative z-10 mx-auto w-[90%] max-w-[640px]">
        {/* Close button outside the video container */}
        <div className="mb-2 flex justify-end">
          <button
            onClick={onClose}
            className="group rounded-full bg-white/20 p-2 backdrop-blur-sm transition-all duration-200 hover:bg-white/30">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:scale-110">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Video Container */}
        <div className="relative overflow-hidden rounded-2xl bg-black/95 shadow-2xl">
          <video
            controls
            className="aspect-[720/1558] h-auto w-full max-h-[80vh]"
            autoPlay={isOpen}>
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </aside>
    </div>
  )
}
