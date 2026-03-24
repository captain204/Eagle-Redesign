'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileCheck, AlertCircle, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export const ProductMigration = () => {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [results, setResults] = useState<{ success: number; errors: number; details: string[] } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResults(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setResults(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/import-products', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed')
            }

            setResults(data)
            toast.success(`Successfully imported ${data.success} products!`)
        } catch (err: any) {
            toast.error(err.message)
            setResults({ success: 0, errors: 1, details: [err.message] })
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-50 bg-slate-50/30">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Upload className="text-orange-500" size={20} />
                    Product Migration (WooCommerce)
                </h2>
                <p className="text-sm text-slate-500 mt-1">Upload your WooCommerce CSV export to migrate products automatically.</p>
            </div>

            <div className="p-8">
                <div
                    className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${file ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv,.xlsx,.xls"
                    />

                    {file ? (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
                                <FileCheck size={32} />
                            </div>
                            <h3 className="font-bold text-slate-900">{file.name}</h3>
                            <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center text-center text-slate-400">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <Upload size={32} />
                            </div>
                            <p className="font-bold text-slate-600">Click to upload or drag and drop</p>
                            <p className="text-xs mt-1 uppercase tracking-widest font-black">CSV, XLSX are supported</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className={`px-8 py-3 rounded-xl font-black transition-all flex items-center gap-2 shadow-lg active:scale-95 ${!file || isUploading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Importing...
                            </>
                        ) : (
                            'Start Migration'
                        )}
                    </button>
                </div>

                {results && (
                    <div className="mt-8 p-6 rounded-2xl bg-slate-900 text-white animate-in zoom-in-95 duration-200">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-emerald-400" size={18} /> Migration Summary
                        </h4>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs font-bold text-white/50 uppercase mb-1">Success</div>
                                <div className="text-2xl font-black text-emerald-400">{results.success}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <div className="text-xs font-bold text-white/50 uppercase mb-1">Errors</div>
                                <div className="text-2xl font-black text-rose-400">{results.errors}</div>
                            </div>
                        </div>

                        {results.details.length > 0 && (
                            <div className="space-y-2 mt-4">
                                <div className="text-xs font-bold text-white/50 uppercase mb-2">Error Logs</div>
                                <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {results.details.map((detail, i) => (
                                        <div key={i} className="text-xs font-medium py-2 px-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 flex items-start gap-2">
                                            <XCircle size={14} className="mt-0.5 shrink-0" />
                                            {detail}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
