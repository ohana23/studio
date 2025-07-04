import { products } from "@/lib/products";
import Image from "next/image";
import { Fragment } from "react";
export default function Home() {
  return (
    <main className="min-h-screen bg-background font-body text-foreground">
      <div className="container mx-auto max-w-4xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center mb-16 font-headline tracking-tight">
          Products by Apple
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
                  className="group transition-colors duration-200 ease-in-out hover:bg-accent border-b border-border cursor-pointer"
                >
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-2 items-center">
                      <div className="md:col-span-2 hidden md:block">
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={96}
                            height={64}
                            className="object-contain"
                          />
                        )}
                      </div>
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
    </main>
  );
}
