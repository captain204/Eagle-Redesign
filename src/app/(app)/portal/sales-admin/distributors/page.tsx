"use client";

import React, { useEffect, useState } from 'react';
import SalesAdminLayout from '@/components/portal/SalesAdminLayout';
import {
    Building2,
    MapPin,
    Mail,
    Phone,
    CheckCircle2,
    XCircle,
    Clock,
    Search
} from 'lucide-react';

export default function DistributorsManagementPage() {
    const [distributors, setDistributors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchDistributors();
    }, []);

    const fetchDistributors = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/distributors?sort=-createdAt&limit=50');
            const data = await response.json();
            setDistributors(data.docs);
        } catch (error) {
            console.error('Failed to fetch distributors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/distributors/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            if (response.ok) {
                fetchDistributors();
            }
        } catch (error) {
            console.error('Update failed:', error);
        }
    };

    const filteredDistributors = distributors.filter(d =>
        d.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <SalesAdminLayout>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Partner <span className="text-primary">Distributors</span></h1>
                        <p className="text-gray-400 mt-1">Review and manage distributor network applications.</p>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search distributors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-primary/50 outline-none w-64 transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-20 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : filteredDistributors.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-gray-500">
                            No distributors found.
                        </div>
                    ) : filteredDistributors.map((dist) => (
                        <div key={dist.id} className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md relative group hover:border-white/20 transition-all overflow-hidden">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${dist.status === 'approved' ? 'bg-primary' :
                                            dist.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}></span>
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">{dist.status}</span>
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tight">{dist.businessName}</h3>
                                    <p className="text-gray-400 font-medium">{dist.contactPerson}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl">
                                    <Building2 className="text-primary" size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <span>{dist.lga}, {dist.state}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <MapPin size={16} className="text-primary invisible" />
                                    <span>Area: {dist.area || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Mail size={16} className="text-primary" />
                                    <span className="truncate">{dist.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Phone size={16} className="text-primary" />
                                    <span>{dist.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400">
                                    <Clock size={16} className="text-primary" />
                                    <span>Applied: {new Date(dist.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {dist.status !== 'approved' && (
                                    <button
                                        onClick={() => updateStatus(dist.id, 'approved')}
                                        className="flex-1 bg-primary hover:bg-black hover:text-white text-black py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle2 size={18} />
                                        Approve Partner
                                    </button>
                                )}
                                {dist.status !== 'rejected' && (
                                    <button
                                        onClick={() => updateStatus(dist.id, 'rejected')}
                                        className="flex-1 bg-white/5 hover:bg-red-500/20 text-white hover:text-red-400 py-3 rounded-xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                )}
                            </div>

                            {/* Design decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
                        </div>
                    ))}
                </div>
            </div>
        </SalesAdminLayout>
    );
}
