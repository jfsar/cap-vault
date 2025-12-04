import { auth } from "@/auth";
import { getMyCart } from "@/db/actions/cart.action";
import { getUserById } from "@/db/actions/user.action";
import type { Metadata } from "next"
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Shipping Address'
}

async function ShippingAddressPage() {
  const cart = await getMyCart();
  
  if(! cart || cart.items.length === 0) redirect("/cart");
  
  const session = await auth();
  
  const userId = session?.user?.id;
  
  if(!userId) throw new Error("No user found.");
  
  const user = await getUserById(userId);
  
  return (
    <>
       Address
    </>
  )
}

export default ShippingAddressPage;
