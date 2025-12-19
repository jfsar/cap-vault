import ProductForm from "@/components/admin/ProductForm";
import { getProductById } from "@/db/actions/product.action";
import { Product } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Update Product'
};

async function AdminUpdateProductPage({ params }: { params: Promise<{ id: string; }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if(!product) notFound();
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
          <h1 className="h2-bold">Update Product</h1>
          <ProductForm type="Update" product={product as Product} productId={id} />
    </div>
  )
}

export default AdminUpdateProductPage;