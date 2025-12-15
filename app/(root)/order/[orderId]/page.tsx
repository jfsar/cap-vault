import { getOrderById } from "@/db/actions/order.action";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: 'Order Details'
};


async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string; }> }) {
    
 const { orderId } = await params;
 
 const order = await getOrderById(orderId);
 
 if(!order) notFound();
 
 const session = await auth();
 
  return (
    <>
      <OrderDetailsTable
        order={order}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user.role === 'admin' || false}
      />
    </>
  )
}

export default OrderDetailsPage;
