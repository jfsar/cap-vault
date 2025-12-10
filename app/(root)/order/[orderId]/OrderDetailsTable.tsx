"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime, formatId, formatPrice } from "@/lib/utils";
import { OrderType } from "@/types";
import Image from "next/image";
import Link from "next/link";

function OrderDetailsTable({ order }: { order: OrderType }) {
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
                                              <Link href={`/product/${item.image}`} className="flex items-center">
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
                      </CardContent>
                  </Card>
              </div>
          </div>
      </>
  )
}

export default OrderDetailsTable; 