import ProductCard from "@/components/shared/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { Metadata } from 'next'
import { getAllProducts, getAllCategories } from "@/db/actions/product.action";
import { cn } from "@/lib/utils";
import Link from "next/link";


const prices = [
    {
      name: '₱1 to ₱50',
      value: '1-50',
    },
    {
      name: '₱51 to ₱100',
      value: '51-100',
    },
    {
      name: '₱101 to ₱200',
      value: '101-200',
    },
    {
      name: '₱201 to ₱500',
      value: '201-500',
    },
    {
      name: '₱501 to ₱1000',
      value: '501-1000',
    },
  ];
  
const ratings = [4, 3, 2, 1];
  
const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props,
): Promise<Metadata> {
  const { q = "all", category = "all", price = "all", rating = "all" } = await searchParams;
  const isQuerySet = q && q !== "all" && q.toString().trim() !== "";
  const isCategorySet = category && category !== "all" && category.toString().trim() !== "";
  const isPriceSet = price && price !== "all" && price.toString().trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.toString().trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) { 
    return {
      title: `
      Search ${isQuerySet ? q : ''} 
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  }

  return {
    title: 'Search Products'
  };
}

async function SearchPage({
    searchParams
}: {
  searchParams: Promise<{ 
      q?: string;
      category?: string;
      price?: string;
      rating?: string;
      sort?: string;
      page?: string;
  }>
}) {
  
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await searchParams;
  
    
  // Construct filter url
  const getFilterUrl = ({
    c,
    p,
    s,
    r,
    pg,
  }: {
    c?: string;
    p?: string;
    s?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c) params.category = c;
    if (p) params.price = p;
    if (s) params.sort = s;
    if (r) params.rating = r;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };
  
  
  

  const productsFromDB = await getAllProducts({
        query: q,
        category: category,
        page: Number(page),
        price,
        rating,
        sort
  });
    
  const products = productsFromDB.data.map((product) => {
    return {
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString()
    };
  });
    
  const categories = await getAllCategories();
  
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
        <div className="filter-links">
              {/* category links */}
              <div className="text-xl mb-2 mt-3">Category</div>
              <div>
                  <ul className="space-y-1">
                      <li>
                          <Link
                              className={`${(category === 'all' || category === '') && 'font-bold'}`}
                              href={getFilterUrl({c: 'all'})}
                          >Any</Link>
                      </li>
                      {categories.map((item) => (
                          <li key={item.category}>
                                <Link
                                  href={getFilterUrl({ c: item.category })}
                                  className={`${category === item.category && 'font-bold'}`}
                              >
                                  {item.category}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
              {/* price links */}
              <div className="text-xl mb-2 mt-8">Price</div>
              <div>
                  <ul className="space-y-1">
                      <li>
                          <Link
                              className={`${ price === 'all' && 'font-bold'}`}
                              href={getFilterUrl({p: 'all'})}
                          >Any</Link>
                      </li>
                      {prices.map((item) => (
                          <li key={item.name}>
                                <Link
                                  href={getFilterUrl({ p: item.value })}
                                  className={`${price === item.value && 'font-bold'}`}
                              >
                                  {item.name}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
              {/* rating links */}
              <div className="text-xl mb-2 mt-8">Rating</div>
              <div>
                  <ul className="space-y-1">
                      <li>
                          <Link
                              className={`${ rating === 'all' && 'font-bold'}`}
                              href={getFilterUrl({r: 'all'})}
                          >Any</Link>
                      </li>
                      {ratings.map((item) => (
                          <li key={item}>
                                <Link
                                  href={getFilterUrl({ r: item.toString() })}
                                  className={`${rating === item.toString() && 'font-bold'}`}
                              >
                                  {item} & up
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
       </div>
      <div className="space-y-4 md:col-span-4">
          <div className="flex-between flex-col md:flex-row my-4">
            <div className="flex items-center">
               { q !== "all" && q !== ""  && 'Query: ' + q }
               { category !== "all" && category !== ""  && 'Category: ' + category }
               { price !== "all" && 'Price: ' + price }
               { rating !== "all" && 'Rating: ' + rating + ' & up' }
               &nbsp;
               {
                  (q !== "all" && q !== "") || 
                  (category !== "all" && category !== "") || 
                   rating !== "all" || price !== "all"
                   ? (
                     <Button variant="link" asChild className="text-muted-foreground">
                        <Link href="/search">Clear</Link>
                     </Button>
                   )
                   : null
               }
            </div>
            <div>
              {/* sorting */}
              Sort by: &nbsp;
              {sortOrders.map(item => (
                <Link
                  key={item}
                  href={getFilterUrl({s: item})}
                  className={cn('mx-2',
                    sort == item ? 'font-bold' : '',
                )}>
                  { item }
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {products.length > 0 ?
                      products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                      )) :
                      (
                          <div>No products found.</div>
                      )
                  }
          </div>
       </div>
    </div>
  )
}

export default SearchPage;
