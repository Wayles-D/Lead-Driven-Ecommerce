import { prisma } from "@/lib/prisma";
import { ProductDetail } from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Lead-Driven Ecommerce`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
        <ProductDetail product={product} />
    </div>
  );
}
