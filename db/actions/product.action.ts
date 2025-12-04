'user sever';

import prisma from '@/lib/prima-client';
import { LATEST_PRODUCT_LIMIT } from '@/lib/constants';
import { convertToPlainObject } from '@/lib/utils';

export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        take: LATEST_PRODUCT_LIMIT,
        orderBy: {
            createdAt: 'desc'
        }
    });

    return convertToPlainObject(data);
}

export async function getProductBySlug(slug: string) { 
    const product = await prisma.product.findFirst({
        where: {slug}
    });

    return convertToPlainObject(product);
}