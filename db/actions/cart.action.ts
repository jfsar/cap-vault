'use server';

import { auth } from "@/auth";
import { convertToPlainObject, formatErrors, roundDecimalToTwo } from "@/lib/utils";
import { CartItem } from "@/types";
import { cookies } from "next/headers";
import prisma from "@/lib/prima-client";
import { cartItemSchema, insertCartSchema } from "@/types/validator";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/lib/generated/prisma/client";

const calcPrice = (items: CartItem[]) => { 
    const itemsPrice = roundDecimalToTwo(
        items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0)
    ),
    shippingPrice = roundDecimalToTwo(itemsPrice > 100 ? 0 : 10),
    taxPrice = roundDecimalToTwo(0.15 * itemsPrice),
    totalPrice = roundDecimalToTwo(itemsPrice + shippingPrice + taxPrice)
    
    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2)
    }
}

export async function AddItemToCart(data: CartItem) { 
    try {
        // check for cart cookies
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) { 
            throw new Error('Cart session not found.');
        }
        // Get session and user id
        const session = await auth();
        const userId = session?.user?.id ? (session.user.id as string) : undefined;

        // Get cart
        const cart = await getMyCart();

        // parse and validate item
        const item = cartItemSchema.parse(data);

        // find product in database
        const product = await prisma.product.findFirst({
            where: {
                id: item.productId,
            }
        });


        if (!product) throw new Error('Product not found.');

        if (!cart) {
            // create new cart object
            const newCart = insertCartSchema.parse({
                userId: userId,
                items: [item],
                ...calcPrice([item]),
                sessionCartId
            });

            // insert to db
            await prisma.cart.create({
                data: newCart
            });

            // revalidate product page
            revalidatePath(`/product/${product.slug}`);
            
            return {
                success: true,
                message: `${product.name} added to cart.`
    
            };
        } else { 
            //check if item is already in cart
            const existingItem = (cart.items as CartItem[]).find((cart) => cart.productId === item.productId);

            if (existingItem) {
                // check the stock
                if (product.stock < (existingItem.qty + 1)) {
                    throw new Error('Not enough stock');
                }

                (cart.items as CartItem[]).find((cart) => cart.productId === item.productId)!.qty = existingItem.qty + 1;
            } else {
                // if item does not exist in cart
                // check stock
                if (product.stock < 1) { 
                    throw new Error('Not enough stock.');
                }

                //add item to cart
                cart.items.push(item);
            }
            // save to db
            await prisma.cart.update({
                where: {
                    id: cart.id
                },
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[]),
                }
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existingItem ? 'updated in': 'added to'} cart.`
    
            };
        }
    } catch (error) {
        console.log(error);
        return formatErrors(error);
    }
}

export async function getMyCart() { 
    // check for cart cookies
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) { 
        throw new Error('Cart session not found.');
    }
    // Get session and user id
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    //Get user cart from db
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
    });

    if (!cart) return undefined;

    return convertToPlainObject({
        ...cart,
        items: cart.items as CartItem[],
        itemsPrice: cart.itemsPrice.toString(),
        totalPrice: cart.totalPrice.toString(),
        shippingPrice: cart.shippingPrice.toString(),
        taxPrice: cart.taxPrice.toString(),
    });
}


export async function removeItemFromCart(productId: string) {
    try {
        // check for cart cookies
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;

        if (!sessionCartId) { 
            throw new Error('Cart session not found.');
        }
        
        // get product
        const product = await prisma.product.findFirst({
            where: {
                id: productId
            }
        });

        if (!product) { 
            throw new Error('Product not found.');
        }

        // get user cart
        const cart = await getMyCart();

        if (!cart) { 
            throw new Error('Cart not found.');
        }

        const exist = (cart.items as CartItem[]).find((item) => item.productId == productId);

        if (!exist) { throw new Error('Item not found.'); }
        
        // check item quantity
        if (exist.qty === 1) {
            // remove from cart
            cart.items = (cart.items as CartItem[]).filter((item) => item.productId !== exist.productId);
        } else { 
            // decrease quantity 
            (cart.items as CartItem[]).find((item) => item.productId === exist.productId)!.qty = exist.qty - 1;
        }

        // update cart in db
        await prisma.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[]),
            },
        });

        revalidatePath(`/products/${product.slug}`);

        return {
            success: true,
            message: `${product.name} remove from cart successfully.`
        }

    } catch (error) {
        return formatErrors(error);
    }
 }