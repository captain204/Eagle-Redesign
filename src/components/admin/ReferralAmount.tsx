'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const ReferralAmount: React.FC = () => {
    const priceField = useFormFields((context) => {
        if (!context || !Array.isArray(context)) return undefined;
        return context[0]?.price;
    })
    const percentageField = useFormFields((context) => {
        if (!context || !Array.isArray(context)) return undefined;
        return context[0]?.referralPercentage;
    })

    const price = (priceField?.value as number) || 0
    const percentage = (percentageField?.value as number) || 0

    const amount = (price * percentage) / 100

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    })

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-center">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Referral Commission</div>
            <div className="text-2xl font-black text-emerald-600">
                {formatter.format(amount)}
            </div>
            <div className="text-xs text-slate-500 mt-1">
                Amount earned by referrer when this product is purchased.
            </div>
        </div>
    )
}
