import ProductCard from "@/components/shared/product/ProductCard";
import { getAllProducts, getAllCategories } from "@/db/actions/product.action";
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
       </div>
       <div className="space-y-4 md:col-span-4">
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
