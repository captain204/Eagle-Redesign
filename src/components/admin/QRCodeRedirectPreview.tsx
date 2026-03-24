'use client'
import React, { useRef, useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Button } from '@payloadcms/ui'
import { useForm } from '@payloadcms/ui'
import { Copy, Download, QrCode, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export const QRCodeRedirectPreview: React.FC = () => {
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
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center bg-slate-50 mt-4">
                <QrCode className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">Provide a slug to preview the redirect QR code.</p>
            </div>
        )
    }

    const redirectUrl = `${baseUrl}/q/${slug}`

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            const url = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.download = `qr-redirect-${slug}.png`
            link.href = url
            link.click()
        }
    }

    const copyLink = () => {
        navigator.clipboard.writeText(redirectUrl)
        toast.success('Redirect link copied!')
    }

    return (
        <div className="mt-8 bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <QRCodeCanvas
                        value={redirectUrl}
                        size={150}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                            src: "/favicon.ico",
                            x: undefined,
                            y: undefined,
                            height: 30,
                            width: 30,
                            excavate: true,
                        }}
                    />
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Redirect QR</h4>
                        <p className="text-xs text-slate-500">
                            This QR code points to your internal redirect path. If you want an old physical QR code to "work", make sure its encoded URL is redirected to this path.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            buttonStyle="secondary"
                            onClick={downloadQR}
                            className="bg-white border-slate-200 text-xs py-1 h-auto"
                        >
                            <Download className="w-3 h-3 mr-2" /> PNG
                        </Button>
                        <Button
                            buttonStyle="secondary"
                            onClick={copyLink}
                            className="bg-white border-slate-200 text-xs py-1 h-auto"
                        >
                            <Copy className="w-3 h-3 mr-2" /> Copy Link
                        </Button>
                        <a
                            href={redirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1 rounded bg-orange-50 text-orange-600 text-[10px] font-bold hover:bg-orange-100 transition-colors"
                        >
                            <ExternalLink className="w-3 h-3 mr-2" /> Test
                        </a>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 truncate bg-white p-1 rounded border border-slate-100">
                        {redirectUrl}
                    </div>
                </div>
            </div>
        </div>
    )
}
