"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Calendar, Clock, ArrowRight, Sparkles, Newspaper, Tag as TagIcon } from "lucide-react";
import { SocialShare } from "@/components/news/SocialShare";

export interface PostItem {
    id: number | string;
    title: string;
    slug?: string | null;
    excerpt?: string | null;
    content?: any;
    featuredImage?: any;
    author?: any;
    categories?: any[];
    tags?: any[];
    publishedDate?: string | null;
    createdAt?: string;
    estimatedReadingTime?: number | null;
    status?: string;
    _status?: string;
}

interface NewsClientProps {
    initialPosts: PostItem[];
    categories: string[];
}

function getMediaUrl(image: any): string {
    if (!image) return "/images/placeholder.jpg";
    if (typeof image === "string") return image;
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "object" && image.sizes?.card?.url) return image.sizes.card.url;
    return "/images/placeholder.jpg";
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "Recent";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Recent";
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return "Recent";
    }
}

export default function NewsClient({ initialPosts, categories }: NewsClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Filter posts
    const filteredPosts = useMemo(() => {
        return initialPosts.filter((post) => {
            const matchesCategory =
                selectedCategory === "All" ||
                (post.categories || []).some((c) => {
                    const catTitle = typeof c === "object" ? c?.title : c;
                    return catTitle?.toLowerCase() === selectedCategory.toLowerCase();
                });

            if (!matchesCategory) return false;

            if (!searchQuery.trim()) return true;

            const query = searchQuery.toLowerCase();
            const inTitle = post.title?.toLowerCase().includes(query);
            const inExcerpt = post.excerpt?.toLowerCase().includes(query);
            const inCategory = (post.categories || []).some((c) => {
                const catTitle = typeof c === "object" ? c?.title : c;
                return catTitle?.toLowerCase().includes(query);
            });

            return inTitle || inExcerpt || inCategory;
        });
    }, [initialPosts, selectedCategory, searchQuery]);

    // Separate featured post (first post) and rest of posts
    const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const regularPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
            {/* Header Hero Section */}
            <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white pt-12 pb-16 px-4 mb-10 border-b border-gray-800">
                <div className="container mx-auto max-w-6xl text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider mb-4 animate-fade-in">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>1st𝓔agle News & Insights</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
                        Latest News & <span className="text-primary">Announcements</span>
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
                        Stay updated with our latest smart gadgets, technological breakthroughs, product launches, and company stories.
                    </p>

                    {/* Search & Filter Bar */}
                    <div className="mt-8 max-w-xl mx-auto relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles by title, product, or topic..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white/15 transition-all text-sm"
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/10"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Categories Tab Bar */}
                {categories.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
                        {categories.map((cat) => {
                            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                                        isActive
                                            ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-12">
                        <div className="w-16 h-16 rounded-full bg-orange-50 text-primary flex items-center justify-center mx-auto mb-4">
                            <Newspaper className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            {searchQuery
                                ? `We couldn't find any news posts matching "${searchQuery}".`
                                : "Check back soon for fresh updates, announcements, and product releases."}
                        </p>
                        {(searchQuery || selectedCategory !== "All") && (
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Featured Post Card (Top Hero) */}
                {featuredPost && (
                    <div className="mb-12">
                        <div className="group relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                {/* Image Column */}
                                <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[300px] overflow-hidden bg-gray-100">
                                    <Link href={`/news/${featuredPost.slug || featuredPost.id}`}>
                                        <Image
                                            src={getMediaUrl(featuredPost.featuredImage)}
                                            alt={featuredPost.title}
                                            fill
                                            unoptimized
                                            priority
                                            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        />
                                    </Link>
                                    <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                            <Sparkles className="w-3.5 h-3.5" /> Featured Story
                                        </span>
                                    </div>
                                </div>

                                {/* Content Column */}
                                <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                                            {featuredPost.categories && featuredPost.categories.length > 0 && (
                                                <span className="font-bold text-primary uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-md">
                                                    {typeof featuredPost.categories[0] === "object"
                                                        ? featuredPost.categories[0]?.title
                                                        : featuredPost.categories[0]}
                                                </span>
                                            )}
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(featuredPost.publishedDate || featuredPost.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {featuredPost.estimatedReadingTime || 1} min read
                                            </span>
                                        </div>

                                        <Link href={`/news/${featuredPost.slug || featuredPost.id}`}>
                                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-4">
                                                {featuredPost.title}
                                            </h2>
                                        </Link>

                                        {featuredPost.excerpt && (
                                            <p className="text-gray-600 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6">
                                                {featuredPost.excerpt}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <Link
                                            href={`/news/${featuredPost.slug || featuredPost.id}`}
                                            className="inline-flex items-center gap-2 font-bold text-sm text-primary hover:text-primary/80 transition-colors group/link"
                                        >
                                            <span>Read Full Article</span>
                                            <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                        </Link>

                                        {/* Social Share Compact Bar */}
                                        <SocialShare
                                            url={typeof window !== "undefined" ? `${window.location.origin}/news/${featuredPost.slug || featuredPost.id}` : `https://www.1steagle.com.ng/news/${featuredPost.slug || featuredPost.id}`}
                                            title={featuredPost.title}
                                            summary={featuredPost.excerpt || ""}
                                            variant="compact"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Regular Posts Grid */}
                {regularPosts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">More Recent Stories</h3>
                            <span className="text-xs text-gray-500 font-medium">
                                Showing {regularPosts.length} {regularPosts.length === 1 ? "article" : "articles"}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {regularPosts.map((post) => {
                                const postUrl = `/news/${post.slug || post.id}`;
                                const categoryName =
                                    post.categories && post.categories.length > 0
                                        ? typeof post.categories[0] === "object"
                                            ? post.categories[0]?.title
                                            : post.categories[0]
                                        : "News";

                                return (
                                    <article
                                        key={post.id}
                                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
                                    >
                                        {/* Thumbnail */}
                                        <Link href={postUrl} className="block relative h-48 w-full bg-gray-100 overflow-hidden">
                                            <Image
                                                src={getMediaUrl(post.featuredImage)}
                                                alt={post.title}
                                                fill
                                                unoptimized
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3">
                                                <span className="text-[11px] font-bold text-primary bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    {categoryName}
                                                </span>
                                            </div>
                                        </Link>

                                        {/* Card Body */}
                                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {formatDate(post.publishedDate || post.createdAt)}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {post.estimatedReadingTime || 1} min
                                                    </span>
                                                </div>

                                                <Link href={postUrl}>
                                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-2.5 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                </Link>

                                                {post.excerpt && (
                                                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                                                        {post.excerpt}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                                <Link
                                                    href={postUrl}
                                                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <span>Read More</span>
                                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                </Link>

                                                <SocialShare
                                                    url={typeof window !== "undefined" ? `${window.location.origin}${postUrl}` : `https://www.1steagle.com.ng${postUrl}`}
                                                    title={post.title}
                                                    summary={post.excerpt || ""}
                                                    variant="compact"
                                                />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
