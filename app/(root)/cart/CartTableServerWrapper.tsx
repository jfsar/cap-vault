import { delay } from "@/lib/utils";
import CartTable from "./CartTable";
import { getMyCart } from "@/db/actions/cart.action";


async function CartTableServerWrapper() {
  const cart = await getMyCart();
  await delay(3000);
  return (
    <>
      <CartTable cart={cart} />
    </>
  )
}

export default CartTableServerWrapper;
