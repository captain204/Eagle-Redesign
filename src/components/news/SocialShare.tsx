"use client";

import React, { useState, useEffect } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { toast } from "sonner";

interface SocialShareProps {
    url?: string;
    title: string;
    summary?: string;
    variant?: "banner" | "compact" | "floating";
    className?: string;
}

export function SocialShare({
    url,
    title,
    summary,
    variant = "banner",
    className = "",
}: SocialShareProps) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState(url || "");
    const [hasNativeShare, setHasNativeShare] = useState(false);

    useEffect(() => {
        if (!url && typeof window !== "undefined") {
            setShareUrl(window.location.href);
        } else if (url) {
            setShareUrl(url);
        }
        if (typeof navigator !== "undefined" && !!navigator.share) {
            setHasNativeShare(true);
        }
    }, [url]);

    const targetUrl = shareUrl || (typeof window !== "undefined" ? window.location.href : "https://www.1steagle.com.ng/news");

    const handleCopy = async (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        try {
            await navigator.clipboard.writeText(targetUrl);
            setCopied(true);
            toast.success("Link copied to clipboard!", {
                description: "You can now paste and share this post anywhere.",
            });
            setTimeout(() => setCopied(false), 2500);
        } catch (err) {
            toast.error("Failed to copy link. Please copy the URL from your browser.");
        }
    };

    const handleFacebook = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;
        window.open(fbUrl, "_blank", "noopener,noreferrer,width=600,height=500");
    };

    const handleTwitter = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const text = summary ? `${title} — ${summary.slice(0, 100)}...` : title;
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, "_blank", "noopener,noreferrer,width=600,height=500");
    };

    const handleInstagram = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(targetUrl);
            toast.success("Article link copied for Instagram!", {
                description: "Paste it in your Instagram Story sticker, Direct Message, or Bio.",
                duration: 4000,
            });
            window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        } catch (err) {
            window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        }
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const waText = `${title}\n\nRead more at 1stEagle:\n${targetUrl}`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
    };

    const handleNativeShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: summary || title,
                    url: targetUrl,
                });
            } catch (err) {
                // User closed dialog or error
            }
        } else {
            handleCopy(e);
        }
    };

    if (variant === "compact") {
        return (
            <div className={`flex items-center gap-1.5 ${className}`} onClick={(e) => e.stopPropagation()}>
                {/* Facebook */}
                <button
                    onClick={handleFacebook}
                    title="Share on Facebook"
                    className="w-8 h-8 rounded-full bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on Facebook"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>

                {/* X (Twitter) */}
                <button
                    onClick={handleTwitter}
                    title="Share on X"
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black text-gray-800 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on X"
                >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </button>

                {/* Instagram */}
                <button
                    onClick={handleInstagram}
                    title="Share on Instagram"
                    className="w-8 h-8 rounded-full bg-pink-50 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-[#E1306C] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on Instagram"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                </button>

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsApp}
                    title="Share on WhatsApp"
                    className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm"
                    aria-label="Share on WhatsApp"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                </button>

                {/* Copy Link */}
                <button
                    onClick={handleCopy}
                    title={copied ? "Copied!" : "Copy Link"}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                        copied ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    aria-label="Copy link"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-6 bg-gray-50/80 rounded-2xl border border-gray-100 shadow-sm ${className}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
                        <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight">
                            Share this post
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Spread the word to your network on social media
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Facebook */}
                    <button
                        onClick={handleFacebook}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white hover:bg-[#1877F2] text-gray-700 hover:text-white border border-gray-200 hover:border-[#1877F2] transition-all duration-200 shadow-sm active:scale-95"
                    >
                        <svg className="w-4 h-4 fill-current text-[#1877F2] group-hover:text-white" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>Facebook</span>
                    </button>

                    {/* X (formerly Twitter) */}
                    <button
                        onClick={handleTwitter}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white hover:bg-black text-gray-700 hover:text-white border border-gray-200 hover:border-black transition-all duration-200 shadow-sm active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span>Share on X</span>
                    </button>

                    {/* Instagram */}
                    <button
                        onClick={handleInstagram}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white hover:bg-gradient-to-r hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-gray-700 hover:text-white border border-gray-200 hover:border-transparent transition-all duration-200 shadow-sm active:scale-95 group"
                    >
                        <svg className="w-4 h-4 fill-current text-[#E1306C] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        <span>Instagram</span>
                    </button>

                    {/* WhatsApp */}
                    <button
                        onClick={handleWhatsApp}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-white hover:bg-[#25D366] text-gray-700 hover:text-white border border-gray-200 hover:border-[#25D366] transition-all duration-200 shadow-sm active:scale-95 group"
                    >
                        <svg className="w-4 h-4 fill-current text-[#25D366] group-hover:text-white transition-colors" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                        <span>WhatsApp</span>
                    </button>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopy}
                        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95 ${
                            copied
                                ? "bg-emerald-600 text-white border border-emerald-600"
                                : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span>{copied ? "Copied!" : "Copy Link"}</span>
                    </button>

                    {/* Native Share on supported mobile */}
                    {hasNativeShare && (
                        <button
                            onClick={handleNativeShare}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-all duration-200 shadow-sm active:scale-95"
                        >
                            <Share2 className="w-4 h-4" />
                            <span>Share</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
