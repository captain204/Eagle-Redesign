import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Warranty() {
    return (
        <div className="bg-white py-12 md:py-20">
            <div className="container max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">Warranty Policy</h1>
                <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                    At 1stEagle, we stand behind the quality of our products. All our products come with a comprehensive warranty
                    to ensure your peace of mind.
                </p>

                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-center">365-Day Warranty Coverage</h2>
                    <p className="text-center text-gray-700">
                        Most 1stEagle electronic products (Power Banks, Earbuds, Watches) are covered by a 12-month limited warranty
                        starting from the date of purchase.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mb-12">
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500 w-6 h-6" /> What is Covered
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li>Manufacturing defects in materials or workmanship.</li>
                            <li>Battery failure not caused by misuse.</li>
                            <li>Connectivity issues (Bluetooth/Charging) present upon arrival.</li>
                            <li>Audio malfunction in earbuds/speakers.</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <AlertCircle className="text-red-500 w-6 h-6" /> What is NOT Covered
                        </h3>
                        <ul className="space-y-3 text-gray-600">
                            <li>Physical damage (cracks, dents, broken parts).</li>
                            <li>Water damage (unless the product is explicitly IPX rated and used within limits).</li>
                            <li>Damage from unauthorized repairs or modifications.</li>
                            <li>Normal wear and tear (e.g., scratches on casing).</li>
                            <li>Lost or stolen items.</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-12">
                    <h2 className="text-2xl font-bold mb-6">How to Claim Warranty</h2>
                    <div className="space-y-4 text-gray-700">
                        <p>
                            <strong>Step 1:</strong> Locate your proof of purchase (Receipt/Order ID).
                        </p>
                        <p>
                            <strong>Step 2:</strong> Contact our support team via email at <span className="font-bold text-primary">care@1steagle.com</span> or visit our service center.
                        </p>
                        <p>
                            <strong>Step 3:</strong> Our team will verify your claim and guide you through the return process.
                        </p>
                        <p>
                            <strong>Step 4:</strong> Once verified, we will repair or replace the defective unit free of charge.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
