"use client";

import React, { useEffect, useState } from 'react';
import SalesAdminLayout from '@/components/portal/SalesAdminLayout';
import Link from 'next/link';
import {
    Search,
    Filter,
    MoreHorizontal,
    ExternalLink,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubmissionsManagementPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/submissions?sort=-createdAt&limit=50');
            const data = await response.json();
            setSubmissions(data.docs);
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, field: string, value: string) => {
        try {
            const response = await fetch(`/api/submissions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value }),
            });
            if (response.ok) {
                fetchSubmissions();
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.ambassador?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.distributor?.businessName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SalesAdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Ambassador <span className="text-primary">Submissions</span></h1>
                        <p className="text-gray-400 mt-1">Manage and review product availability requests.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search requests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-primary/50 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="bg-white/5 border border-white/10 p-2 rounded-xl hover:bg-white/10 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-md">
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                    <th className="px-8 py-6">ID / Date</th>
                                    <th className="px-6 py-6">Ambassador</th>
                                    <th className="px-6 py-6">Distributor</th>
                                    <th className="px-6 py-6">Status</th>
                                    <th className="px-6 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                                        </td>
                                    </tr>
                                ) : filteredSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-gray-500">
                                            No submissions found.
                                        </td>
                                    </tr>
                                ) : filteredSubmissions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-sm">#{sub.id.slice(-6).toUpperCase()}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <p className="text-sm font-medium">{sub.ambassador?.name || 'Unknown'}</p>
                                        </td>
                                        <td className="px-6 py-6 text-gray-400">
                                            <p className="text-sm">{sub.distributor?.businessName || 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-6">
                                            <select
                                                value={sub.status}
                                                onChange={(e) => updateStatus(sub.id, 'status', e.target.value)}
                                                className={`bg-transparent text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-lg border outline-none ${sub.status === 'completed' ? 'border-green-500/30 text-green-500' :
                                                    sub.status === 'reviewed' ? 'border-blue-500/30 text-blue-500' :
                                                        'border-yellow-500/30 text-yellow-500'
                                                    }`}
                                            >
                                                <option value="submitted" className="bg-[#0a0a0c]">Submitted</option>
                                                <option value="reviewed" className="bg-[#0a0a0c]">Reviewed</option>
                                                <option value="completed" className="bg-[#0a0a0c]">Completed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {sub.pdfSummary && (
                                                    <a
                                                        href={sub.pdfSummary.url}
                                                        target="_blank"
                                                        className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-white/5 rounded-lg"
                                                        title="View PDF"
                                                    >
                                                        <FileCheck size={18} />
                                                    </a>
                                                )}
                                                <Link
                                                    href={`/admin/collections/submissions/${sub.id}`}
                                                    className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg"
                                                    title="Edit details"
                                                >
                                                    <ExternalLink size={18} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden divide-y divide-white/5">
                        {isLoading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                            </div>
                        ) : filteredSubmissions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No submissions found.
                            </div>
                        ) : filteredSubmissions.map((sub) => (
                            <div key={sub.id} className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-black text-sm text-primary tracking-tighter">#{sub.id.slice(-6).toUpperCase()}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{new Date(sub.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <select
                                        value={sub.status}
                                        onChange={(e) => updateStatus(sub.id, 'status', e.target.value)}
                                        className={`bg-transparent text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border outline-none ${sub.status === 'completed' ? 'border-green-500/30 text-green-500' :
                                            sub.status === 'reviewed' ? 'border-blue-500/30 text-blue-500' :
                                                'border-yellow-500/30 text-yellow-500'
                                            }`}
                                    >
                                        <option value="submitted" className="bg-[#0a0a0c]">Submitted</option>
                                        <option value="reviewed" className="bg-[#0a0a0c]">Reviewed</option>
                                        <option value="completed" className="bg-[#0a0a0c]">Completed</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Ambassador</p>
                                        <p className="text-sm font-bold truncate">{sub.ambassador?.name || 'Unknown'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Distributor</p>
                                        <p className="text-sm font-bold truncate">{sub.distributor?.businessName || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    {sub.pdfSummary && (
                                        <a
                                            href={sub.pdfSummary.url}
                                            target="_blank"
                                            className="flex-1 bg-white/5 text-gray-400 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-white/10"
                                        >
                                            <FileCheck size={16} />
                                            View PDF
                                        </a>
                                    )}
                                    <Link
                                        href={`/admin/collections/submissions/${sub.id}`}
                                        className="flex-1 bg-primary text-black py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={16} />
                                        Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SalesAdminLayout>
    );
}
