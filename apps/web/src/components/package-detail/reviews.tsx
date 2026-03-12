import React from 'react'
import { Star } from 'lucide-react';
import type { Reviews } from '@/app/package-details/data';

interface ReviewsProps {
    props: Reviews[];
}

const Reviews = ({props}: ReviewsProps) => {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-start mb-5">
            <div>
                <h3 className="text-[13px] font-black text-slate-800 mb-1.5">Reviews</h3>
                <div className="flex items-end gap-2.5">
                <span className="text-[38px] font-black text-slate-900 leading-none">4.8</span>
                <div className="pb-1">
                    <div className="flex text-[#F97316] gap-0.5 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <p className="text-[10px] text-slate-400">120 verified reviews</p>
                </div>
                </div>
            </div>
            <button className="text-[#F97316] text-[11px] font-bold hover:underline">View all</button>
            </div>

            <div className="space-y-4 mb-5">
               {props.map((review:Reviews, index:number) => (
            <div key={index} className="pb-4 border-b border-slate-50">
                <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                    <img src={review.avatar} alt={review.author} className="w-5 h-5 rounded-full object-cover" />
                    <span className="text-[12px] font-bold text-slate-800">{review.author}</span>
                </div>
                <span className="text-[10px] text-slate-400">{review.date}</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                &quot;{review.text}&quot;
                </p>
            </div>
               ))}
            </div>

            <button className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[12px] font-semibold hover:bg-slate-50 transition-colors">
            Write a Review
            </button>
        </div>
    )
}

export default Reviews