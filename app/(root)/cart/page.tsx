import type { Metadata } from "next";
import { Suspense } from "react";
import CartTableServerWrapper from "./CartTableServerWrapper";
import CartTableSkeleton from "@/components/skeleton/CartTableSkeleton";

export const metadata: Metadata = {
    title: 'Shopping Cart'
}

async function CartPage() {
  return (
    <>
      <Suspense fallback={<CartTableSkeleton />}>
         <CartTableServerWrapper  />
      </Suspense>
    </>
  )
}

export default CartPage;
