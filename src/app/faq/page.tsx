"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQ() {
    const faqs = [
        {
            question: "How do I track my order?",
            answer: "Once your order is dispatched, you will receive an email/SMS with a tracking number and a link to track your package on our courier's website."
        },
        {
            question: "Do you offer payment on delivery?",
            answer: "Currently, we offer minimal Pay on Delivery options within Lagos. For other states, we require secure online payment before dispatch to ensure order commitment."
        },
        {
            question: "How long is the warranty?",
            answer: "We offer a 12-month warranty on most of our electronic products. Please check the specific product page for warranty details."
        },
        {
            question: "Can I cancel my order?",
            answer: "Yes, you can cancel your order before it has been dispatched. Please contact our support team immediately if you wish to cancel."
        },
        {
            question: "What if I receive a damaged product?",
            answer: "We apologize for the inconvenience. Please take a photo of the damaged product and contact us within 24 hours of delivery. We will arrange a replacement."
        },
        {
            question: "Do you have a physical store?",
            answer: "Yes, we have a flagship store in Ikeja, Lagos. You can find the address on our Contact Us page."
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="container max-w-3xl py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-center">Frequently Asked Questions</h1>
            <p className="text-gray-500 text-center mb-12">
                Find answers to common questions about our products, shipping, and services.
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full flex items-center justify-between p-4 text-left font-medium text-lg bg-white hover:bg-gray-50 transition-colors"
                        >
                            {faq.question}
                            {openIndex === index ? (
                                <Minus className="w-5 h-5 text-primary" />
                            ) : (
                                <Plus className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                            )}
                        >
                            <div className="p-4 text-gray-600 bg-gray-50 border-t border-gray-100">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
