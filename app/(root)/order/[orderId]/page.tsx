import { getOrderById } from "@/db/actions/order.action";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import OrderDetailsTable from "./OrderDetailsTable";
import { auth } from "@/auth";
import Stripe from 'stripe';

export const metadata: Metadata = {
    title: 'Order Details'
};


async function OrderDetailsPage({ params }: { params: Promise<{ orderId: string; }> }) {
    
 const { orderId } = await params;
 
 const order = await getOrderById(orderId);
 
 if(!order) notFound();
 
 const session = await auth();
 
 let client_secret = null;
 
 // check if it is not paid and using stripe
 if(order.paymentMethod === "Stripe" && !order.isPaid) {
   // init stripe
   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
   const paymentIntent = await stripe.paymentIntents.create({
     amount: Math.round(Number(order.totalPrice) * 100),
     currency: 'PHP',
     metadata: { orderId: orderId }
   });
   client_secret = paymentIntent.client_secret;
 }
 
  return (
    <>
      <OrderDetailsTable
        order={order}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user.role === 'admin' || false}
      />
    </>
  )
}

export default OrderDetailsPage;
