import React from 'react'
import {
  AlertCircle,
  Bus,
  Utensils,
  Bed,
  Ticket,
  MapPin,
  ShoppingBag,
  Music4,
  PawPrint,
} from 'lucide-react'
import type { CostBreakdowns as PackageDetailsCostBreakdownItem } from '@/types/package-details'

interface CostBreakdownsProps {
  props: PackageDetailsCostBreakdownItem[]
  currency?: string
  totalCost?: number
  updatedAt?: string
}

const CATEGORY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  transport: { icon: Bus, color: 'text-blue-500' },
  accommodation: { icon: Bed, color: 'text-purple-500' },
  food: { icon: Utensils, color: 'text-orange-500' },
  'food & drink': { icon: Utensils, color: 'text-orange-500' },
  activity: { icon: Ticket, color: 'text-emerald-500' },
  tour: { icon: MapPin, color: 'text-primary' },
  party: { icon: Music4, color: 'text-fuchsia-500' },
  wildlife: { icon: PawPrint, color: 'text-green-600' },
  shopping: { icon: ShoppingBag, color: 'text-pink-500' },
}

function getCategoryIcon(category: string) {
  const key = category.toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v
  }
  return { icon: Ticket, color: 'text-primary' }
}

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

const CostBreakdown = ({
  props,
  currency = 'USD',
  totalCost,
  updatedAt = 'Recently',
}: CostBreakdownsProps) => {
  const derivedTotal = props.reduce((sum, c) => sum + c.cost, 0)
  const total = typeof totalCost === 'number' ? totalCost : derivedTotal

  return (
    <div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 sm:px-6 py-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
          <h3 className="text-[15px] font-black">Estimated Cost Breakdown</h3>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full">
            Currency: {currency}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-[#f8f9fa]">
              <tr>
                {['Category', 'Item', 'Notes', 'Cost'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 sm:px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${i === 3 ? 'text-right' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {props.map((c, i) => {
                const { icon: Icon, color } = getCategoryIcon(c.category)
                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 sm:px-6 py-4 text-[13px] font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={color} />
                        {c.category}
                      </div>
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[13px] text-slate-600">
                      {c.item}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[13px] text-slate-400">
                      {c.notes}
                    </td>
                    <td className="px-5 sm:px-6 py-4 text-[13px] font-bold text-slate-800 text-right">
                      {formatAmount(c.cost, currency)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td
                  colSpan={3}
                  className="px-5 sm:px-6 py-4 text-[13px] font-black text-slate-800"
                >
                  Total Estimated
                </td>
                <td className="px-5 sm:px-6 py-4 text-[15px] font-black text-primary text-right">
                  {formatAmount(total, currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-3">
        <div className="bg-red-50/60 border border-red-100 rounded-xl px-3.5 py-2.5 flex items-start gap-2 text-[11px] text-red-800 leading-relaxed">
          <AlertCircle size={13} className="shrink-0 mt-0.5" />
          <p>
            Prices are subject to exchange rate fluctuations. Last updated: {updatedAt}.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CostBreakdown
