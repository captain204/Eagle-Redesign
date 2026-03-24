import { Truck, MapPin, Clock } from "lucide-react";

export default function Shipping() {
    return (
        <div className="container max-w-4xl py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-12 text-center">Shipping Policy</h1>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Truck className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Nationwide Delivery</h3>
                    <p className="text-sm text-gray-500">We deliver to all states across Nigeria.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                        <Clock className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Fast Dispatch</h3>
                    <p className="text-sm text-gray-500">Orders placed before 2PM are dispatched same day.</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                        <MapPin className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-bold mb-2">Tracking</h3>
                    <p className="text-sm text-gray-500">Real-time tracking for all packages.</p>
                </div>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-bold mb-4">Delivery Timelines</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-4 border">Location</th>
                                    <th className="p-4 border">Estimated Time</th>
                                    <th className="p-4 border">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-4 border">Lagos (Mainland)</td>
                                    <td className="p-4 border">1 - 2 Business Days</td>
                                    <td className="p-4 border">₦1,500</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Lagos (Island)</td>
                                    <td className="p-4 border">1 - 2 Business Days</td>
                                    <td className="p-4 border">₦2,000</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">South West (Ogun, Oyo, etc.)</td>
                                    <td className="p-4 border">2 - 4 Business Days</td>
                                    <td className="p-4 border">₦3,500</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Abuja & Port Harcourt</td>
                                    <td className="p-4 border">3 - 5 Business Days</td>
                                    <td className="p-4 border">₦4,500</td>
                                </tr>
                                <tr>
                                    <td className="p-4 border">Other States</td>
                                    <td className="p-4 border">4 - 7 Business Days</td>
                                    <td className="p-4 border">₦5,000+</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Delivery Policy</h2>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Delivery times are estimates and start from the date of dispatch.</li>
                        <li>We are not responsible for delays caused by unforeseen circumstances (e.g., weather, strikes).</li>
                        <li>Please ensure your delivery address and phone number are correct to avoid failed delivery attempts.</li>
                        <li>If you miss a delivery, our courier capability will attempt to contact you to reschedule.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
