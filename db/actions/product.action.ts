'use server';

import prisma from '@/lib/prima-client';
import { LATEST_PRODUCT_LIMIT, PAGE_SIZE } from '@/lib/constants';
import { convertToPlainObject, formatErrors } from '@/lib/utils';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '@/types/validator';
import { InsertProductData, UpdateProductData } from '@/types';

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

export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category
}: { query: string; limit?: number; page: number; category?: string; }) {

  const data = await prisma.product.findMany({
        orderBy: { createdAt: 'desc'},
        skip: (page - 1) * limit,
        take: limit
    });

    const dataCount = await prisma.product.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit)
    };
}
 
export async function deleteProduct(id: string){
    try {
        const productExists = await prisma.product.findFirst({ where: { id } });

        if (!productExists) throw new Error('Product not found.');

        await prisma.product.delete({ where: { id } });

        revalidatePath('/admin/products');

        return {
            success: true,
            message: 'Product successfully deleted.'
        };

    } catch (error) {
        return formatErrors(error);
    }
}


// Create a product
export async function createProduct(data: InsertProductData) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
      return formatErrors(error);
  }
}

// Update a product
export async function updateProduct(data: UpdateProductData) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
      return formatErrors(error);
  }
}