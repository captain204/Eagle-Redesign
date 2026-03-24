import { PackageSearch } from "lucide-react";

export const metadata = {
    title: "Track Order | 1stEagle Technology",
    description: "Track the status of your 1stEagle shipment.",
};

export default function TrackOrderPage() {
    return (
        <div className="min-h-[60vh] bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-2xl bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PackageSearch className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Track Your Order</h1>
                <p className="text-gray-500 mb-8">
                    Enter your Order ID and Billing Email address below to track your delivery status.
                </p>

                <form className="space-y-6 text-left">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Order ID</label>
                        <input
                            type="text"
                            placeholder="Found in your confirmation email"
                            className="w-full p-4 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Billing Email</label>
                        <input
                            type="email"
                            placeholder="Email address used during checkout"
                            className="w-full p-4 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                        />
                    </div>

                    <button
                        type="button"
                        className="w-full bg-black text-white font-bold text-lg py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Track Shipment
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-4">
                        Please allow up to 24 hours for tracking information to appear in the system after placing an order.
                    </p>
                </form>
            </div>
        </div>
    );
}
