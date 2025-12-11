"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prima-client";
import { convertToPlainObject, formatErrors } from "@/lib/utils";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "@/types/validator";
import { CartItem, PaymentResultType, ShippingAddress } from "@/types";
import { paypal } from "@/lib/paypal";
import { revalidatePath } from "next/cache";

// Create order and order items
export async function createOrder() { 
    try {
        const session = await auth();

        if (!session) throw new Error('User is not authenticated.');

        const cart = await getMyCart();

        const userId = session.user?.id;

        if (!userId) throw new Error('User not found.');

        const user = await getUserById(userId);

        if (!user) throw new Error('User not found.');

        if (!cart || cart.items.length === 0) { 
            return {success: false, message: 'Your cart is empty', redirectTo: '/cart'};
        }

        if (!user.address) { 
            return {success: false, message: 'No shipping address', redirectTo: '/shipping-address'};
        }

        if (!user.paymentMethod) { 
            return {success: false, message: 'No payment method.', redirectTo: '/payment-method'};
        }


        // create order object
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            taxPrice: cart.taxPrice,
            shippingPrice: cart.shippingPrice,
            totalPrice: cart.totalPrice,
        });

        // create a transaction to create order and order items in database
        //@ts-ignore
        const newOrderId = await prisma.$transaction(async (tx) => { 
            // create order
            const insertedOrder = await tx.order.create({ data: order });

            // create order item from cart items
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    },
                });
            }

            // clear or update items in cart
            await tx.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0
                }
            });

            return insertedOrder.id;

        });

        if (!newOrderId) throw new Error('Order not created.');
        
        return {
            success: true,
            message: 'Order created.',
            redirectTo: `/order/${newOrderId}`
        };
    } catch (error) {
        return formatErrors(error);
    }
}


export async function getOrderById(orderId: string) { 
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
            user: { select: { name: true, email: true } },
        }
    });

    if (!order) throw new Error('Order not found.');
    
    return convertToPlainObject({
        ...order,
        orderItems: order.orderItems.map((item) => { 
            return {
                ...item,
                price: item.price.toString()
            }
        }),
        shippingAddress: order.shippingAddress as ShippingAddress,
        itemsPrice: order.itemsPrice.toString(),
        totalPrice: order.totalPrice.toString(),
        shippingPrice: order.shippingPrice.toString(),
        taxPrice: order.taxPrice.toString(),
    });
}

export async function createPaypalOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            }
        });

        if (!order) throw new Error('Order not found.');

        const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

        // update order with paypal order id
        await prisma.order.update({
            where: {
                id: orderId
            },
            data: {
                paymentResult: {
                    id: paypalOrder.id,
                    email_address: '',
                    status: '',
                    pricePaid: 0,
                },
            }
        });

        return {
            success: true,
            message: 'Item order created successfully',
            data: paypalOrder.id
        };

    } catch (error) {
        console.log(error);
        return formatErrors(error);
    }
}
 
// Approve paypal order and update order to paid
export async function approvePayPalOrder(
    orderId: string,
    data: { orderID: string }
  ) {
    try {
      // Get order from database
      const order = await prisma.order.findFirst({
        where: {
          id: orderId,
        },
      });
  
      if (!order) throw new Error('Order not found');
  
      const captureData = await paypal.capturePayment(data.orderID);
  
      if (
        !captureData ||
        captureData.id !== (order.paymentResult as PaymentResultType)?.id ||
        captureData.status !== 'COMPLETED'
      ) {
        throw new Error('Error in PayPal payment');
      }
  
      // Update order to paid
      await updateOrderToPaid({
        orderId,
        paymentResult: {
          id: captureData.id,
          status: captureData.status,
          email_address: captureData.payer.email_address,
          pricePaid:
            captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
        },
      });
  
      revalidatePath(`/order/${orderId}`);
  
      return {
        success: true,
        message: 'Your order has been paid',
      };
    } catch (error) {
      console.log(error);
      return formatErrors(error);
    }
}
  

// Update order to paid
export async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResultType;
}) {
  // Get order from database
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });

  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order is already paid');

  // Transaction to update order and account for product stock
  // @ts-ignore
  await prisma.$transaction(async (tx) => {
    // Iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      });
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // Get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');

//   sendPurchaseReceipt({
//     order: {
//       ...updatedOrder,
//       shippingAddress: updatedOrder.shippingAddress as ShippingAddress,
//       paymentResult: updatedOrder.paymentResult as PaymentResultType,
//     },
//   });
}