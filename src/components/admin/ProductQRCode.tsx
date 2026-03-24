'use client'
import React, { useRef, useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@payloadcms/ui'
import { useForm, useField } from '@payloadcms/ui'
import { Copy, Download, QrCode, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export const ProductQRCode: React.FC = () => {
    const { getData } = useForm()
    const data = getData()
    const slug = data.slug

    const [baseUrl, setBaseUrl] = useState('')
    const qrRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setBaseUrl(window.location.origin)
    }, [])

    if (!slug) {
        return (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50">
                <QrCode className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-500">Slug required</h3>
                <p className="text-slate-400">Please provide a product slug to generate a QR code.</p>
            </div>
        )
    }

    const productUrl = `${baseUrl}/product/${slug}`

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            const url = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `qrcode-${slug}.png`
            link.href = url
            link.click()
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(productUrl)
        toast.success('Link copied to clipboard!')
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div ref={qrRef} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-inner">
                    <QRCodeCanvas
                        value={productUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: "/favicon.ico",
                            x: undefined,
                            y: undefined,
                            height: 40,
                            width: 40,
                            excavate: true,
                        }}
                    />
                </div>

                <div className="flex-1 space-y-6">
                    <div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">Product QR Code</h3>
                        <p className="text-slate-500 leading-relaxed">
                            This QR code links directly to the live product page. Scan it to view the product on your phone or use it in marketing materials.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            buttonStyle="primary"
                            onClick={downloadQR}
                            className="bg-orange-500 text-white hover:bg-orange-600 border-none"
                        >
                            <Download className="w-4 h-4 mr-2" /> Download PNG
                        </Button>
                        <Button
                            buttonStyle="secondary"
                            onClick={copyLink}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none"
                        >
                            <Copy className="w-4 h-4 mr-2" /> Copy Link
                        </Button>
                        <a
                            href={productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" /> Live Preview
                        </a>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target URL</div>
                        <div className="text-sm font-mono text-slate-600 break-all">{productUrl}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
