"use client";

import React, { useEffect, useState } from 'react';
import SalesAdminLayout from '@/components/portal/SalesAdminLayout';
import {
    Users,
    FileCheck,
    Clock,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export default function SalesAdminDashboard() {
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        pendingSubmissions: 0,
        approvedDistributors: 0,
        pendingDistributors: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [subRes, distRes] = await Promise.all([
                    fetch('/api/submissions?limit=0'),
                    fetch('/api/distributors?limit=0')
                ]);

                const subData = await subRes.json();
                const distData = await distRes.json();

                setStats({
                    totalSubmissions: subData.totalDocs,
                    pendingSubmissions: subData.docs.filter((s: any) => s.status === 'submitted').length,
                    approvedDistributors: distData.docs.filter((d: any) => d.status === 'approved').length,
                    pendingDistributors: distData.docs.filter((d: any) => d.status === 'pending').length,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Submissions', value: stats.totalSubmissions, icon: FileCheck, color: 'text-blue-400' },
        { label: 'Pending Reviews', value: stats.pendingSubmissions, icon: Clock, color: 'text-yellow-400' },
        { label: 'Network Size', value: stats.approvedDistributors, icon: TrendingUp, color: 'text-primary' },
        { label: 'New Applications', value: stats.pendingDistributors, icon: Users, color: 'text-purple-400' },
    ];

    return (
        <SalesAdminLayout>
            <div className="space-y-10">
                {/* Hero Section */}
                <section>
                    <h1 className="text-4xl font-black mb-2 tracking-tight">System <span className="text-primary italic">Overview</span></h1>
                    <p className="text-gray-400 max-w-xl text-lg">Real-time performance metrics and application status monitoring.</p>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group hover:border-primary/50 transition-all duration-500">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                {stat.value > 0 && (
                                    <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full text-gray-400">ACTIVE</span>
                                )}
                            </div>
                            <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-3xl font-black mt-1">{isLoading ? '...' : stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Recent Activity / Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">
                    <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[40px] p-8 backdrop-blur-md">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-primary" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="bg-primary hover:bg-black hover:text-white text-black p-6 rounded-3xl font-bold text-left transition-all group flex flex-col justify-between h-40">
                                <span className="text-xs uppercase opacity-70">Submissions</span>
                                <span className="text-2xl leading-tight">Review Pending<br />Product Requests</span>
                                <FileCheck className="self-end group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="bg-white/10 hover:bg-white text-white hover:text-black p-6 rounded-3xl font-bold text-left transition-all group flex flex-col justify-between h-40 border border-white/5">
                                <span className="text-xs uppercase opacity-50">Distributors</span>
                                <span className="text-2xl leading-tight">Manage Partner<br />Onboarding</span>
                                <TrendingUp className="self-end group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 rounded-[40px] p-8 flex flex-col justify-between h-full group overflow-hidden relative">
                        <div className="z-10">
                            <h3 className="text-2xl font-black mb-4">Ambassador<br />Growth Plan</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-8">
                                Your ambassador network has grown by 12% this month. Keep approving quality partners to scale the 1stEagle distribution.
                            </p>
                        </div>
                        <button className="bg-white text-black py-4 px-6 rounded-2xl font-black text-sm z-10 hover:bg-primary transition-colors">
                            VIEW GROWTH REPORTS
                        </button>

                        {/* Design element */}
                        <div className="absolute top-1/2 right-[-20%] w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    </div>
                </div>
            </div>
        </SalesAdminLayout>
    );
}
