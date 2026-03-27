import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function BrandStory() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative h-[400px] flex items-center justify-center bg-black text-white overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/1steagle/store_interior.jpg"
                        alt="1st𝓔agle Store"
                        fill
                        className="object-cover opacity-40"
                    />
                </div>
                <div className="relative z-10 text-center container px-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">Our Story</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Empowering your lifestyle with premium power and smart technology.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <div className="container py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-black">Who We Are</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            1st𝓔agle Technology is a premier provider of innovative smart accessories and reliable power solutions in Nigeria.
                            Born from a passion for technology and a commitment to quality, we have established ourselves as a trusted brand
                            for individuals and businesses looking for durability and performance.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Our mission is simple: to keep you connected and powered up, no matter where life takes you. From our
                            high-capacity power banks to our crystal-clear audio devices, every 1st𝓔agle product is designed with
                            the user in mind.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-primary w-5 h-5" />
                                <span className="font-medium">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-primary w-5 h-5" />
                                <span className="font-medium">12-Month Warranty</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-primary w-5 h-5" />
                                <span className="font-medium">24/7 Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="text-primary w-5 h-5" />
                                <span className="font-medium">Nationwide Delivery</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[400px] bg-gray-100 rounded-2xl overflow-hidden shadow-2xl">
                        <Image
                            src="/images/1steagle/powerbank_orange.jpg"
                            alt="1st𝓔agle Products"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-primary/5 py-20">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Experience 1st𝓔agle?</h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Join thousands of satisfied customers who trust 1st𝓔agle for their daily tech needs.
                    </p>
                    <Button asChild className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg rounded-full font-bold">
                        <Link href="/products">Shop Now <ArrowRight className="ml-2 w-5 h-5" /></Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
