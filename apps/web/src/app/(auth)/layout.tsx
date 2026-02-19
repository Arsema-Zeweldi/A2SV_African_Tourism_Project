import Image from 'next/image'
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Image
        src="/images/logo&name.png"
        alt="African Tourism Logo"
        className="z-20 fixed top-8 left-10"
        width={100}
        height={100}
      />
      {children}
    </div>
  )
}
