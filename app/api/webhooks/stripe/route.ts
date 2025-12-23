import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { updateOrderToPaid } from '@/db/actions/order.action';

export async function POST(request: NextRequest) { 
    const event = Stripe.webhooks.constructEvent(
        await request.text(),
        request.headers.get("Stripe-Signature") as string,
        process.env.STRIPE_WEBHOOK_SECRET as string,
    );

    if (event.type === 'charge.succeeded') { 
        const { object } = event.data;

        // update order status
        await updateOrderToPaid({
            orderId: object.metadata.orderId,
            paymentResult: {
                id: object.id,
                status: 'COMPLETED',
                email_address: object.billing_details.email!,
                pricePaid: (object.amount /100).toFixed(),
            }
        });

        return NextResponse.json({
            message: 'Update order to paid was successful',
        });
    }

    return NextResponse.json({
        message: 'event is not charge.succeded',
    });
}