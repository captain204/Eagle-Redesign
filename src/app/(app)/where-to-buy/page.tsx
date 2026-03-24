import { MapPin, Search } from "lucide-react";

export const metadata = {
    title: "Where to Buy | 1stEagle Technology",
    description: "Find an authorized 1stEagle retailer near you.",
};

export default function WhereToBuyPage() {
    return (
        <div className="min-h-[60vh] bg-[#f5f5f5] pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                <MapPin className="w-16 h-16 text-primary mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Store Locator</h1>
                <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                    1stEagle products are available nationwide through our authorized
                    distributors and flagship stores. Enter your location to find a store near you.
                    (Demo content only)
                </p>
                <div className="flex max-w-md mx-auto relative mb-12">
                    <input
                        type="text"
                        placeholder="Enter City or State..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition-colors">
                        Find
                    </button>
                </div>

                <div className="text-left border rounded-lg p-6 bg-gray-50 mb-4">
                    <h3 className="font-bold text-lg mb-2">1stEagle Flagship Store</h3>
                    <p className="text-gray-600 mb-2">123 Ikeja GRA, Lagos State, Nigeria.</p>
                    <p className="text-primary font-semibold">Open: Mon-Sat, 9AM - 6PM</p>
                </div>
            </div>
        </div>
    );
}
