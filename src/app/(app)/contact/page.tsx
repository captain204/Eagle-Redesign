"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function ContactForm() {
    const searchParams = useSearchParams();
    const source = searchParams.get("source");
    const isCorporate = source === "corporate";

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        subject: isCorporate ? "Corporate Procurement Inquiry" : "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, source: source || "general" }),
            });

            if (!response.ok) throw new Error("Failed to submit");

            setIsSubmitted(true);
            toast.success("Message sent successfully!");
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-xl border border-primary/10 text-center flex flex-col items-center justify-center min-h-[500px]"
            >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-black mb-4">Message Sent!</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Thank you for reaching out. Our team will review your message and get back to you shortly.
                </p>
                <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="rounded-full px-8"
                >
                    Send Another Message
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-gray-100 relative overflow-hidden">
            {isCorporate && (
                <div className="absolute top-0 right-0 bg-primary text-black font-black px-6 py-2 rounded-bl-2xl flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Building2 className="w-4 h-4" /> B2B / Corporate
                </div>
            )}

            <h2 className="text-3xl font-black mb-8 text-gray-900">
                {isCorporate ? "Request Corporate Quote" : "Send us a Message"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                        <Input
                            required
                            placeholder="John"
                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                        <Input
                            required
                            placeholder="Doe"
                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                        <Input
                            required
                            type="email"
                            placeholder="john@company.com"
                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                        <Input
                            placeholder="+234..."
                            className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Company / Organization</label>
                    <Input
                        placeholder={isCorporate ? "Your Company Name (Required)" : "Optional"}
                        required={isCorporate}
                        className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                    <Input
                        required
                        placeholder="What is this about?"
                        className="rounded-xl h-12 border-gray-200 focus:border-primary focus:ring-primary/20"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Your Message</label>
                    <Textarea
                        required
                        placeholder="Tell us more about your needs..."
                        className="rounded-xl min-h-[150px] border-gray-200 focus:border-primary focus:ring-primary/20 resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-black hover:bg-black hover:text-white transition-all font-black py-7 rounded-2xl text-lg shadow-lg shadow-primary/20 group"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <div className="flex items-center gap-2">
                            <span>Send Inquiry</span>
                            <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </div>
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function Contact() {
    return (
        <div className="bg-[#fcfcfc] min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

                        {/* Info Sidebar */}
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <h1 className="text-5xl font-black mb-6 text-gray-900 tracking-tight">Let's Talk.</h1>
                                <p className="text-gray-500 text-lg leading-relaxed">
                                    Have a big idea or just a small question? We're here to help you get the best tech experience.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">Our Studio</h4>
                                        <p className="text-gray-900 font-bold">123 Tech Plaza, Ikeja, Lagos</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">Call Anytime</h4>
                                        <p className="text-gray-900 font-bold">+234 703 120 0507</p>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-center group">
                                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-black transition-all duration-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-1">Email Us</h4>
                                        <p className="text-gray-900 font-bold">care@1stEagle.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-100">
                                <h3 className="font-black text-xl mb-4">Why choose 1stEagle?</h3>
                                <ul className="space-y-3">
                                    {["Premium Quality Products", "24/7 Dedicated Support", "Fast Island-wide Delivery", "Corporate B2B Solutions"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-gray-600 font-medium text-sm">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-3">
                            <Suspense fallback={<div className="h-[600px] bg-white rounded-[2.5rem] animate-pulse" />}>
                                <ContactForm />
                            </Suspense>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
