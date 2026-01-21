import { CartSummary } from "@/components/cart/CartSummary";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shopping Cart | Lead-Driven Ecommerce",
};

export default function CartPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <CartSummary />
        </div>
    );
}
