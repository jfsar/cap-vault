import { getLatestProducts, getFeaturedProducts } from '@/db/actions/product.action';
import React from 'react'
import ProductList from '../shared/product/ProductList';
import ProductCarousel from '../shared/product/ProductCarousel';
import ViewAllProductsButton from '../ViewAllProductsButton';

async function ProducListServerWrapper() {
  const latestProducts = await getLatestProducts();
  const feauturedProductsFromDB = await getFeaturedProducts();
    
  const transformValues = latestProducts.map((product) => {
    return {
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString()
    };
  });

  const featuredProducts = feauturedProductsFromDB.map((product) => {
    return {
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString()
    };
  });
  
  return (
      <>
          {
            featuredProducts.length > 0 && 
            <ProductCarousel data={featuredProducts} />
          }
          <ProductList title='New Arrivals' data={transformValues} limit={4}/>
          <ViewAllProductsButton />
      </>
  )
}

export default ProducListServerWrapper;