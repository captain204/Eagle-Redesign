
export default function PrivacyPolicy() {
    return (
        <div className="container max-w-4xl py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center pb-8 border-b">Privacy Policy</h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-black mb-3">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, make a purchase,
                        sign up for our newsletter, or contact us for support. This may include your name, email address, phone number,
                        shipping address, and payment information.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black mb-3">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Process and fulfill your orders.</li>
                        <li>Send you order confirmations and shipping updates.</li>
                        <li>Respond to your comments and questions.</li>
                        <li>Send you marketing communications (if you opted in).</li>
                        <li>Improve our website and product offerings.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black mb-3">3. Information Sharing</h2>
                    <p>
                        We do not sell or rent your personal information to third parties. We may share your information with trusted
                        service providers who assist us in operating our website, conducting our business, or servicing you (e.g., payment processors, delivery logistics),
                        so long as those parties agree to keep this information confidential.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black mb-3">4. Cookies</h2>
                    <p>
                        We use cookies to enhance your experience on our website. Cookies help us remember your cart items, understand
                        how you interact with our site, and improve our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-black mb-3">5. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information. However, no method of transmission
                        over the Internet is 100% secure.
                    </p>
                </section>

                <div className="pt-8 text-sm text-gray-500 border-t mt-12">
                    Last updated: February 2026
                </div>
            </div>
        </div>
    );
}
