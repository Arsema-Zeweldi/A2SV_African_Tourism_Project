import { redirect } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import FooterSimple from "@/components/footerSimple"

interface PackageDetailsRedirectPageProps {
  searchParams: Promise<{
    id?: string
  }>
}

const PackageDetailsRedirectPage = async ({
  searchParams,
}: PackageDetailsRedirectPageProps) => {
  const { id } = await searchParams

  if (id) {
    redirect(`/package-details/${id}`)
  }

  return (
    <div className="min-h-screen bg-[#FCFCFD] font-sans text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-[960px] px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-black text-slate-900">Package Details</h1>
          <p className="mt-3 text-sm text-slate-600">
            Open a package from My Packages or the feed to view its details.
          </p>
          <Link
            href="/my-packages"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white"
          >
            Go to My Packages
          </Link>
        </div>
      </main>
      <FooterSimple />
    </div>
  )
}

export default PackageDetailsRedirectPage
