'use client';

import { Cart, CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AddItemToCart, removeItemFromCart } from "@/db/actions/cart.action";
import { useRouter } from "next/navigation"; 
import { Loader, Minus, Plus } from "lucide-react";
import { useTransition } from "react";

function AddToCart({ item, cart }: { item: CartItem, cart?: Cart }) {

  const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
  const handleAddToCart = async () => {
      
      startTransition(async () => { 
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
            action: {
                label: 'Go to cart',
                onClick: () => router.push('/cart'),
            }
        });
      });
  }
  
  const handleRemoveFromCart = async () => {
      startTransition(async () => { 
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
            action: {
                label: 'Go to cart',
                onClick: () => router.push('/cart'),
            }
        });
      });
  }
  
  // check if item is in the cart
  const existItem = cart?.items.find((c) => c.productId === item.productId);
  return existItem ? (
    <div>
        <Button type="button" variant='outline' onClick={handleRemoveFromCart}>
            {isPending ? (<Loader className="h-4 w-4"/>) : (<Minus className="h-4 w-4" />)}
        </Button>
        <span className="px-2">{ existItem.qty }</span>
        <Button type="button" variant="outline" onClick={handleAddToCart}>
            {isPending ? (<Loader className="h-4 w-4"/>) : (<Plus  className="w-4 h-4"/>)}
        </Button>
    </div>
  ) : (
    <Button
        className="w-full space-y-4"
        onClick={handleAddToCart}
    >
        {isPending ? (<Loader className="h-4 w-4"/>) : (<Plus  className="w-4 h-4"/>)}
        AddToCart
    </Button>
)
}

export default AddToCart;