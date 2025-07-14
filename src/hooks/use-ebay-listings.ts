"use client"

import { useEffect, useState } from "react";

export interface EbayListing {
  url: string
  title: string
  image?: string | null
}

export function useEbayListings(query: string | null) {
  const [links, setLinks] = useState<EbayListing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ebay?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!res.ok) return;
        if (!cancelled) {
          setLinks(Array.isArray(data.listings) ? data.listings : []);
        }
      } catch (err) {
        console.error("eBay listings error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return { listings: links, loading };
}
