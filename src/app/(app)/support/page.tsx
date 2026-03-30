import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Headphones, Truck } from "lucide-react";
import { RichText } from "@/components/ui/RichText";

export default async function SupportPage() {
    const payload = await getPayload({ config: configPromise });

    let supportInfo: any = {};
    try {
        supportInfo = await payload.findGlobal({
            slug: 'support-info',
            depth: 1,
        });
    } catch (e) {
        console.error("Failed to fetch support info", e);
    }

    const phoneNumbers = supportInfo.phoneNumbers?.map((p: any) => p.number) || ["+234 703 120 0507", "+234 7067653476"];
    const email = supportInfo.email || "care@1st𝓔agle.com";
    const address = supportInfo.address || "21 Obafemi Awolowo way, B67 asset corp plaza ikeja, close to ikeja club";
    const hours = supportInfo.workingHours || "Mon - Fri: 9am - 6pm";

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">How Can We Help?</h1>
                    <div className="prose max-w-none text-gray-600 mb-8">
                        {supportInfo.supportDescription ? (
                            <RichText content={supportInfo.supportDescription} />
                        ) : (
                            <p className="text-xl">
                                At 1st𝓔agle, we are committed to providing you with the best experience.
                                Reach out to us through any of our channels.
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Phone className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Call Us</h3>
                        {phoneNumbers.map((num: string, i: number) => (
                            <p key={i} className="text-gray-600 font-medium mb-1">{num}</p>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Email Us</h3>
                        <p className="text-gray-600 font-medium">{email}</p>
                        <p className="text-gray-400 text-sm mt-2">We'll respond within 24 hours</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Clock className="text-primary w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Working Hours</h3>
                        <p className="text-gray-600 font-medium">{hours}</p>
                        <p className="text-gray-400 text-sm mt-2">Excluding Public Holidays</p>
                    </div>
                </div>

                <div className="bg-black rounded-[2.5rem] p-8 md:p-16 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Quick Self-Service</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Track Your Order</h4>
                                        <p className="text-gray-400 text-sm">Real-time updates on your delivery status.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Warranty Policy</h4>
                                        <p className="text-gray-400 text-sm">Learn more about our premium warranty coverage.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                                        <Headphones className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold">Live Chat</h4>
                                        <p className="text-gray-400 text-sm">Chat with our support expert instantly.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                            <MapPin className="w-12 h-12 text-primary mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Our Store</h3>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {address}
                            </p>
                            <button className="bg-primary text-black font-bold px-8 py-3 rounded-full hover:bg-white transition-colors">
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
