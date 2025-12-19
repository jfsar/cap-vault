import { auth } from "@/auth";
import type { Metadata } from "next";
import PaymentMethodForm from "./PaymentMethodForm";
import { getUserById } from "@/db/actions/user.action";
import CheckOutSteps from "@/components/shared/CheckOutSteps";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Select Payment Method'
};

async function PaymentMethodPage() {
  const session = await auth();
  
  const userId = session?.user?.id;
  
  if(!userId) throw new Error('User not found.');
  
  const user = await getUserById(userId);
  
  if(!user) redirect('/sign-in');
  
  return (
      <>
          <CheckOutSteps current={2}/>
          <PaymentMethodForm preferredPaymentMethod={user.paymentMethod}/>
      </>
  )
}

export default PaymentMethodPage;