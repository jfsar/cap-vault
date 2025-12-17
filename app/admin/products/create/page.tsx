import ProductForm from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create Product',
};

function CreateProductPage() {
  return (
      <>
          <h2 className="h2-bold">Create Product</h2>
          <div className="my-8">
              <ProductForm type="Create" />
          </div>
      </>
  )
}

export default CreateProductPage;