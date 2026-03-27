import { ShieldCheck } from "lucide-react";

export const metadata = {
    title: "Security Policy | 1st𝓔agle Technology",
    description: "Learn how we protect your data at 1st𝓔agle.",
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex items-center gap-4 mb-8 border-b pb-6">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                    <div>
                        <h1 className="text-3xl font-bold">Security Policy</h1>
                        <p className="text-gray-500">Last Updated: March 2026</p>
                    </div>
                </div>

                <div className="space-y-8 text-gray-700 leading-relaxed font-outfit">
                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">1. Data Protection & Encryption</h2>
                        <p>
                            At 1st𝓔agle Technology, we prioritize the security of your personal data and financial information. All traffic to and from our servers is encrypted using industry-standard SSL/TLS connections (AES-256). We ensure that your browsing experience is completely private and secure against interception.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">2. Payment Security</h2>
                        <p>
                            We do not store your full credit card information or payment details on our servers. All transactions are securely processed through our PCI-DSS compliant payment gateways, such as Paystack. They utilize 3D Secure protocols to authenticate your identity during online purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">3. Account Safety</h2>
                        <p>
                            We strongly advise users to employ unique and complex passwords. In the event of unauthorized access, 1st𝓔agle retains the right to temporarily freeze account privileges and will promptly notify the impacted user to reset their credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-black mb-4">4. Vulnerability Reporting</h2>
                        <p>
                            If you believe you have discovered a security vulnerability in our platform, please do not disclose it publicly. Connect with our security team immediately at <strong>security@1steagle.com</strong>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
