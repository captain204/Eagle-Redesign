"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ticket, Store, Download } from "lucide-react";

export default function DistributorRafflePage() {
    const [pin, setPin] = useState("");
    const [distributorId, setDistributorId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/raffle/distributor/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin, distributorId })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                // Convert base64 to blob and download
                const byteCharacters = atob(data.pdfBase64);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], {type: 'application/pdf'});
                
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = data.filename;
                a.click();
            } else {
                alert(data.error || "Failed to generate codes.");
            }
        } catch (e) {
            console.error(e);
            alert("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex justify-center items-center">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Store className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-extrabold text-center mb-2">Distributor Portal</h1>
                <p className="text-center text-gray-500 mb-8">Generate official raffle codes for offline purchases. (Limit: 200/month)</p>

                <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Distributor ID</label>
                        <input 
                            type="text" 
                            placeholder="e.g. DIST-100"
                            value={distributorId}
                            onChange={(e) => setDistributorId(e.target.value)}
                            className="w-full p-3 border rounded-xl outline-none focus:border-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Security PIN</label>
                        <input 
                            type="password" 
                            placeholder="Enter PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-3 border rounded-xl outline-none focus:border-primary text-center tracking-widest text-lg"
                            required
                        />
                    </div>
                    
                    <Button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-black text-white hover:bg-gray-800 h-12 text-lg font-bold rounded-xl mt-4"
                    >
                        {isLoading ? "Generating..." : <><Download className="w-5 h-5 mr-2" /> Download 50 Codes</>}
                    </Button>
                </form>
            </div>
        </div>
    );
}
