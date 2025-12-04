
import ProductList from '@/components/shared/product/ProductList';
import { getLatestProducts } from '@/db/actions/product.action';

export default async function Home() {
  const latestProducts = await getLatestProducts();
  const transformValues = latestProducts.map((product) => { 
    return {
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString()
    };
  })

  return (
      <>
        <ProductList title='New Arrivals' data={transformValues} limit={4}/>
      </>
  );
}
