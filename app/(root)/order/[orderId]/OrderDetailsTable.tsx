"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatId, formatPrice } from "@/lib/utils";
import { OrderType } from "@/types";
import Image from "next/image";
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { createPaypalOrder, approvePayPalOrder, updateOrderToPaidCOD, deliverOrder } from '@/db/actions/order.action';
import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./StripePayment";

function OrderDetailsTable({
    order,
    paypalClientId,
    isAdmin,
    stripeClientSecret
}: {
    order: OrderType, 
    paypalClientId: string; 
    isAdmin?: boolean; 
    stripeClientSecret: string | null;
}) {
  const { 
      orderItems,
      shippingAddress,
      taxPrice,
      shippingPrice,
      totalPrice,
      itemsPrice,
      paymentMethod,
      isPaid,
      isDelivered,
      paidAt,
      deliveredAt
  } = order;
  
  const PrintLoadingState = () => {
      const [{ isPending, isRejected }] = usePayPalScriptReducer();
      let status = "";
      if (isPending) {
          status = "Loading PayPal...";
      } else if (isRejected) { 
          status = "Error Loading PayPal";
      }

      return status;
  }
  
 const handleCreatePayPalOrder = async () => { 
    
     const result = await createPaypalOrder(order.id);

     if (!result.success) {
        toast.error(null, {
            description: result.message,
            style: {
                backgroundColor: 'var(--destructive)',
            }
        });
        return;
     }
     
     return result.data;
 }
 
const handleApprovePayPalOrder = async (data: { orderID: string; }) => {
    const result = await approvePayPalOrder(order.id, data);

    toast(null, {
        description: result.message,
        style: {
            backgroundColor: !result.success ? 'var(--destructive)': '',
        }
    });
} 

const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    
    return (
        <Button
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={() => startTransition(async () => { 

                const result = await updateOrderToPaidCOD(order.id);
                toast(null, {
                    description: result.message,
                    style: {
                        backgroundColor: !result.success ? 'var(--destructive)': '',
                    }
                });
            })}
        >
            { isPending ? 'Processing...' : 'Mark as Paid'}
        </Button>
    );
}


const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    
    return (
        <Button
            type="button"
            className="w-full"
            disabled={isPending}
            onClick={() => startTransition(async () => { 

                const result = await deliverOrder(order.id);
                toast(null, {
                    description: result.message,
                    style: {
                        backgroundColor: !result.success ? 'var(--destructive)': '',
                    }
                });
            })}
        >
          { isPending ? 'Processing...' : 'Mark as Delivered'}
        </Button>
    );
}

    

  
  return (
      <>
          <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
          <div className="grid md:grid-cols-3 md:gap-5">
              <div className="col-span-2 space-y-4 overflow-x-auto">
                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="text-xl pb-4">Payment Method</h2>
                          <p>{paymentMethod}</p>
                          { isPaid ? (
                              <Badge variant="secondary">
                                  Paid at { formatDateTime(paidAt!).dateTime }
                            </Badge>
                          ) : (
                              <Badge variant="destructive">Not Paid</Badge>
                          )}
                      </CardContent>
                  </Card>
                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="text-xl pb-4">Shipping Address</h2>
                          <p>{shippingAddress.fullName}</p>
                          <p>
                              {shippingAddress.streetAddress}, {shippingAddress.city} &nbsp;
                              {shippingAddress.postalCode}, { shippingAddress.country}
                          </p>
                          { isDelivered ? (
                              <Badge variant="secondary">
                                  Delivered at { formatDateTime(deliveredAt!).dateTime }
                            </Badge>
                          ) : (
                              <Badge variant="destructive">Not Delivered</Badge>
                          )}
                      </CardContent>
                  </Card>
                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="text-xl pb-4">Order Items</h2>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead className="text-right">Price</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {orderItems.map((item) => (
                                      <TableRow key={item.slug}>
                                          <TableCell>
                                              <Link href={`/product/${item.slug}`} className="flex items-center">
                                                  <Image
                                                      src={item.image}
                                                      alt={item.name}
                                                      width={50}
                                                      height={50}
                                                  />
                                                  <span className="px-2">{item.name}</span>
                                              </Link>
                                          </TableCell>
                                          <TableCell>
                                              <span className="px-2">{item.qty}</span>
                                          </TableCell>
                                          <TableCell className="text-right">
                                              { formatPrice(Number(item.price))}
                                          </TableCell>
                                      </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </CardContent>
                  </Card>
              </div>

              <div>
                  <Card>
                      <CardContent className="p-4 gap-4 space-y-4">
                          <div className="flex justify-between">
                              <div>Items</div>
                              <div>{ formatPrice(Number(itemsPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Tax</div>
                              <div>{ formatPrice(Number(taxPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Shipping</div>
                              <div>{ formatPrice(Number(shippingPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Total</div>
                              <div>{ formatPrice(Number(totalPrice))} </div>
                          </div>
                          {/* PayPal Payments */}
                          {!isPaid && paymentMethod === "PayPal" && (
                              <div>
                                  <PayPalScriptProvider options={{ clientId: paypalClientId, currency: 'PHP' }}>
                                      <PrintLoadingState />
                                      <PayPalButtons createOrder={handleCreatePayPalOrder} onApprove={handleApprovePayPalOrder} />
                                  </PayPalScriptProvider>
                              </div>
                          )}

                          {/* Stripe Payments */}
                          {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
                              <StripePayment
                                  priceInCents={Number(totalPrice) * 100}
                                  orderId={order.id}
                                  clientSecret={stripeClientSecret}
                              />
                          )}

                          {/* cash on delivery */}
                          {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                              <MarkAsPaidButton />
                          )}

                          {isAdmin && isPaid && !isDelivered && (
                              <MarkAsDeliveredButton />
                          )}
                      </CardContent>
                  </Card>
              </div>
          </div>
      </>
  )
}

export default OrderDetailsTable; 