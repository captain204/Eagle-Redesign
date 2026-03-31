import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { notFound } from "next/navigation";
import { RichText } from "@/components/ui/RichText";

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const payload = await getPayload({ config: configPromise });

    const result = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug,
            },
        },
        limit: 1,
    });

    const page = result.docs[0];

    if (!page) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">{page.title}</h1>
                <div className="prose max-w-none text-gray-600">
                    {page.layout?.map((block: any, i: number) => {
                        if (block.blockType === 'content') {
                            return <RichText key={i} content={block.text} />;
                        }
                        if (block.blockType === 'hero') {
                            return (
                                <div key={i} className="mb-12 text-center">
                                    <h2 className="text-2xl font-bold mb-4">{block.heading}</h2>
                                    {block.subheading && <p className="text-lg text-gray-500">{block.subheading}</p>}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}

