'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Cart } from "@/types";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { AddItemToCart, removeItemFromCart } from "@/db/actions/cart.action";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";


function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  
  return (
    <>
      { !cart || cart.items.length === 0 ? (
        <div className="wrapper mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
            <h1 className="h1-bold text-4xl">Shopping Cart</h1>
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild>
                <Link href="/">Continue Shopping</Link>
            </Button>
        </div>
      ) : (
        <>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        <div className="grid md:grid-cols-4 md:gap-5">
            <div className="overflow-x-auto md:col-span-3">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-center">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        { cart.items.map((item) => (
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
                                <TableCell className="flex-center gap-2">
                                    <Button
                                        disabled={isPending}
                                        variant="outline"
                                        type="button"
                                        className="cursor-pointer"
                                        onClick={() => startTransition(async () => { 
                                            const result = await removeItemFromCart(item.productId);
                                            if (!result.success) {
                                                toast.error(null, {
                                                    description: result.message,
                                                    style: {
                                                        backgroundColor: 'var(--destructive)',
                                                    }
                                                });
                                                return;
                                            }
                                      
                                            toast.success(null,{
                                                description: <h2 className="text-sm text-muted-foreground">{result.message}</h2>,
                                            });
                                        })}
                                    >
                                        { isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                                    </Button>
                                    <span>{item.qty}</span>
                                    <Button
                                        disabled={isPending}
                                        variant="outline"
                                        type="button"
                                        className="cursor-pointer"
                                        onClick={() => startTransition(async () => { 
                                            const result = await AddItemToCart(item);
                                            if (!result.success) {
                                                toast.error(null, {
                                                    description: result.message,
                                                    style: {
                                                        backgroundColor: 'var(--destructive)',
                                                    }
                                                });
                                                return;
                                            }
                                      
                                            toast.success(null,{
                                                description: <h2 className="text-sm text-muted-foreground">{result.message}</h2>,
                                            });
                                        })}
                                    >
                                        { isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right">{formatPrice(parseFloat(item.price))}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Card>
                <CardContent className="p-4 gap-4">
                    <div className="pb-3 text-xl">
                        Subtotal ({cart.items.reduce((a,c) => a + c.qty, 0)}) : &nbsp;
                        <span className="font-bold">{formatPrice(Number(cart.itemsPrice))}</span>
                    </div>
                    <Button 
                       disabled={isPending} 
                       className="w-full"
                       onClick={() => startTransition(() => router.push("/shipping-address"))}
                    >
                        {isPending ? (<Loader  className="w-4 h-4 animate-spin"/>) : (<ArrowRight className="w-4 h-4"/>)}
                        Proceed to Checkout
                    </Button>
                </CardContent>
            </Card>
        </div>
        </>
      )}
    </>
  )
}

export default CartTable