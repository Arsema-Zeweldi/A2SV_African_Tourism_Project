import Footer from '../../components/footer'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <Footer />
    </div>
  )
}
