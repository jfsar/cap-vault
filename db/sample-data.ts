import { hashedPassword } from "@/lib/utils";

export const sampleData = {
  users: [
    {
      name: 'John',
      email: 'admin@example.com',
      password: hashedPassword('123456'),
      role: 'admin',
    },
    {
      name: 'Jane',
      email: 'user@example.com',
      password: hashedPassword('123456'),
      role: 'user',
    },
  ],
  products: [
    {
      name: 'Snapback Vintage Cap 1',
      slug: 'snapback-vintage-cap-1',
      category: "Sports And Outdoors",
      description: 'Vinyl truffaut next level street art cold-pressed offal whatever small batch umami trust fund XOXO',
      images: [
        '/images/sample-products/c1-01.jpg',
        '/images/sample-products/c1-02.jpg',
      ],
      price: 59.99,
      brand: 'Brand 1',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'Snapback Vintage Cap 2',
      slug: 'snapback-vintage-cap-2',
      category: "Sports And Outdoors",
      description: 'Vinyl truffaut next level street art cold-pressed offal whatever small batch umami trust fund XOXO',
      images: [
        '/images/sample-products/c2-01.jpg',
        '/images/sample-products/c2-02.jpg',
      ],
      price: 59.99,
      brand: 'Brand 2',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'Snapback Vintage Cap 3',
      slug: 'snapback-vintage-cap-3',
      category: "Sports And Outdoors",
      description: 'Vinyl truffaut next level street art cold-pressed offal whatever small batch umami trust fund XOXO',
      images: [
        '/images/sample-products/c3-01.jpg',
        '/images/sample-products/c3-02.jpg',
      ],
      price: 59.99,
      brand: 'Brand 3',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
    {
      name: 'Snapback Vintage Cap 4',
      slug: 'snapback-vintage-cap-4',
      category: "Sports And Outdoors",
      description: 'Vinyl truffaut next level street art cold-pressed offal whatever small batch umami trust fund XOXO',
      images: [
        '/images/sample-products/c4-01.jpg',
        '/images/sample-products/c4-02.jpg',
      ],
      price: 59.99,
      brand: 'Brand 4',
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: true,
      banner: 'banner-1.jpg',
    },
  ],
};

export default sampleData;
