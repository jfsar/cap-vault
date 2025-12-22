"use server";

import prisma from '@/lib/prima-client';
import { auth } from '@/auth';
import { formatErrors } from '@/lib/utils';
import { insertReviewSchema } from '@/types/validator';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// create or update reviews

export async function createOrUpdateReview(data: z.infer<typeof insertReviewSchema>) {
    try {
        const session = await auth();

        if (!session) throw new Error('User is not authenticated.');

        const review = insertReviewSchema.parse({
            ...data,
            userId: session.user.id
        });

        const product = await prisma.product.findFirst({
            where: { id: review.productId }
        });
        

        if (!product) throw new Error('Product not found.');

        const reviewExist = await prisma.review.findFirst({
            where: {
                productId: review.productId,
                userId: review.userId
            }
        });

        await prisma.$transaction(async (tx) => { 
            if (reviewExist) {
                // update review
                await tx.review.update({
                    where: {
                        id: reviewExist.id,
                    },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating
                    }
                });
            } else { 
                // create review
                await tx.review.create({
                    data: review
                });
            }

            // get average rating
            const averageRating = await tx.review.aggregate({
                _avg: { rating: true },
                where: { productId: review.productId }
            });

            // get number of reviews
            const numReviews = await tx.review.count({ where: { productId: review.productId } });

            // update rating and num of review in product table
            await tx.product.update({
                where: { id: review.productId },
                data: {
                    rating: averageRating._avg.rating as number,
                    numReviews: numReviews
                }
            });
        });

        revalidatePath(`/product/${product.slug}`);

        return {
            success: true,
            message: 'Review updated successfully.'
        };

    } catch (error) {
        formatErrors(error);
    }
}

// get all reviews for a product
export async function getAllReviews({ productId }: { productId: string; }) {

    const data = await prisma.review.findMany({
        where: {
            productId: productId
        },
        include: {
            user: {
                select: { name: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return { data };
}
 
// get review wriiten by current user
export async function getReviewByProductId({ productId }: { productId: string; }) { 
    const session = await auth();

    if (!session) throw new Error('User is not authenticated.');

    return await prisma.review.findFirst({
        where: {
            productId: productId,
            userId: session.user.id
        }
    });
}