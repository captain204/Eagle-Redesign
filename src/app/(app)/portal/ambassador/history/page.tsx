"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AmbassadorLayout from "@/components/portal/AmbassadorLayout";

interface Submission {
    id: string;
    createdAt: string;
    status: string;
    distributor?: {
        businessName: string;
    };
    items: {
        product: {
            title: string;
        };
        quantity: number;
        availabilityStatus: string;
    }[];
}

export default function SubmissionHistoryPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                // In real scenario, filtering by current user is handled by API/Cookie
                const response = await fetch("/api/submissions?sort=-createdAt");
                const data = await response.json();
                setSubmissions(data.docs);
            } catch (error) {
                console.error("Failed to fetch submissions:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    return (
        <AmbassadorLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Submissions</h1>
                    <Link href="/portal/ambassador/submit">
                        <Button className="bg-primary text-black font-bold hover:bg-black hover:text-white w-full sm:w-auto">
                            + New Submission
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your history...</p>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow text-center">
                        <p className="text-gray-500 mb-6">You haven't made any submissions yet.</p>
                        <Link href="/portal/ambassador/submit">
                            <Button variant="outline" className="border-primary text-primary">Start your first submission</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {submissions.map((sub) => (
                            <div key={sub.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Ref: #{sub.id.slice(-8).toUpperCase()}</p>
                                        <p className="text-lg font-bold">
                                            {sub.distributor?.businessName || "Distributor Not Listed"}
                                        </p>
                                        <p className="text-xs text-gray-400">{new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${sub.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            sub.status === 'reviewed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm font-bold text-gray-600 mb-2">Items Summary:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {sub.items.map((item, idx) => (
                                            <span key={idx} className="bg-gray-50 px-3 py-1 rounded border text-xs">
                                                {item.product.title} (x{item.quantity}) - {item.availabilityStatus}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AmbassadorLayout>
    );
}
