'use client'
import React from 'react'

export const ExpectedPayoutCell: React.FC<any> = ({ rowData }) => {
    const amountEarned = rowData?.amountEarned || 0
    const expectedPayout = amountEarned * 0.8

    const formatter = new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
    })

    return (
        <span className="font-bold text-emerald-600">{formatter.format(expectedPayout)}</span>
    )
}
