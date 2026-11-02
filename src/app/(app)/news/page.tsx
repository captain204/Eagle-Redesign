import { getPayload } from "payload";
import configPromise from "@/payload.config";
import NewsClient, { PostItem } from "./NewsClient";

export const metadata = {
    title: "News & Announcements | 1st𝓔agle Technology",
    description: "Stay updated with the latest news, product launches, innovations, and stories from 1st𝓔agle.",
    openGraph: {
        title: "News & Announcements | 1st𝓔agle Technology",
        description: "Stay updated with the latest news, product launches, innovations, and stories from 1st𝓔agle.",
        url: "https://www.1steagle.com.ng/news",
        siteName: "1st𝓔agle Technology",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "News & Announcements | 1st𝓔agle Technology",
        description: "Stay updated with the latest news, product launches, innovations, and stories from 1st𝓔agle.",
    },
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
    const payload = await getPayload({ config: configPromise });

    let posts: PostItem[] = [];

    try {
        const postsResult = await payload.find({
            collection: "posts",
            sort: "-createdAt",
            depth: 2,
            limit: 100,
            overrideAccess: true,
        });

        // Filter for published posts
        let published = postsResult.docs.filter((p: any) => {
            const isPublished = p.status === "published" || p._status === "published";
            const notTrash = p.status !== "trash" && p.status !== "private";
            return isPublished && notTrash;
        });

        // Fallback: If no published posts found via standard query, include drafts (covers newly created admin posts)
        if (published.length === 0) {
            const draftResult = await payload.find({
                collection: "posts",
                sort: "-createdAt",
                depth: 2,
                limit: 100,
                draft: true,
                overrideAccess: true,
            });
            published = draftResult.docs.filter((p: any) => p.status !== "trash" && p.status !== "private");
        }

        posts = published as unknown as PostItem[];
    } catch (err) {
        console.error("Error fetching posts for news page:", err);
    }

    // Extract unique categories for filtering
    const categorySet = new Set<string>();
    categorySet.add("All");
    posts.forEach((post) => {
        if (Array.isArray(post.categories)) {
            post.categories.forEach((cat) => {
                const title = typeof cat === "object" && cat !== null ? cat.title : cat;
                if (title && typeof title === "string") {
                    categorySet.add(title.trim());
                }
            });
        }
    });

    return (
        <NewsClient
            initialPosts={posts}
            categories={Array.from(categorySet)}
        />
    );
}
