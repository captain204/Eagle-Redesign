"use client";

import { useState, useEffect } from "react";

interface Ambassador {
    id: string;
    name: string;
    state: string;
    phone?: string;
}

export default function PublicAmbassadorsPage() {
    const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAmbassadors = async () => {
            try {
                const response = await fetch("/api/ambassadors?limit=100&sort=state");
                if (!response.ok) {
                    console.error("API error:", response.status);
                    setAmbassadors([]);
                    return;
                }
                const data = await response.json();
                if (data && Array.isArray(data.docs)) {
                    setAmbassadors(data.docs);
                } else {
                    setAmbassadors([]);
                }
            } catch (error) {
                console.error("Failed to fetch ambassadors:", error);
                setAmbassadors([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAmbassadors();
    }, []);

    // Group by state
    const grouped = ambassadors.reduce((acc: any, curr) => {
        if (!acc[curr.state]) acc[curr.state] = [];
        acc[curr.state].push(curr);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Our Ambassadors</h1>
                <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                    Meet the 1st𝓔agle ambassadors bringing quality products to your local community.
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {Object.entries(grouped).sort().map(([state, members]: [string, any]) => (
                            <div key={state}>
                                <h2 className="text-2xl font-bold border-b-2 border-primary pb-2 mb-6 inline-block">
                                    {state}
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {members.map((a: Ambassador) => (
                                        <div key={a.id} className="bg-[#f9f9f9] p-6 rounded-xl border border-gray-100 shadow-sm">
                                            <p className="font-bold text-lg">{a.name}</p>
                                            <p className="text-primary text-sm font-medium mb-2">{state}</p>
                                            {a.phone && (
                                                <p className="text-gray-600 text-sm flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                    </svg>
                                                    {a.phone}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
