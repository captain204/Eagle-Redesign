export default function StaticPage({ params }: { params: { slug: string } }) {
    const title = params.slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center uppercase">{title}</h1>
                <div className="prose max-w-none text-gray-600">
                    <p>
                        Welcome to the {title} page. This is a placeholder content area that would typically contain specific legal
                        or informational text regarding {title}.
                    </p>
                    <h3>1. Introduction</h3>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <h3>2. Details</h3>
                    <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <ul>
                        <li>Point one about {title}</li>
                        <li>Point two about {title}</li>
                        <li>Point three about {title}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
