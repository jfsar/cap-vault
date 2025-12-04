import { z } from 'zod'
import { cartItemSchema, insertCartSchema, insertProductSchema, shippingAddressSchema, signInSchema } from './validator'

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