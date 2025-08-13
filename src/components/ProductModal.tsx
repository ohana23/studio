import Image from "next/image";
import clsx from "clsx";
import { ExternalLinkIcon } from "./ExternalLinkIcon";
import { Spinner } from "./Spinner";
import { createPortal } from "react-dom";
import { useState } from "react";
import { useEbayListings } from "@/hooks/use-ebay-listings";
import {
  motion,
  PanInfo,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";

export const MARGIN = 16;
export const MAX_BLUR = 12;
export const MAX_OPACITY = 0.2;
export const DISMISS_DISTANCE = 50;

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
  const { listings: ebayLinks, loading, error } = useEbayListings(product.title);
  const [preview, setPreview] = useState<{
    src: string;
    x: number;
    y: number;
  } | null>(null);
  const [height, setHeight] = useState(0);
  const y = useSpring(0, { damping: 50, stiffness: 550 });

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

  function onPanStart() {
    grab.start();
  }

  function onPanEnd(_: PointerEvent, { velocity }: PanInfo) {
    grab.end();

    if (y.get() < 0) {
      y.set(0);
      return;
    }

    const projectedY = y.get() + project(velocity.y);

    if (projectedY >= DISMISS_DISTANCE) {
      y.set(height + MARGIN);
      setTimeout(onClose, 200);
      return;
    }

    y.set(0);
  }

  function onPan(_: PointerEvent, { offset }: PanInfo) {
    let newY = offset.y;
    newY = dampen(newY, [0, height]);
    y.jump(newY);
  }

  const blur = useTransform(y, [0, height], [MAX_BLUR, 0]);
  const opacity = useTransform(y, [0, height], [MAX_OPACITY, 0]);

  return (
    <>
      <motion.div
        style={{ opacity, backdropFilter: useMotionTemplate`blur(${blur}px)` }}
        className="fixed inset-0 z-40 bg-black"
        onClick={() => {
          y.set(height + MARGIN);
          setTimeout(onClose, 200);
        }}
      />
      <motion.div
        onPanStart={onPanStart}
        onPanEnd={onPanEnd}
        onPan={onPan}
        ref={(node: HTMLDivElement | null) => {
          const bounds = node?.getBoundingClientRect();
          if (bounds) setHeight(bounds.height);
        }}
        className="fixed left-2 right-2 bottom-2 z-50 w-[calc(100%_-_16px)] max-h-[80vh] overflow-y-auto rounded-[32px] bg-white p-4 cursor-grab active:cursor-grabbing dark:bg-gray3 max-sm:rounded-16"
        style={{ y } as React.CSSProperties}
      >
        <motion.div className="w-10 h-1 bg-gray7 rounded-full mx-auto mb-4" />
        {product.image && (
          <div className="relative mb-4 h-48 w-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        )}
        <div
          className={clsx(
            "text-black space-y-2",
            product.image ? "" : "",
          )}
        >
          <p
            className="text-black cursor-pointer font-semibold transition-opacity hover:opacity-50 focus-visible:opacity-50"
            onClick={onClose}
          >
            &larr; Back to all products
          </p>
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
            {!loading && ebayLinks.length > 0 && !error && (
              <>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Purchase on eBay
                </h4>
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
              <h4 className="text-sm font-medium text-muted-foreground">
                No matching items on eBay right now.
              </h4>
            )}
          </div>
        </div>
      </motion.div>
      {preview &&
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
    </>
  );
}

export function project(initialVelocity: number, decelerationRate = 0.998) {
  return (
    (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate)
  );
}

function dampen(val: number, [min, max]: [number, number], factor = 2) {
  if (val > max) {
    const extra = val - max;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return max + dampenedExtra * factor;
  } else if (val < min) {
    const extra = val - min;
    const dampenedExtra = extra > 0 ? Math.sqrt(extra) : -Math.sqrt(-extra);
    return min + dampenedExtra * factor;
  } else {
    return val;
  }
}

export const grab = {
  start: () => document.body.classList.add("gesture-grabbing"),
  end: () => document.body.classList.remove("gesture-grabbing"),
};
