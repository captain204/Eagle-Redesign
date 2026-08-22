'use client'
import React from 'react'
import { useFormFields } from '@payloadcms/ui'

export const ExpectedPayoutField: React.FC = () => {
    const amountEarnedField = useFormFields(([fields]) => fields.amountEarned)

    const amountEarned = amountEarnedField?.value as number || 0
    const expectedPayout = amountEarned * 0.8

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    })

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col justify-center mb-6">
            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Expected Payout (After 20% Fee)</div>
            <div className="text-2xl font-black text-blue-600">
                {formatter.format(expectedPayout)}
            </div>
            <div className="text-xs text-blue-500 mt-1">
                This is the actual amount to be paid to the referrer after the platform deducts its 20% fee.
            </div>
        </div>
    )
}
