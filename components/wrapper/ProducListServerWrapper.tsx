import { getLatestProducts } from '@/db/actions/product.action';
import { delay } from '@/lib/utils';
import React from 'react'
import ProductList from '../shared/product/ProductList';

async function ProducListServerWrapper() {
  const latestProducts = await getLatestProducts();
    
  const transformValues = latestProducts.map((product) => { 
      return {
        ...product,
        price: product.price.toString(),
        rating: product.rating.toString()
      };
   })
    
  await delay(2000);
  return (
      <>
          <ProductList title='New Arrivals' data={transformValues} limit={4}/>
      </>
  )
}

export default ProducListServerWrapper;