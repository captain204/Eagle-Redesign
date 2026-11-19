"use client";

import { usePaystackPayment } from "react-paystack";
import { Button } from "@/components/ui/button";

interface PaystackPayButtonProps {
    config: any;
    onValidate: () => boolean;
    onStartPayment: () => void;
    onSuccess: (reference: any) => void;
    onClose: () => void;
    disabled: boolean;
    isLoading: boolean;
    totalAmount: number;
}

export default function PaystackPayButton({
    config,
    onValidate,
    onStartPayment,
    onSuccess,
    onClose,
    disabled,
    isLoading,
    totalAmount,
}: PaystackPayButtonProps) {
    const initializePayment = usePaystackPayment(config);

    const handleClick = () => {
        if (!onValidate()) return;
        onStartPayment();
        initializePayment({ onSuccess, onClose });
    };

    return (
        <Button
            onClick={handleClick}
            disabled={disabled}
            className="w-full mt-6 bg-green-600 text-white py-6 text-lg font-bold hover:bg-green-700 shadow-lg animate-bounce"
        >
            {isLoading ? "Opening Payment Window..." : `Pay Now ₦${totalAmount.toLocaleString()}`}
        </Button>
    );
}

