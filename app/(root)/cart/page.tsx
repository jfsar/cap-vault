import type { Metadata } from "next";
import CartTable from "./CartTable";
import { getMyCart } from "@/db/actions/cart.action";

export const metadata: Metadata = {
    title: 'Shopping Cart'
}

async function CartPage() {
  const cart = await getMyCart();
  return (
    <>
      <CartTable cart={cart} />
    </>
  )
}

export default CartPage;
