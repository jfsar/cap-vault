import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";
import Rating from "./Rating";

function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Card className="w-full pt-0 overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/product/${product?.slug}`} className="block">
          {/* FIX: aspect-ratio wrapper + fill instead of fixed width/height */}
          <div className="relative aspect-square w-full">
            <Image
              src={product?.images[0]}
              alt={product?.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center border-b"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-2">
        <div className="text-xs text-muted-foreground">{product?.brand}</div>
        <Link href={`/product/${product?.slug}`}>
          {/* FIX: line-clamp prevents long titles breaking layout */}
          <h2 className="text-sm font-medium leading-snug line-clamp-2">
            {product?.name}
          </h2>
        </Link>
        {/* FIX: flex-wrap so rating and price stack on very small screens */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-1">
          <Rating value={Number(product.rating)} />
          {product?.stock > 0 ? (
            // FIX: parseFloat instead of parseInt to preserve decimals
            <ProductPrice value={formatPrice(parseFloat(product?.price))} />
          ) : (
            <p className="text-destructive text-sm">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductCard;