'use client'

import React, { useState } from 'react'
import { Upload } from 'lucide-react'
import { ProductMigration } from './ProductMigration'

export const ImportProductsInline = () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="mb-6">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex flex-row items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                    <Upload size={16} />
                    Import Products via CSV
                </button>
            ) : (
                <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-900">Import WooCommerce CSV</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                        >
                            Cancel / Close
                        </button>
                    </div>
                    {/* The ProductMigration component has its own styling, but we render it here */}
                    <div className="border border-slate-100 rounded-2xl overflow-hidden">
                        <ProductMigration />
                    </div>
                </div>
            )}
        </div>
    )
}
