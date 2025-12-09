"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prima-client";
import { convertToPlainObject, formatErrors } from "@/lib/utils";
import { getMyCart } from "./cart.action";
import { getUserById } from "./user.action";
import { insertOrderSchema } from "@/types/validator";
import { CartItem } from "@/types";
import { Prisma } from "@/lib/generated/prisma/client";

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
    
    return convertToPlainObject(order);
}