import { auth } from "@/auth";
import CheckOutSteps from "@/components/shared/CheckOutSteps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getMyCart } from "@/db/actions/cart.action";
import { getUserById } from "@/db/actions/user.action";
import { formatPrice } from "@/lib/utils";
import { ShippingAddress } from "@/types";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import PlaceOrderForm from "./PlaceOrderForm";

export const metadata: Metadata = {
    title: 'Place Order'
}

async function PlaceOrderPage() {
  const cart = await getMyCart();
  const session = await auth();
  const userId = session?.user?.id;
  
  if(!userId) throw new Error('user not found.');
  const user = await getUserById(userId);
  if (!userId) redirect('/sign-in');
  
  if(!cart || cart.items.length === 0) redirect('/cart');
  if(!user.address) redirect('/shipping-address');
  if(!user.paymentMethod) redirect('/payment-method');
  
  const userAddress = user.address as ShippingAddress;
  
  return (
      <>
          <CheckOutSteps current={3} />
           <h1 className="py-4 text-2xl">Place Order</h1>
          <div className="grid md:grid-cols-3 md:gap-5">
              <div className="md:col-span-2 overflow-x-auto space-y-4">
                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="text-xl pb-4">Shipping Address</h2>
                          <p>{userAddress.fullName}</p>
                          <p>{userAddress.streetAddress}, {userAddress.city} &nbsp; {userAddress.postalCode}, {userAddress.country}</p>
                          <div className="mt-3">
                              <Link href="/shipping-address">
                                  <Button className="cursor-pointer" variant="outline">Edit</Button>
                              </Link>
                          </div>
                      </CardContent>
                  </Card>

                  <Card>
                      <CardContent className="p-4 gap-4">
                          <h2 className="text-xl pb-4">Payment Method</h2>
                          <p>{user.paymentMethod}</p>
                          <div className="mt-3">
                              <Link href="/payment-method">
                                  <Button className="cursor-pointer" variant="outline">Edit</Button>
                              </Link>
                          </div>
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
                                  {cart.items.map((item) => (
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
                              <div>{ formatPrice(Number(cart.itemsPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Tax</div>
                              <div>{ formatPrice(Number(cart.taxPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Shipping</div>
                              <div>{ formatPrice(Number(cart.shippingPrice))} </div>
                          </div>
                          <div className="flex justify-between">
                              <div>Total</div>
                              <div>{ formatPrice(Number(cart.totalPrice))} </div>
                          </div>
                          <PlaceOrderForm />
                      </CardContent>
                  </Card>
              </div>
          </div>
      </>
  )
}

export default PlaceOrderPage;