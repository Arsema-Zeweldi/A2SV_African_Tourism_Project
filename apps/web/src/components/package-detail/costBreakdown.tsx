import React from 'react'
import { AlertCircle, Bus } from 'lucide-react'
import { CostBreakdowns } from '@/app/package-details/data'

interface CostBreakdownsProps {
  props: CostBreakdowns[];
}

const CostBreakdown = ({ props }: CostBreakdownsProps) => {
    const total = props.reduce((sum, c) => sum + c.cost, 0 )

  return (
    <div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-[15px] font-black">Estimated Cost Breakdown</h3>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1.5 rounded-full">Currency: USD ($)</span>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-[#f8f9fa]">
                <tr>
                {['Category', 'Item', 'Notes', 'Cost'].map((h, i) => (
                    <th key={h} className={`px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {props.map((c, i) => (
                <tr key={i}>
                <td className="px-6 py-4 text-[13px] font-semibold text-slate-700">
                    <div className="flex items-center gap-2"><Bus size={13} className="text-[#F97316]" />{c.category}</div>
                </td>
                <td className="px-6 py-4 text-[13px] text-slate-600">{c.item}</td>
                <td className="px-6 py-4 text-[13px] text-slate-400">{c.notes}</td>
                <td className="px-6 py-4 text-[13px] font-bold text-slate-800 text-right">{c.cost}</td>
                </tr>
                ))}

            </tbody>
            <tfoot className="bg-slate-50">
                <tr>
                <td colSpan={3} className="px-6 py-4 text-[13px] font-black text-slate-800">Total Estimated</td>
                <td className="px-6 py-4 text-[15px] font-black text-[#F97316] text-right">${total}</td>
                </tr>
            </tfoot>
            </table>
        </div>
        </div>

        <div className="mt-3 space-y-2.5">
        <div className="bg-red-50/60 border border-red-100 rounded-xl px-3.5 py-2.5 flex items-start gap-2 text-[11px] text-red-800 leading-relaxed">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <p>Prices are subject to exchange rate fluctuations. Last verified by an AI agent on Oct 10th.</p>
        </div>
        </div>
    </div>
  )
}

export default CostBreakdown