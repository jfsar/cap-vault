import { getLatestProducts, getFeaturedProducts } from '@/db/actions/product.action';
import React from 'react'
import ProductList from '../shared/product/ProductList';
import ProductCarousel from '../shared/product/ProductCarousel';
import ViewAllProductsButton from '../ViewAllProductsButton';
import IconBoxes from '../IconBoxes';

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
          <ProductList title='Products' data={transformValues} limit={4}/>
          <ViewAllProductsButton />
          <IconBoxes />
      </>
  )
}

export default ProducListServerWrapper;
