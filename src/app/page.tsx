// TODO: - Change blacks to #1D1D1F
// TODO: - Add images to all milestone products
// TODO: - Add longer descriptions to all milestone products
// TODO: - Add text blurbs to break up the list into big generational shifts within Apple
// TODO: - Update the domain name
// TODO: - Remove the backgrounds of the product images so that the interface looks cleaner
// TODO: - Remove items that repeat because of storage sizes

'use client'

import { products } from "@/lib/products";
import { getSlugByProduct } from "@/lib/slugs";
import Image from "next/image";
import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchFilter } from "@/components/SearchFilter";

interface Product {
  year: string;
  title: string;
  description: string;
  image?: string;
}
export default function Home() {
  const router = useRouter();
  const [filteredProducts, setFilteredProducts] = useState(products);
  
  const featuredProductTitles = [
    "iPhone (1st generation)",
    "iPod Mini (1st gen)",
    "Power Mac G5",
    "Power Mac G4 Cube",
    "iMac G3",
    "Twentieth Anniversary Macintosh",
  ];
  const featuredProducts = featuredProductTitles
    .map((title) => products.find((p) => p.title === title))
    .filter(Boolean) as Product[];
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-8xl font-bold text-center mb-16 font-headline tracking-tight">
          Made by Apple
        </h1>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-center mb-4">Featured Vintage Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => {
              const slug = getSlugByProduct(product);
              return (
                <div
                  key={product.title}
                  onClick={() => slug && router.push(`/product/${slug}`)}
                  className="cursor-pointer text-center transition-colors hover:bg-accent p-2"
                >
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={160}
                    height={160}
                    unoptimized
                    className="mx-auto h-32 w-32 object-contain"
                  />
                )}
                  <h3 className="mt-4 font-semibold">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">{product.year}</p>
                </div>
              );
            })}
          </div>
        </section>
        <h2 className="text-2xl font-semibold text-center mb-4">All Products</h2>
        
        {/* Search and Filter Component */}
        <SearchFilter products={products} onFilteredProducts={setFilteredProducts} />
        
        <div className="border-t border-border">
          {filteredProducts.map((product, index) => {
            const showYearHeader = index === 0 || product.year !== filteredProducts[index - 1].year;
            const slug = getSlugByProduct(product);
            return (
              <Fragment key={index}>
                {showYearHeader && (
                  <div className="border-b border-border bg-background p-4 bg-[#F5F5F5]">
                    <h2 className="text-xl font-semibold text-foreground">{product.year}</h2>
                  </div>
                )}
                <div
                  onClick={() => slug && router.push(`/product/${slug}`)}
                  className="group transition-colors duration-200 ease-in-out hover:bg-accent border-b border-border cursor-pointer"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 items-center">
                      {product.image && (
                        <div className="md:col-span-2 mb-2 md:mb-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={96}
                            height={64}
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="md:col-span-4">
                        <h2 className="font-semibold text-foreground">{product.title}</h2>
                      </div>
                      <div className="md:col-span-6">
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="text-muted-foreground py-16 text-sm">
          <h5 className="font-semibold">This site uses affiliate links.</h5>
          Products on this website use eBay affiliate links. If you purchase an item through one of these links, I receive a small payment around 2-4%. It's how I pay some of the monthly hosting costs associated with this site.
        </div>
      </div>
    </main>
  );
}
