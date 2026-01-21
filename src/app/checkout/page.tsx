import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout | Lead-Driven Ecommerce",
};

export default function CheckoutPage() {
    return (
        <div className="container mx-auto px-4 py-8 md:py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <CheckoutForm />
        </div>
    );
}
