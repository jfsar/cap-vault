"use client";

import { Button } from "@/components/ui/button";
import { createOrder } from "@/db/actions/order.action";
import { Check, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

function PlaceOrderButton() {
    const { pending } = useFormStatus();
    return <Button disabled={pending} className="w-full cursor-pointer">
        { pending ? (<Loader className="w-4 h-4 animate-spin" />) : (<Check className="w-4 h-4" />)}
        &nbsp; Place Order
    </Button>
 }

function PlaceOrderForm() {

  const router = useRouter();
  
  const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const result = await createOrder();

        if (result.redirectTo) {
            router.push(result.redirectTo);
        }
  }
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
        <PlaceOrderButton />
    </form>
  )
}

export default PlaceOrderForm;