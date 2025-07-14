// TODO: - Change blacks to #1D1D1F
// TODO: - Add images to all milestone products
// TODO: - Add longer descriptions to all milestone products
// TODO: - Add text blurbs to break up the list into big generational shifts within Apple
// TODO: - Update the domain name
// TODO: - Remove the backgrounds of the product images so that the interface looks cleaner
// TODO: - Remove items that repeat because of storage sizes

'use client'

import { products } from "@/lib/products";
import Image from "next/image";
import { Fragment, useState } from "react";
import { ProductModal } from "@/components/ProductModal";

interface Product {
  year: string;
  title: string;
  description: string;
  image?: string;
}
export default function Home() {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-8xl font-bold text-center mb-16 font-headline tracking-tight">
          Made by Apple
        </h1>
        <div className="border-t border-border">
          {products.map((product, index) => {
            const showYearHeader = index === 0 || product.year !== products[index - 1].year;
            return (
              <Fragment key={index}>
                {showYearHeader && (
                  <div className="border-b border-border bg-background p-4 bg-[#F5F5F5]">
                    <h2 className="text-xl font-semibold text-foreground">{product.year}</h2>
                  </div>
                )}
                <div
                  onClick={() => product.image && setOpenProduct(product)}
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
      </div>
        {openProduct && (
          <ProductModal
            product={openProduct}
            onClose={() => setOpenProduct(null)}
          />
        )}
    </main>
  );
}
