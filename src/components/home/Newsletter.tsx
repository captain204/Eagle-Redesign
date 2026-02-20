import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function Newsletter() {
    return (
        <section className="py-20 bg-primary/5">
            <div className="container">
                <div className="bg-primary rounded-3xl p-8 md:p-16 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-lg">
                        <h2 className="text-3xl font-bold mb-4">Stay Updated with 1st Eagle</h2>
                        <p className="text-primary-foreground/90">
                            Subscribe to our newsletter to receive exclusive offers, new product announcements, and tech tips directly to your inbox.
                        </p>
                    </div>

                    <div className="relative z-10 w-full max-w-md">
                        <div className="flex gap-2 p-1 bg-white rounded-full shadow-lg">
                            <div className="relative flex-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full h-12 pl-10 pr-4 rounded-full border-none focus:ring-0 text-black placeholder:text-muted-foreground"
                                />
                            </div>
                            <Button size="lg" className="rounded-full bg-black hover:bg-black/80 text-white px-8">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
