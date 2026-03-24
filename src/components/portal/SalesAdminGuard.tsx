"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    role: string;
    email: string;
}

interface SalesAdminGuardProps {
    children: React.ReactNode;
}

export default function SalesAdminGuard({ children }: SalesAdminGuardProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/users/me');
                if (!response.ok) {
                    router.push('/login?redirect=' + window.location.pathname);
                    return;
                }

                const data = await response.json();
                const currentUser = data.user;

                if (!['super-admin', 'admin', 'sales-admin'].includes(currentUser.role)) {
                    router.push('/portal/ambassador/submit'); // Redirect unauthorized users
                    return;
                }

                setUser(currentUser);
            } catch (error) {
                console.error('Auth check failed:', error);
                router.push('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-bold tracking-widest text-xs uppercase">Authenticating...</p>
                </div>
            </div>
        );
    }

    return user ? <>{children}</> : null;
}
