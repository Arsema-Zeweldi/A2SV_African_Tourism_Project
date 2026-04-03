'use client'

import { useState } from 'react'
import Image from 'next/image'
import { COUNTRY_GUIDES } from '@/lib/guides-data'
import type { CountryGuide } from '@/lib/guides-data'
import {
  Shield,
  Landmark,
  Banknote,
  Bus,
  Sun,
  FileText,
  ChevronDown,
  MapPin,
} from 'lucide-react'

const SAFETY_COLORS: Record<string, string> = {
  'Low Risk': 'bg-emerald-100 text-emerald-800',
  Moderate: 'bg-amber-100 text-amber-800',
  'Exercise Caution': 'bg-orange-100 text-orange-800',
}

function GuideCard({ guide }: { guide: CountryGuide }) {
  const [open, setOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="relative h-48 sm:h-56">
        <Image
          src={guide.image}
          alt={guide.country}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{guide.flag}</span>
            <h2 className="text-2xl font-bold text-white">{guide.country}</h2>
          </div>
          <p className="mt-1 text-sm text-white/80">{guide.tagline}</p>
        </div>
      </div>

      {/* Quick Info Bar */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-5 py-3">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${SAFETY_COLORS[guide.safety.level]}`}
        >
          <Shield size={12} />
          {guide.safety.level}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <Banknote size={12} />
          {guide.currency.code}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
          <Sun size={12} />
          {guide.bestTime.split('(')[0].trim()}
        </span>
      </div>

      {/* Collapsed Preview */}
      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <FileText size={18} className="mt-0.5 shrink-0 text-primary" />
          <div>
            <h3 className="text-sm font-bold text-gray-800">Visa</h3>
            <p className="mt-0.5 text-sm text-gray-600">{guide.visa.summary}</p>
          </div>
        </div>
      </div>

      {/* Expand Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-3 text-sm font-semibold text-primary transition-colors hover:bg-gray-50"
      >
        {open ? 'Show less' : 'View full guide'}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded Content */}
      {open && (
        <div className="space-y-6 border-t border-gray-100 px-5 py-5 animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Visa Tip */}
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-800">
              Pro tip:
            </p>
            <p className="mt-1 text-sm text-amber-700">{guide.visa.tip}</p>
          </div>

          {/* Safety */}
          <Section
            icon={<Shield size={18} />}
            title="Safety"
            items={guide.safety.notes}
          />

          {/* Cultural Etiquette */}
          <Section
            icon={<Landmark size={18} />}
            title="Cultural Etiquette"
            items={guide.culture}
          />

          {/* Currency & Payments */}
          <div className="flex items-start gap-3">
            <Banknote size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">
                {guide.currency.name} ({guide.currency.code})
              </h3>
              <p className="mt-1 text-sm text-gray-600">{guide.currency.tip}</p>
            </div>
          </div>

          {/* Transport */}
          <Section
            icon={<Bus size={18} />}
            title="Getting Around"
            items={guide.transport}
          />

          {/* Best Time */}
          <div className="flex items-start gap-3">
            <Sun size={18} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Best Time to Visit</h3>
              <p className="mt-1 text-sm text-gray-600">{guide.bestTime}</p>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function Section({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode
  title: string
  items: string[]
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-primary">{icon}</span>
      <div>
        <h3 className="text-sm font-bold text-gray-800">{title}</h3>
        <ul className="mt-2 space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#221810] py-20 sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-transparent" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#f0a030]">
            <MapPin size={14} />
            Travel Resources
          </div>
          <h1 className="font-serif text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Travel Guides & Resources
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[#a89878]">
            Practical, up-to-date information on visa requirements, safety,
            cultural etiquette, currency, and transport — so you travel smarter,
            not harder.
          </p>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2">
          {COUNTRY_GUIDES.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        {/* More coming soon */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            More destinations coming soon — Ethiopia, Tanzania, Ghana, Senegal & more.
          </p>
        </div>
      </section>
    </div>
  )
}
