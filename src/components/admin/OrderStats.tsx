import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { TrendingUp, ShoppingCart, Calendar, Clock } from 'lucide-react'

export const OrderStats = async () => {
    const payload = await getPayload({ config: configPromise })

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [daily, weekly, monthly] = await Promise.all([
        payload.find({
            collection: 'orders',
            where: {
                createdAt: {
                    greater_than_equal: startOfDay.toISOString(),
                },
            },
            limit: 0,
        }),
        payload.find({
            collection: 'orders',
            where: {
                createdAt: {
                    greater_than_equal: startOfWeek.toISOString(),
                },
            },
            limit: 0,
        }),
        payload.find({
            collection: 'orders',
            where: {
                createdAt: {
                    greater_than_equal: startOfMonth.toISOString(),
                },
            },
            limit: 0,
        }),
    ])

    const stats = [
        {
            label: 'Today Orders',
            value: daily.totalDocs,
            revenue: daily.docs.reduce((acc, curr) => acc + (curr.total || 0), 0),
            icon: Clock,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
        {
            label: 'Weekly Orders',
            value: weekly.totalDocs,
            revenue: weekly.docs.reduce((acc, curr) => acc + (curr.total || 0), 0),
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Monthly Orders',
            value: monthly.totalDocs,
            revenue: monthly.docs.reduce((acc, curr) => acc + (curr.total || 0), 0),
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                        <p className="text-sm font-medium text-slate-500">
                            Revenue: <span className="text-slate-900">₦{stat.revenue.toLocaleString()}</span>
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}

// export default OrderStats
