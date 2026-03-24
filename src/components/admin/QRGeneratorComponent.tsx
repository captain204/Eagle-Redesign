'use client'
import React, { useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@payloadcms/ui'
import { Copy, Download, QrCode, RefreshCcw, Type, Globe } from 'lucide-react'
import { toast } from 'sonner'

export const QRGeneratorComponent: React.FC = () => {
    const [value, setValue] = useState('https://1steagle.com')
    const [fgColor, setFgColor] = useState('#000000')
    const [size, setSize] = useState(256)
    const qrRef = useRef<HTMLDivElement>(null)

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            const url = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `qrcode-custom.png`
            link.href = url
            link.click()
        }
    }

    const copyValue = () => {
        navigator.clipboard.writeText(value)
        toast.success('Text/URL copied!')
    }

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="grid lg:grid-cols-2">
                {/* Preview Side */}
                <div className="p-12 bg-slate-50 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100">
                    <div ref={qrRef} className="p-8 bg-white rounded-[2rem] shadow-xl border border-white">
                        <QRCodeCanvas
                            value={value}
                            size={size}
                            fgColor={fgColor}
                            level="H"
                            includeMargin={true}
                            imageSettings={{
                                src: "/favicon.ico",
                                x: undefined,
                                y: undefined,
                                height: size * 0.2,
                                width: size * 0.2,
                                excavate: true,
                            }}
                        />
                    </div>
                    <div className="mt-8 flex gap-3">
                        <Button
                            buttonStyle="primary"
                            onClick={downloadQR}
                            className="bg-orange-500 text-white hover:bg-orange-600 border-none px-8 h-12 rounded-full font-black shadow-lg shadow-orange-200 active:scale-95 transition-all"
                        >
                            <Download className="w-5 h-5 mr-3" /> Download High-Res
                        </Button>
                    </div>
                </div>

                {/* Controls Side */}
                <div className="p-10 space-y-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <QrCode className="w-4 h-4" /> Marketing Tool
                        </div>
                        <h3 className="text-3xl font-black text-slate-800">Dynamic QR Generator</h3>
                        <p className="text-slate-500 mt-2">Create high-quality QR codes for your physical marketing, menus, or social media.</p>
                    </div>

                    <div className="space-y-6">
                        {/* URL/Text Input */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Globe className="w-3 h-3" /> Target URL or Text
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="Enter your URL here..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 font-medium focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all pr-12"
                                />
                                <button
                                    onClick={copyValue}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Color Picker */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Brand Color</label>
                                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                                    <input
                                        type="color"
                                        value={fgColor}
                                        onChange={(e) => setFgColor(e.target.value)}
                                        className="w-10 h-10 rounded-lg cursor-pointer overflow-hidden border-0 p-0"
                                    />
                                    <span className="text-xs font-mono font-bold text-slate-600 uppercase">{fgColor}</span>
                                </div>
                            </div>

                            {/* Size Slider */}
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Resolution</label>
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="128"
                                        max="512"
                                        step="16"
                                        value={size}
                                        onChange={(e) => setSize(Number(e.target.value))}
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Standard</span>
                                        <span>{size}px</span>
                                        <span>4K</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-400">
                                <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                                <span className="text-xs font-bold">Auto-generating preview...</span>
                            </div>
                            <Button
                                buttonStyle="secondary"
                                onClick={() => setValue('https://1steagle.com')}
                                className="text-[10px] font-black uppercase tracking-widest"
                            >
                                Reset to Default
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
