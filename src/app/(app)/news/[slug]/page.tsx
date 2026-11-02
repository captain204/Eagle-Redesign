import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowLeft, ArrowRight, Sparkles, Tag, ChevronRight } from "lucide-react";
import { RichText } from "@/components/ui/RichText";
import { SocialShare } from "@/components/news/SocialShare";

type PageProps = {
    params: Promise<{ slug: string }>;
};

function getMediaUrl(image: any): string {
    if (!image) return "";
    if (typeof image === "string") return image;
    if (typeof image === "object" && image.url) return image.url;
    if (typeof image === "object" && image.sizes?.card?.url) return image.sizes.card.url;
    return "";
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) return "Recent";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "Recent";
        return d.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return "Recent";
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        console.warn("Could not decode slug in news metadata:", slug);
    }

    const payload = await getPayload({ config: configPromise });

    try {
        let res = await payload.find({
            collection: "posts",
            where: { slug: { equals: decodedSlug } },
            depth: 1,
            limit: 1,
            overrideAccess: true,
        });

        if (res.docs.length === 0) {
            res = await payload.find({
                collection: "posts",
                where: { slug: { equals: decodedSlug } },
                depth: 1,
                limit: 1,
                draft: true,
                overrideAccess: true,
            });
        }

        let post = res.docs[0];

        if (!post && !isNaN(Number(slug))) {
            try {
                post = await payload.findByID({
                    collection: "posts",
                    id: Number(slug),
                    depth: 1,
                    overrideAccess: true,
                });
            } catch (e) {
                try {
                    post = await payload.findByID({
                        collection: "posts",
                        id: Number(slug),
                        depth: 1,
                        draft: true,
                        overrideAccess: true,
                    });
                } catch (e2) {}
            }
        }

        if (!post) {
            return { title: "Article Not Found | 1st𝓔agle News" };
        }

        const title = post.metaTitle || post.title;
        const description = post.metaDescription || post.excerpt || "Read this article on 1st𝓔agle.";
        const mediaUrl = getMediaUrl(post.openGraphImage || post.featuredImage);
        const ogImageUrl = mediaUrl
            ? mediaUrl.startsWith("http")
                ? mediaUrl
                : `https://www.1steagle.com.ng${mediaUrl.startsWith("/") ? "" : "/"}${mediaUrl}`
            : "https://www.1steagle.com.ng/images/1steagle/logo.jpg";

        const postUrl = `https://www.1steagle.com.ng/news/${post.slug || post.id}`;

        return {
            title: `${title} | 1st𝓔agle News`,
            description,
            keywords: post.focusKeyword ? [post.focusKeyword] : undefined,
            openGraph: {
                title: `${title} | 1st𝓔agle Technology`,
                description,
                url: postUrl,
                siteName: "1st𝓔agle Technology",
                type: "article",
                publishedTime: post.publishedDate || post.createdAt,
                images: [
                    {
                        url: ogImageUrl,
                        width: 1200,
                        height: 630,
                        alt: post.title,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${title} | 1st𝓔agle`,
                description,
                images: [ogImageUrl],
            },
        };
    } catch (e) {
        return { title: "News | 1st𝓔agle" };
    }
}

export const dynamic = "force-dynamic";

export default async function NewsPostPage({ params }: PageProps) {
    const { slug } = await params;
    let decodedSlug = slug;
    try {
        decodedSlug = decodeURIComponent(slug);
    } catch (e) {
        console.warn("Could not decode slug in news page:", slug);
    }

    const payload = await getPayload({ config: configPromise });

    // Find the requested post
    let post: any = null;
    try {
        let result = await payload.find({
            collection: "posts",
            where: { slug: { equals: decodedSlug } },
            depth: 2,
            limit: 1,
            overrideAccess: true,
        });

        if (result.docs.length === 0) {
            result = await payload.find({
                collection: "posts",
                where: { slug: { equals: decodedSlug } },
                depth: 2,
                limit: 1,
                draft: true,
                overrideAccess: true,
            });
        }
        post = result.docs[0];

        // Fallback by ID if numeric
        if (!post && !isNaN(Number(slug))) {
            try {
                post = await payload.findByID({
                    collection: "posts",
                    id: Number(slug),
                    depth: 2,
                    overrideAccess: true,
                });
            } catch (e) {
                try {
                    post = await payload.findByID({
                        collection: "posts",
                        id: Number(slug),
                        depth: 2,
                        draft: true,
                        overrideAccess: true,
                    });
                } catch (e2) {}
            }
        }
    } catch (err) {
        console.error("Error querying post:", err);
    }

    if (!post) {
        notFound();
    }

    // Fetch related or latest posts (excluding current post)
    let relatedPosts: any[] = [];
    try {
        const relatedRes = await payload.find({
            collection: "posts",
            where: {
                id: { not_equals: post.id },
            },
            depth: 1,
            limit: 3,
            sort: "-createdAt",
            overrideAccess: true,
        });
        relatedPosts = relatedRes.docs.filter((p: any) => p.status !== "trash");
    } catch (err) {
        console.warn("Could not load related posts:", err);
    }

    const categoryName =
        post.categories && post.categories.length > 0
            ? typeof post.categories[0] === "object"
                ? post.categories[0]?.title
                : post.categories[0]
            : "News";

    const authorName =
        post.author && typeof post.author === "object" && post.author.name
            ? post.author.name
            : "1st𝓔agle Editorial Team";

    const featuredImageUrl = getMediaUrl(post.featuredImage);
    const postUrl = `https://www.1steagle.com.ng/news/${post.slug || post.id}`;

    return (
        <article className="min-h-screen bg-[#FDFDFD] pt-24 pb-24">
            {/* Top Breadcrumb & Navigation Bar */}
            <div className="bg-gray-50 border-b border-gray-200/80 py-4 mb-8">
                <div className="container mx-auto px-4 max-w-4xl flex items-center justify-between gap-4">
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-primary transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to All News</span>
                    </Link>

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link href="/news" className="hover:text-primary transition-colors">News</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-900 font-medium truncate max-w-[200px]">{post.title}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl">
                {/* Article Header */}
                <header className="mb-8">
                    {/* Category & Read Time Pills */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-primary border border-orange-200">
                            <Tag className="w-3 h-3" />
                            {categoryName}
                        </span>

                        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {formatDate(post.publishedDate || post.createdAt)}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gray-400" />
                                {post.estimatedReadingTime || 1} min read
                            </span>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight md:leading-tight mb-6">
                        {post.title}
                    </h1>

                    {/* Author Meta Bar */}
                    <div className="flex items-center justify-between py-4 border-y border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-orange-400 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">{authorName}</p>
                                <p className="text-xs text-gray-500">1st𝓔agle Technology</p>
                            </div>
                        </div>

                        {/* Compact Social Share at Top */}
                        <div className="hidden sm:block">
                            <SocialShare
                                url={postUrl}
                                title={post.title}
                                summary={post.excerpt || ""}
                                variant="compact"
                            />
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {featuredImageUrl && (
                    <div className="relative w-full h-[300px] sm:h-[420px] md:h-[500px] rounded-3xl overflow-hidden mb-10 shadow-lg bg-gray-100 border border-gray-100">
                        <Image
                            src={featuredImageUrl}
                            alt={post.title}
                            fill
                            priority
                            unoptimized
                            className="object-cover object-center"
                        />
                    </div>
                )}

                {/* Excerpt / Lead Paragraph */}
                {post.excerpt && (
                    <div className="mb-8 p-6 sm:p-8 bg-gradient-to-r from-orange-50/70 to-amber-50/40 rounded-2xl border-l-4 border-primary shadow-sm">
                        <p className="text-lg sm:text-xl font-medium text-gray-800 leading-relaxed italic">
                            &ldquo;{post.excerpt}&rdquo;
                        </p>
                    </div>
                )}

                {/* Main Content Body */}
                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-12">
                    <RichText content={post.content} />
                </div>

                {/* Tags Section */}
                {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-200 mb-10">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">Tags:</span>
                        {post.tags.map((t: any, idx: number) => {
                            const tagName = typeof t === "object" ? t.name || t.title : t;
                            return (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors cursor-default"
                                >
                                    #{tagName}
                                </span>
                            );
                        })}
                    </div>
                )}

                {/* Prominent Bottom Social Share Bar */}
                <div className="my-10">
                    <SocialShare
                        url={postUrl}
                        title={post.title}
                        summary={post.excerpt || ""}
                        variant="banner"
                    />
                </div>

                {/* Author / Brand Callout Box */}
                <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-3xl p-6 sm:p-8 md:p-10 my-12 shadow-xl border border-gray-800 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-primary/40 bg-white p-2">
                        <Image
                            src="/images/1steagle/logo.jpg"
                            alt="1st𝓔agle Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="text-center sm:text-left flex-1">
                        <div className="inline-flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>About 1st𝓔agle Technology</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Empowering Your Digital Lifestyle</h3>
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                            1st𝓔agle is Nigeria&apos;s trusted brand for high-performance smart accessories, power banks, audio gadgets, and reliable mobile power solutions built for everyday life.
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                            <Link
                                href="/products"
                                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors shadow-md"
                            >
                                Explore Products
                            </Link>
                            <Link
                                href="/news"
                                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition-colors"
                            >
                                More News
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related / More Stories Section */}
                {relatedPosts.length > 0 && (
                    <div className="pt-10 border-t border-gray-200 mt-14">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-2xl font-extrabold text-gray-900">More Stories</h3>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Keep reading recent news, tips, and updates from 1st𝓔agle
                                </p>
                            </div>
                            <Link
                                href="/news"
                                className="text-xs sm:text-sm font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1 group"
                            >
                                <span>View All</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((related) => {
                                const relUrl = `/news/${related.slug || related.id}`;
                                const relImg = getMediaUrl(related.featuredImage);
                                const relCat =
                                    related.categories && related.categories.length > 0
                                        ? typeof related.categories[0] === "object"
                                            ? related.categories[0]?.title
                                            : related.categories[0]
                                        : "News";

                                return (
                                    <Link
                                        key={related.id}
                                        href={relUrl}
                                        className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col hover:-translate-y-1"
                                    >
                                        <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                                            {relImg ? (
                                                <Image
                                                    src={relImg}
                                                    alt={related.title}
                                                    fill
                                                    unoptimized
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                    1st𝓔agle News
                                                </div>
                                            )}
                                            <span className="absolute top-2.5 left-2.5 text-[10px] font-bold text-primary bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {relCat}
                                            </span>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <span className="text-[11px] text-gray-400 block mb-1.5">
                                                    {formatDate(related.publishedDate || related.createdAt)}
                                                </span>
                                                <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                    {related.title}
                                                </h4>
                                            </div>
                                            <span className="text-xs font-bold text-primary mt-4 inline-flex items-center gap-1 group-hover:underline">
                                                Read article →
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}
