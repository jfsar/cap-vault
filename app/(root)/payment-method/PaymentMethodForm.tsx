'use client';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateUserPaymentMethod } from "@/db/actions/user.action";
import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from "@/lib/constants";
import { PaymentMethodType } from "@/types";
import { paymentMethodsScehma } from "@/types/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function PaymentMethodForm({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) {

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<PaymentMethodType>({
      resolver: zodResolver(paymentMethodsScehma),
      defaultValues: {
          type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
      }
  });
  
  const onSubmit = async (values: PaymentMethodType) => { 
    startTransition(async () => { 
      const result = await updateUserPaymentMethod(values);
      if (!result.success) {
        toast.error(null, {
            description: result.message,
            style: {
                backgroundColor: 'var(--destructive)',
            }
        });
        return;
      }

      router.push('/place-order');
    });
  }

  return (
    <>
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="h2-bold mt-4">Payment Method</h1>
        <p className="text-sm text-muted-foreground">Please select payment</p>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-5 w-full">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <RadioGroup 
                        onValueChange={field.onChange} 
                        value={field.value}
                        className="flex flex-col space-y-2"
                      >
                        {PAYMENT_METHODS.map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <RadioGroupItem value={item} id={item} />
                            <Label htmlFor={item}>{item}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}

export default PaymentMethodForm;
