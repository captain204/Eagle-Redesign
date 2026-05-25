"use client";

import { useState, useEffect } from "react";

interface Distributor {
    id: string;
    businessName: string;
    state: string;
    category: string;
    lga: string;
    area?: string;
    contactPerson?: string;
    phone?: string;
    businessAddress?: string;
}

export default function PublicDistributorsPage() {
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDistributors = async () => {
            try {
                const response = await fetch("/api/distributors?where[status][equals]=approved&limit=100&sort=state");
                const data = await response.json();
                setDistributors(data.docs);
            } catch (error) {
                console.error("Failed to fetch distributors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDistributors();
    }, []);

    const grouped = distributors.reduce((acc: any, curr) => {
        if (!acc[curr.state]) acc[curr.state] = [];
        acc[curr.state].push(curr);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-white pt-32 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-center">Authorized Distributors</h1>
                <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
                    Find approved 1st𝓔agle distributors near you. Quality and reliability guaranteed.
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {Object.entries(grouped).sort().map(([state, members]: [string, any]) => (
                            <div key={state}>
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-gray-800">{state}</h2>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {members.map((d: Distributor) => (
                                        <div key={d.id} className="group bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                                            <div className="mb-4">
                                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                                    {d.category}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{d.businessName}</h3>
                                            
                                            {d.contactPerson && <p className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                {d.contactPerson}
                                            </p>}
                                            {d.phone && <p className="text-gray-700 mb-1 flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {d.phone}
                                            </p>}
                                            {d.businessAddress ? (
                                                <p className="text-gray-500 text-sm flex items-start gap-2 mt-2 pt-2 border-t">
                                                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{d.businessAddress}</span>
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-2 pt-2 border-t">
                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {d.lga}{d.area ? `, ${d.area}` : ""}, {state}
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
