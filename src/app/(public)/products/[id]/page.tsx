import { ProductDetail } from "@/components/product/ProductDetail";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getCachedProductById } from "@/lib/cache";

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getCachedProductById(params.id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = `${product.name} | OML Soles`;
  const description = product.description.slice(0, 160);
  const imageUrl = product.images[0] || "https://res.cloudinary.com/dmb5ggmvg/image/upload/v1765226721/Brown_and_Beige_Modern_Aesthetic_Fashion_Store_Design_Logo_2_ladbpd.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://omlsoles.ng/products/${product.id}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getCachedProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
        <ProductDetail product={product} />
    </div>
  );
}
