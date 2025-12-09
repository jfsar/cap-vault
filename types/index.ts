import { z } from 'zod'
import {
    cartItemSchema,
    insertCartSchema,
    insertOrderItemSchema,
    insertOrderSchema,
    insertProductSchema,
    paymentMethodsScehma,
    shippingAddressSchema,
    signInSchema
} from './validator'

export type Product = z.infer<typeof insertProductSchema> & {
    id: string;
    rating: string;
    numReviews: number;
    createdAt: Date;
}

export type SignInType = z.infer<typeof signInSchema>;

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type PaymentMethodType = z.infer<typeof paymentMethodsScehma>;
export type OrderItemType = z.infer<typeof insertOrderItemSchema>;
export type OrderType = z.infer<typeof insertOrderSchema> & {
    id: string;
    createdAt: Date;
    isPaid: Boolean;
    paidAt: Date | null;
    isDelivered: Boolean;
    deliveredAt: Date | null;
    orderItems: OrderItemType[];
    user: { name: string; email: string; }
};
