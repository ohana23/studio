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
import { useEbayListings } from "@/hooks/use-ebay-listings";

interface Product {
  year: string;
  title: string;
  description: string;
  image?: string;
}
export default function Home() {
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const ebayLinks = useEbayListings(openProduct ? openProduct.title : null);
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
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setOpenProduct(null)}
          >
            <div
              className="relative mx-auto flex max-h-full w-full max-w-5xl flex-col items-center gap-8 md:flex-row"
            >
              <div className="relative h-96 w-full md:h-[80vh] md:w-1/2">
                {openProduct.image && (
                  <Image
                    src={openProduct.image}
                    alt={openProduct.title}
                    fill
                    unoptimized
                    className="object-contain animate-in zoom-in-95 fade-in"
                  />
                )}
              </div>
              <div className="text-white md:w-1/2 space-y-2 overflow-y-auto">
                <h3 className="text-lg font-semibold">{openProduct.year}</h3>
                <h2 className="text-2xl font-bold">{openProduct.title}</h2>
                <p className="text-sm">{openProduct.description}</p>
                {ebayLinks.length > 0 && (
                  <ul className="space-y-1 pt-2">
                    {ebayLinks.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-blue-400"
                        >
                          eBay Link
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
    </main>
  );
}
