import Link from 'next/link'
import Navbar from '@/components/navbar'
import FooterSimple from '@/components/footerSimple'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f8f3ea] text-[#2f241d]">
      <Navbar />

      <main className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(236,109,19,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(120,88,59,0.14),_transparent_28%)]" />
        <div className="absolute left-[-6rem] top-20 h-56 w-56 rounded-full bg-[#ec6d13]/10 blur-3xl" />
        <div className="absolute bottom-10 right-[-4rem] h-64 w-64 rounded-full bg-[#8b5e34]/10 blur-3xl" />

        <section className="relative mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center px-6 py-16 lg:px-10">
          <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-5 inline-flex items-center rounded-full border border-[#efcfb5] bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#c96518] backdrop-blur-sm">
                Lost On The Trail
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a06d4a]">
                404
              </p>
              <h1 className="mt-3 max-w-xl font-serif text-4xl font-bold leading-tight text-[#241813] sm:text-5xl">
                this page doesn&apos;t exist
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6d5649] sm:text-lg">
                The route you followed has wandered off the map. Let&apos;s get
                you back to somewhere inspiring.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/home"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d8610f]"
                >
                  Back Home
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center rounded-full border border-[#d8c1ae] bg-white/85 px-6 py-3 text-sm font-semibold text-[#5f4537] transition-colors hover:bg-white"
                >
                  Explore Packages
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-[#eadccf] bg-[linear-gradient(160deg,_#fff8f0,_#f2dfc8_55%,_#d5a16f)] p-8 shadow-[0_30px_80px_rgba(100,58,21,0.12)]">
                <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <div className="rounded-[1.5rem] bg-[#fffaf4]/80 p-7 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[#734f37]">
                    <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                      Scenic Detour
                    </span>
                    <span className="rounded-full bg-[#ec6d13]/12 px-3 py-1 text-xs font-bold text-[#c96518]">
                      404
                    </span>
                  </div>

                  <div className="mt-8 space-y-4">
                    <div className="rounded-2xl bg-[#fff] p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#b17d58]">
                        Status
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#34251c]">
                        this page doesn&apos;t exist
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#fff] p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#b17d58]">
                        Suggestion
                      </p>
                      <p className="mt-2 text-sm leading-7 text-[#6d5649]">
                        Try the home page, marketplace, or your trips to pick up
                        the journey again.
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-end gap-3">
                    <div className="h-20 w-20 rounded-[1.5rem] bg-[#ec6d13]/18" />
                    <div className="h-28 flex-1 rounded-[1.75rem] bg-[#8b5e34]/16" />
                    <div className="h-16 w-16 rounded-[1.25rem] bg-[#f2c48e]/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSimple />
    </div>
  )
}
