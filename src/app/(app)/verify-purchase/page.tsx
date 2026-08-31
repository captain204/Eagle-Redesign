"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Ticket, Upload, MapPin, CheckCircle, AlertTriangle } from "lucide-react";

export default function VerifyPurchasePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [result, setResult] = useState<{ success: boolean; status?: string; message: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userRes = await fetch("/api/users/me");
                if (!userRes.ok) throw new Error("Not logged in");
                const userData = await userRes.json();
                
                if (!userData.user) {
                    router.push("/login?message=Please login to enter the raffle.");
                    return;
                }
                
                setUser(userData.user);
            } catch (error) {
                console.error("Failed to load user:", error);
                router.push("/login?message=Please login to enter the raffle.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!photo || !code) return;

        setIsSubmitting(true);
        setResult(null);

        const formData = new FormData();
        formData.append("code", code.toUpperCase());
        formData.append("photo", photo);
        formData.append("userEmail", user.email);
        if (user.payoutDetails?.phone) {
            formData.append("userPhone", user.payoutDetails.phone);
        }

        try {
            const res = await fetch("/api/raffle/verify", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setResult({ success: true, status: data.status, message: data.message });
            } else {
                setResult({ success: false, message: data.error || "Verification failed." });
            }
        } catch (error) {
            console.error(error);
            setResult({ success: false, message: "An error occurred during submission." });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#f5f5f5] pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Ticket className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-center mb-2 text-black">Product Verification & Raffle</h1>
                    <p className="text-center text-gray-500 mb-8">Enter the 8-character code from your physical purchase and upload a photo of the product to enter the monthly draw.</p>

                    {result ? (
                        <div className={`p-6 rounded-xl border ${result.success ? (result.status === 'Verified' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200') : 'bg-red-50 border-red-200'} text-center`}>
                            {result.success && result.status === 'Verified' && <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />}
                            {result.success && result.status === 'Flagged' && <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />}
                            {!result.success && <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />}
                            
                            <h3 className="text-xl font-bold mb-2">{result.success ? (result.status === 'Verified' ? 'Verified!' : 'Pending Review') : 'Error'}</h3>
                            <p className="text-gray-700">{result.message}</p>
                            
                            <Button 
                                onClick={() => setResult(null)} 
                                className="mt-6 bg-black text-white hover:bg-gray-800"
                            >
                                Submit Another Entry
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">8-Character Raffle Code</label>
                                <input 
                                    type="text" 
                                    maxLength={8}
                                    placeholder="e.g. A1B2C3D4"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-primary uppercase text-xl tracking-widest font-bold text-center" 
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Product Photo</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        accept="image/jpeg, image/png, image/heic"
                                        onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    {photo ? (
                                        <div className="flex items-center justify-center gap-3 text-primary font-bold">
                                            <CheckCircle className="w-6 h-6" />
                                            {photo.name}
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-600 font-medium">Click or drag photo to upload</p>
                                            <p className="text-sm text-gray-400 mt-1">Make sure Location Services (GPS) was enabled when taking the photo.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-primary/5 p-4 rounded-lg flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-600">
                                    We use the hidden GPS data (EXIF) in your original photo to verify the location of your purchase. <strong>Do not upload screenshots.</strong>
                                </p>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={isSubmitting || !code || !photo} 
                                className="w-full bg-primary text-black hover:bg-[#e6551b] h-14 text-lg font-bold rounded-xl"
                            >
                                {isSubmitting ? "Verifying..." : "Verify & Enter Raffle"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
