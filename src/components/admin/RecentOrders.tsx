'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, Package, User, MapPin } from 'lucide-react'

export const RecentOrders = ({ orders }: { orders: any[] }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Package className="text-blue-600" size={20} />
                    Recent Orders
                </h2>
                <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                    View All
                </button>
            </div>

            <div className="divide-y divide-slate-50">
                {orders.map((order) => (
                    <div key={order.id} className="transition-all hover:bg-slate-50/80">
                        {/* Header / Summary Row */}
                        <div
                            className="p-4 flex flex-wrap items-center justify-between cursor-pointer gap-4"
                            onClick={() => toggleExpand(order.id)}
                        >
                            <div className="flex items-center gap-4 min-w-[200px]">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                                    {order.id.slice(-2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">Order #{order.id.slice(-6)}</div>
                                    <div className="text-xs text-slate-500 font-medium">By {order.customer?.name || 'Guest'}</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="hidden sm:block">
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Status</div>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize mt-1 ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Total</div>
                                    <div className="font-bold text-slate-900">₦{order.total.toLocaleString()}</div>
                                </div>

                                <div className="text-slate-400">
                                    {expandedId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>
                        </div>

                        {/* Expandable Content */}
                        {expandedId === order.id && (
                            <div className="px-6 pb-6 pt-2 bg-slate-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                            <Package size={14} /> Item Details
                                        </h4>
                                        <div className="space-y-3">
                                            {order.items?.map((item: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-600 font-medium">{item.product?.title || 'Product'} × {item.quantity}</span>
                                                    <span className="text-slate-900 font-bold">₦{item.price.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-1">
                                            <MapPin size={14} /> Shipping Information
                                        </h4>
                                        <div className="text-sm text-slate-600 leading-relaxed font-medium">
                                            {order.shippingAddress?.name}<br />
                                            {order.shippingAddress?.street},<br />
                                            {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
                                            {order.shippingAddress?.country}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm">
                                        <Eye size={16} /> Full Details
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {orders.length === 0 && (
                <div className="p-12 text-center">
                    <Package className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-500 font-medium font-outfit">No recent orders yet.</p>
                </div>
            )}
        </div>
    )
}

// export default RecentOrders
