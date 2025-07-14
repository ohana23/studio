import Image from "next/image";
import clsx from "clsx";
import { ExternalLink } from "lucide-react";
import { useEbayListings } from "@/hooks/use-ebay-listings";

interface Product {
  year: string;
  title: string;
  description: string;
  image?: string;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const ebayLinks = useEbayListings(product.title);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative mx-auto flex max-h-full w-full max-w-5xl flex-col items-center gap-8 md:flex-row"
      >
        {product.image && (
          <div className="relative h-96 w-full md:h-[80vh] md:w-1/2">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              className="object-contain animate-in zoom-in-95 fade-in"
            />
          </div>
        )}
        <div className={clsx("text-white space-y-2 overflow-y-auto", product.image ? "md:w-1/2" : "w-full")}>
          <h3 className="text-lg font-semibold">{product.year}</h3>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-sm">{product.description}</p>
          {ebayLinks.length > 0 && (
            <div className="pt-4 space-y-1">
              <h4 className="text-sm font-medium text-muted-foreground">
                Purchase on eBay
              </h4>
              <ul className="space-y-1">
                {ebayLinks.map((listing, idx) => (
                  <li key={idx} className="relative group">
                    <a
                      href={listing.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-white no-underline transition-opacity hover:opacity-70 focus-visible:opacity-70"
                    >
                      {listing.title}
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </a>
                    {listing.image && (
                      <Image
                        src={listing.image}
                        alt=""
                        width={160}
                        height={160}
                        unoptimized
                        className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden rounded-md border bg-background object-cover shadow-lg group-hover:block group-focus-visible:block"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
