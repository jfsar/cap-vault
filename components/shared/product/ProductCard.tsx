import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import Rating from "./Rating";

function ProductCard({ product }: { product: Product; }) {
  return (
    <Card className="w-full max-w-sm pt-0 overflow-hidden">
       <CardHeader className="p-0 items-center">
         <Link href={`/product/${product?.slug}`}>
            <Image 
                src={product?.images[0]} 
                alt={ product?.name } 
                width={300} 
                height={300}
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="w-full object-cover object-center border-b"
            />
         </Link>
       </CardHeader>
       <CardContent className="p-4 grid gap-4">
         <div className="text-xs">{ product?.brand }</div>
         <Link href={`/product/${product?.slug}`}>
            <h2 className="text-sm font-medium">{ product?.name }</h2>
         </Link>
         <div className="flex-between gap-4">
            <Rating value={Number(product.rating)}/>
            {product?.stock > 0 ? (
                <ProductPrice value={formatPrice(parseInt(product?.price))}/>
            ) : (
                <p className="text-destructive">Out of Stock</p>
            )}
         </div>
       </CardContent>
    </Card>
  )
}

export default ProductCard;
