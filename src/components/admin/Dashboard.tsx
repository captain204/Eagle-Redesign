import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { OrderStats } from './OrderStats'
import { RecentOrders } from './RecentOrders'
import { ProductMigration } from './ProductMigration'
import { LayoutDashboard, Bell, Search, User } from 'lucide-react'

export const Dashboard = async () => {
    const payload = await getPayload({ config: configPromise })

    const recentOrders = await payload.find({
        collection: 'orders',
        sort: '-createdAt',
        limit: 5,
    })

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8 font-outfit">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-[#0f172a] tracking-tight mb-1 flex items-center gap-2">
                        <LayoutDashboard className="text-blue-600" /> Dashboard Overview
                    </h1>
                    <p className="text-slate-500 font-medium">Welcome back! Here's a summary of your store's performance today.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all w-64"
                        />
                    </div>
                    <button className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm relative">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-blue-500 transition-colors">
                        <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                            AD
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <OrderStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column - Orders & Migration */}
                <div className="xl:col-span-8">
                    <ProductMigration />
                    <RecentOrders orders={recentOrders.docs} />
                </div>

                {/* Right Column - Secondary Info */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-2xl p-6 text-white shadow-xl shadow-blue-900/10">
                        <h3 className="font-bold mb-2">1steagle Premium CMS</h3>
                        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                            Unlock the full potential of your e-commerce business with advanced tools and real-time analytics.
                        </p>
                        <button className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 rounded-xl text-sm font-black transition-all shadow-lg active:scale-95">
                            Explore Analytics
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <User className="text-orange-500" size={18} /> Quick Actions
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {['Add Product', 'New Post', 'View Menu', 'Site Health'].map((action) => (
                                <button key={action} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-700 hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all text-center">
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// export default Dashboard
