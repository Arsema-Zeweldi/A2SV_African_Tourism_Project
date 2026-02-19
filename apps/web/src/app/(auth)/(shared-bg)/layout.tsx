import Image from 'next/image'
export default function LoginForgotLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="font-display bg-background-light text-slate-900 min-h-screen">
        <div className="fixed inset-0 z-0">
          <Image
            alt="African Sunset"
            className="w-full h-full object-cover"
            src="/images/African-Sunset.png"
            height="1280"
            width="1024"
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <Image
          src="/images/logo&name.png"
          alt="African Tourism Logo"
          className="z-20 fixed top-8 left-10"
          width={100}
          height={100}
        />
        <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-end md:items-stretch justify-between px-4 py-8 md:px-12 lg:px-24">
          <div className="hidden md:fixed md:top-80 md:bottom-0 md:left-0 md:flex md:w-2/5 lg:w-1/2 flex-col justify-center pb-12 lg:pb-20 text-white pr-12 md:pl-12">
            <h1 className="text-4xl lg:text-7xl font-bold leading-tight mb-6">
              Witness the <span className="text-primary">Golden Hour</span> of
              Africa.
            </h1>
            <p className="text-lg lg:text-xl text-slate-200 max-w-lg">
              Experience curated journeys through the heart of the savannah,
              where every sunset tells a new story.
            </p>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}
