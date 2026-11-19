"use client";

import { useEffect } from "react";
import { useSpinWheel } from "@/providers/SpinWheelProvider";
import { SpinProduct } from "@/lib/spinWheel";

export function SpinCatalogSync({ products }: { products: SpinProduct[] }) {
    const { registerCatalogProducts } = useSpinWheel();

    useEffect(() => {
        if (products && products.length > 0) {
            registerCatalogProducts(products);
        }
    }, [products, registerCatalogProducts]);

    return null;
}

