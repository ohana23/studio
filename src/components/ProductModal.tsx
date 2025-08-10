import Image from "next/image";
import clsx from "clsx";
import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { Spinner } from "./Spinner";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { useEbayListings } from "@/hooks/use-ebay-listings";
import { X } from "lucide-react";

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
  const [shouldFetchEbay, setShouldFetchEbay] = useState(false);
  const { listings: ebayLinks, loading, error } = useEbayListings(shouldFetchEbay ? product.title : null);
  const [preview, setPreview] = useState<{
    src: string;
    x: number;
    y: number;
  } | null>(null);

  // Delay eBay fetch to improve initial modal performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetchEbay(true);
    }, 100); // Short delay to allow modal to render first
    
    return () => clearTimeout(timer);
  }, []);

  const canHover = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  const showPreview = (
    src: string | null | undefined,
  ) =>
    (
      e: React.MouseEvent<HTMLAnchorElement> |
        React.FocusEvent<HTMLAnchorElement>
    ) => {
      if (!src) return;
      if (e.type !== "focus" && !canHover()) return;
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const width = 160;
      const height = 160;
      let x = rect.left;
      let y = rect.bottom + 8;
      if (x + width > window.innerWidth) {
        x = window.innerWidth - width - 8;
      }
      if (y + height > window.innerHeight) {
        y = rect.top - height - 8;
      }
      setPreview({ src, x, y });
    };

  const hidePreview = () => setPreview(null);
  // Prevent body scroll on Safari
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/100 p-4 animate-in fade-in duration-300"
      onClick={(e) => {
        // Close modal when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Close button - fixed to viewport */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-[60] flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 border border-gray-200 transition-all hover:bg-gray-200 focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2"
        aria-label="Close modal"
      >
        <X className="h-6 w-6 text-gray-600" />
      </button>
      <div
        className="relative mx-auto flex max-h-full w-full max-w-5xl flex-col items-center gap-8 md:flex-row animate-in slide-in-from-bottom-6 duration-500"
      >
        {product.image && (
          <div className="relative h-96 w-full md:h-[80vh] md:w-1/2">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              className="object-contain animate-in zoom-in-95 fade-in duration-700"
            />
          </div>
        )}
        <div className={clsx("text-black space-y-2 overflow-y-auto", product.image ? "md:w-1/2" : "w-full")}>
          <h3 className="text-lg font-semibold">{product.year}</h3>
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <p className="text-sm">{product.description}</p>
          <div className="pt-4 space-y-1">
            {loading && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Searching eBay...
              </div>
            )}
            {!shouldFetchEbay && (
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Spinner className="h-4 w-4" />
                Loading...
              </div>
            )}
            {!loading && ebayLinks.length > 0 && !error && (
              <>
                <h4 className="text-sm font-medium text-muted-foreground">Purchase on eBay</h4>
                <ul className="space-y-2">
                  {ebayLinks.map((listing, idx) => (
                    <li
                      key={idx}
                      className="animate-in duration-700 fade-in slide-in-from-bottom-1"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <a
                        href={listing.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 text-black no-underline transition-opacity hover:opacity-50 focus-visible:opacity-50"
                        onMouseEnter={showPreview(listing.image)}
                        onMouseLeave={hidePreview}
                        onFocus={showPreview(listing.image)}
                        onBlur={hidePreview}
                      >
                        <ExternalLinkIcon className="h-4 w-4 shrink-0" />
                        {listing.title}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="text-muted-foreground py-4 text-sm">
                  <h5 className="font-semibold">This site uses affiliate links.</h5>
                    Products on this website use eBay affiliate links. If you purchase an item through one of these links, I receive a small payment around 2-4%. It's how I pay some of the monthly hosting costs associated with this site.
                </div>
              </>
            )}
            {!loading && (ebayLinks.length === 0 || error) && (
              <h4 className="text-sm font-medium text-muted-foreground">No matching items on eBay right now.</h4>
            )}
          </div>
        </div>
      </div>
      {preview && typeof window !== 'undefined' &&
        createPortal(
          <Image
            src={preview.src}
            alt=""
            width={160}
            height={160}
            unoptimized
            className="pointer-events-none fixed z-50 rounded-md border bg-background object-cover shadow-lg"
            style={{ top: preview.y, left: preview.x }}
          />,
          document.body,
        )}
    </div>
  );
}
