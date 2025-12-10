import { getOrderById } from "@/db/actions/order.action";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";

export const metadata: Metadata = {
    title: 'Order Details'
};


async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string; }> }) {
    
 const { orderId } = await params;
 
 const order = await getOrderById(orderId);
 
 if(!order) notFound();
 
 
  return (
    <>
        <OrderDetailsTable order={order}/>
    </>
  )
}

export default OrderDetailsPage;
