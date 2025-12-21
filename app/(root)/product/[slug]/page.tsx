import { auth } from "@/auth";
import AddToCart from "@/components/shared/product/AddToCart";
import ProductImages from "@/components/shared/product/ProductImages";
import ProductPrice from "@/components/shared/product/ProductPrice";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getMyCart } from "@/db/actions/cart.action";
import { getProductBySlug } from "@/db/actions/product.action";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReviewList from "./ReviewList";


async function ProductDetailsPage(props: {
    params: Promise<{ slug: string; }>
}) {

  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  const session = await auth();
  const userId = session?.user.id;

  const cart = await getMyCart();
  
  if(!product) {
      notFound();
  }
  
  return (
    <>
      <section>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8">
          {/* images column */}
          <div className="col-span-2">
            <ProductImages images={product.images}/>
          </div>
          {/* details column */}
          <div className="col-span-2 p-5">
            <div className="flex flex-col gap-6">
                <p>{product.brand} {product.category}</p>
                <h1 className="h3-bold">{ product.name }</h1>
                <p>{String(product.rating)} of {product.numReviews} reviews</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <ProductPrice 
                       value={formatPrice(Number(product.price))} 
                       className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                    />
                </div>
            </div>
            <div className="mt-10">
                <p className="font-semibold">Description</p>
                <p>{ product.description }</p>
            </div>
          </div>
          {/* actions column */}
          <div>
            <Card>
                <CardContent className="p-4">
                    <div className="mb-2 flex justify-between">
                        <div>Price</div>
                        <div>
                            <ProductPrice value={formatPrice(Number(product.price))}/>
                        </div>
                    </div>
                    <div className="mb-5 flex justify-between">
                        <div>Status</div>
                        <div>
                           {product.stock > 0 ? (
                            <Badge variant='outline'>In Stock</Badge>
                           ) : (
                            <Badge variant='destructive'>Out of Stock</Badge>
                           )}
                        </div>
                    </div>
                    {product.stock > 0 && (
                        <div className="flex-center">
                            <AddToCart 
                               cart={cart}
                               item={{
                                  productId: product.id,
                                  slug: product.slug,
                                  name: product.name,
                                  qty: 1,
                                  image: product.images[0],
                                  price: String(product.price)
                               }} 
                            />
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="h2-bold">Customer Reviews</h2>
        <ReviewList
          userId={userId || ''}
          productId={product.id}
          productSlug={product.slug}
        />
      </section>
    </>
  )
}

export default ProductDetailsPage;
