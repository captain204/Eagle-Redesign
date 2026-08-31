"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Download, Trophy, CheckCircle, XCircle, Search, Settings } from "lucide-react";

export default function RaffleAdminPage() {
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [entries, setEntries] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, verified: 0, flagged: 0 });
    const [winner, setWinner] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/raffle/admin/entries", {
                headers: { 'Authorization': `Bearer ${password}` }
            });
            if (res.ok) {
                setIsAuthenticated(true);
                const data = await res.json();
                setEntries(data.submissions || []);
                setStats(data.stats || { total: 0, verified: 0, flagged: 0 });
            } else {
                alert("Invalid password");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEntries = async () => {
        const res = await fetch("/api/raffle/admin/entries", {
            headers: { 'Authorization': `Bearer ${password}` }
        });
        if (res.ok) {
            const data = await res.json();
            setEntries(data.submissions || []);
            setStats(data.stats || { total: 0, verified: 0, flagged: 0 });
        }
    };

    const handleGenerateCodes = async () => {
        window.open("/api/raffle/admin/generate", "_blank");
        // To pass authorization header to a new window natively is tricky,
        // so we'll fetch the blob instead.
        try {
            const res = await fetch("/api/raffle/admin/generate", {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${password}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Codes_${new Date().getTime()}.pdf`;
                a.click();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDownloadReport = async () => {
        try {
            const res = await fetch("/api/raffle/admin/management-report", {
                headers: { 'Authorization': `Bearer ${password}` }
            });
            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Management_Report.pdf`;
                a.click();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch("/api/raffle/admin/update-status", {
                method: "POST",
                headers: { 
                    'Authorization': `Bearer ${password}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                fetchEntries();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDrawWinner = async () => {
        try {
            const res = await fetch("/api/raffle/admin/draw-winner", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${password}` }
            });
            const data = await res.json();
            if (data.success && data.winner) {
                setWinner(data.winner);
            } else {
                alert(data.message || "Could not draw winner.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex justify-center items-center">
                <div className="bg-white p-10 rounded-xl shadow-sm text-center max-w-sm w-full">
                    <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-6">Raffle Admin</h1>
                    <input 
                        type="password"
                        placeholder="Master Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg mb-4 text-center focus:outline-none focus:border-primary"
                    />
                    <Button onClick={checkAuth} disabled={isLoading} className="w-full bg-black text-white hover:bg-gray-800">
                        {isLoading ? "Checking..." : "Access System"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-extrabold flex items-center gap-3">
                        <Settings className="w-8 h-8 text-primary" />
                        Raffle Management
                    </h1>
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={handleGenerateCodes} className="bg-white text-black border border-gray-200 hover:bg-gray-50">
                            <Ticket className="w-4 h-4 mr-2" /> Generate Codes
                        </Button>
                        <Button onClick={handleDownloadReport} className="bg-primary text-black hover:bg-[#e6551b]">
                            <Download className="w-4 h-4 mr-2" /> Management Report
                        </Button>
                        <Button onClick={handleDrawWinner} className="bg-black text-white hover:bg-gray-800">
                            <Trophy className="w-4 h-4 mr-2" /> Draw Winner
                        </Button>
                    </div>
                </div>

                {winner && (
                    <div className="bg-yellow-50 border-2 border-yellow-400 p-8 rounded-xl mb-8 text-center animate-in zoom-in">
                        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-yellow-800 mb-2">We Have A Winner!</h2>
                        <p className="text-lg mb-1"><strong>Email:</strong> {winner.userEmail}</p>
                        <p className="text-lg"><strong>Phone:</strong> {winner.userPhone || 'N/A'}</p>
                        <Button onClick={() => setWinner(null)} variant="outline" className="mt-4 border-yellow-400 text-yellow-800">Clear</Button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">Total Entries</p>
                            <p className="text-3xl font-bold">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-6 h-6 text-gray-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
                        <div>
                            <p className="text-green-600 font-medium">Verified</p>
                            <p className="text-3xl font-bold text-green-700">{stats.verified}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
                        <div>
                            <p className="text-red-600 font-medium">Flagged (No GPS)</p>
                            <p className="text-3xl font-bold text-red-700">{stats.flagged}</p>
                        </div>
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Entry Queue</h2>
                        <p className="text-gray-500 text-sm mt-1">Review flagged entries without GPS data below.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b text-gray-500 text-sm font-medium">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Email / Phone</th>
                                    <th className="p-4">Photo Evidence</th>
                                    <th className="p-4">Location (GPS)</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map(entry => (
                                    <tr key={entry.id} className="border-b last:border-0 hover:bg-gray-50/50">
                                        <td className="p-4 text-sm">{new Date(entry.createdAt).toLocaleString()}</td>
                                        <td className="p-4">
                                            <p className="font-medium">{entry.userEmail}</p>
                                            <p className="text-xs text-gray-500">{entry.userPhone || '-'}</p>
                                        </td>
                                        <td className="p-4">
                                            {entry.imagePath ? (
                                                <a href={entry.imagePath} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm font-bold flex items-center gap-1">
                                                    View Image
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400">None</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {entry.exifLatitude ? `${entry.exifLatitude.toFixed(4)}, ${entry.exifLongitude.toFixed(4)}` : 'None (Auto or Missing)'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${entry.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {entry.status === 'Flagged' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleUpdateStatus(entry.id, 'Verified')} className="bg-green-500 hover:bg-green-600 text-white h-8 text-xs">Approve</Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {entries.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500">No entries found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
