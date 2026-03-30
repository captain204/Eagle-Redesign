import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Smartphone } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10">
            <div className="container mx-auto px-4">
                {/* Newsletter Section */}
                <div className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-12">
                    <div className="text-center md:text-left">
                        <h3 className="text-xl font-bold mb-2">Join 1st𝓔agle Family</h3>
                        <p className="text-gray-400 text-sm">Subscribe to our newsletter to get more offers.</p>
                    </div>
                    <div className="flex w-full md:w-auto max-w-md gap-2">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 bg-white/5 border border-white/10 px-4 py-3 rounded-sm focus:outline-none focus:border-primary text-sm"
                        />
                        <button className="bg-primary text-white font-bold px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors uppercase text-sm">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Column 1 - About */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-primary">ABOUT US</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/brand-story" className="hover:text-primary transition-colors">Brand Story</Link></li>
                            <li><Link href="/news" className="hover:text-primary transition-colors">News</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/where-to-buy" className="hover:text-primary transition-colors">Where to Buy</Link></li>
                        </ul>
                    </div>

                    {/* Column 2 - Support */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-primary">SUPPORT</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/warranty" className="hover:text-primary transition-colors">Warranty & Return</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Column 3 - Terms */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-primary">TERMS</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><Link href="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/security" className="hover:text-primary transition-colors">Security</Link></li>
                        </ul>
                    </div>
                    {/* Column 4 - Contact/Social */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-primary">GET IN TOUCH</h4>
                        <div className="flex gap-4 mb-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                        <div className="text-gray-400 text-sm">
                            <p className="flex items-center gap-2 mb-2"><Mail className="w-4 h-4 text-primary shrink-0" /> care@1st𝓔agle.com</p>
                            <p className="flex items-start gap-2 mb-4 leading-relaxed">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-1" />
                                <span>21 Obafemi Awolowo way, B67 asset corp plaza ikeja,<br />close to ikeja club</span>
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 mt-6">
                            <h4 className="font-bold text-white mb-2">DOWNLOAD APP</h4>
                            <div className="flex flex-col xl:flex-row gap-3">
                                <a href="https://apps.apple.com/ng/app/1st-eagle-store/id6755090747" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-primary transition-colors px-4 py-2 rounded-lg text-white flex-1">
                                    <Smartphone className="w-6 h-6 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] leading-none text-gray-300">Download on the</span>
                                        <span className="text-sm font-bold leading-none mt-1">App Store</span>
                                    </div>
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.eagle.dmi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-primary transition-colors px-4 py-2 rounded-lg text-white flex-1">
                                    <Smartphone className="w-6 h-6 shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] leading-none text-gray-300">GET IT ON</span>
                                        <span className="text-sm font-bold leading-none mt-1">Google Play</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} 1st𝓔agle Technology. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}
