import { ProductForm } from "@/components/admin/ProductForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditProductPageProps {
    params: {
        id: string;
    }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
    });

    if (!product) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
            <ProductForm product={product} />
        </div>
    );
}
