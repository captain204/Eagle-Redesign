export const metadata = {
    title: "News | 1stEagle Technology",
    description: "Stay updated with the latest news, product launches, and events from 1stEagle.",
};

export default function NewsPage() {
    return (
        <div className="min-h-[60vh] bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl bg-white rounded-xl shadow-sm p-8 md:p-12">
                <h1 className="text-3xl font-bold mb-6 text-center">Latest News</h1>
                <p className="text-gray-500 mb-12 text-center">
                    Discover our recent product launches, company updates, and technological breakthroughs.
                </p>

                <div className="grid gap-8">
                    {/* Placeholder Article */}
                    <article className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="w-full md:w-1/3 h-48 bg-gray-200 animate-pulse"></div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <span className="text-xs font-bold text-primary uppercase mb-2">Press Release</span>
                            <h2 className="text-xl font-bold mb-2">1stEagle Announces Next-Gen Active Noise Cancelling Earbuds</h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                We are thrilled to introduce the upcoming line of our flagship audio devices featuring industry-leading noise cancellation capabilities.
                            </p>
                            <span className="text-sm text-gray-400 font-medium">March 23, 2026</span>
                        </div>
                    </article>

                    <article className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="w-full md:w-1/3 h-48 bg-gray-200 animate-pulse"></div>
                        <div className="p-6 flex-1 flex flex-col justify-center">
                            <span className="text-xs font-bold text-primary uppercase mb-2">Company Update</span>
                            <h2 className="text-xl font-bold mb-2">Expanding Our Power Solutions Across West Africa</h2>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                                In line with our commitment to accessible energy, 1stEagle opens 50 new partner retail stores across major cities.
                            </p>
                            <span className="text-sm text-gray-400 font-medium">February 10, 2026</span>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
