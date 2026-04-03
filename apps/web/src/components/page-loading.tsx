import Image from 'next/image'

interface PageLoadingProps {
  title?: string
  subtitle?: string
}

export default function PageLoading({
  title = 'Preparing your next stop',
  subtitle = 'We are gathering routes, stories, and details for your journey.',
}: PageLoadingProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f8f3ea]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,109,19,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(139,94,52,0.14),_transparent_30%)]" />
      <div className="absolute left-[-4rem] top-20 h-52 w-52 rounded-full bg-[#ec6d13]/10 blur-3xl" />
      <div className="absolute right-[-5rem] top-1/3 h-72 w-72 rounded-full bg-[#7f5539]/10 blur-3xl" />
      <div className="absolute bottom-[-3rem] left-1/3 h-56 w-56 rounded-full bg-[#f2c48e]/25 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16 lg:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#efd9c4] bg-white/75 px-4 py-2 backdrop-blur-sm">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />
              <span className="text-xs font-semibold uppercase tracking-[0.26em] text-[#c96518]">
                Amona Loading
              </span>
            </div>

            <div className="mt-6">
              <Image
                src="/images/logo&name.png"
                alt="Amona"
                width={170}
                height={56}
                className="h-10 w-auto object-contain"
              />
            </div>

            <h1 className="mt-8 max-w-xl font-serif text-4xl font-bold leading-tight text-[#241813] sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#6d5649] sm:text-lg">
              {subtitle}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-2 w-20 overflow-hidden rounded-full bg-[#ead6c3]">
                <div className="h-full w-1/2 animate-[loading-slide_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
              </div>
              <span className="text-sm font-medium text-[#8c6d5d]">
                Finding the best path...
              </span>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#eadccf] bg-white/70 p-5 shadow-[0_30px_80px_rgba(100,58,21,0.10)] backdrop-blur-sm">
            <div className="grid gap-4">
              <div className="animate-pulse rounded-[1.75rem] bg-[#fff8f2] p-4">
                <div className="h-44 rounded-[1.5rem] bg-[linear-gradient(135deg,_#ecdcc7,_#f5ede2,_#e5c19d)]" />
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#ead6c3]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-28 rounded-full bg-[#ead6c3]" />
                    <div className="h-3 w-20 rounded-full bg-[#f0dfcf]" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded-full bg-[#f0dfcf]" />
                  <div className="h-3 w-5/6 rounded-full bg-[#f0dfcf]" />
                  <div className="h-3 w-2/3 rounded-full bg-[#f0dfcf]" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="animate-pulse rounded-[1.5rem] bg-[#fffaf4] p-4">
                  <div className="h-24 rounded-[1.25rem] bg-[#efdfd1]" />
                  <div className="mt-4 h-3 w-2/3 rounded-full bg-[#ead6c3]" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-[#f0dfcf]" />
                </div>
                <div className="animate-pulse rounded-[1.5rem] bg-[#fffaf4] p-4">
                  <div className="h-24 rounded-[1.25rem] bg-[#efdfd1]" />
                  <div className="mt-4 h-3 w-2/3 rounded-full bg-[#ead6c3]" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-[#f0dfcf]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
