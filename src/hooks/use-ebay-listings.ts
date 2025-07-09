"use client"

import { useEffect, useState } from "react";

export function useEbayListings(query: string | null) {
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/ebay?q=${encodeURIComponent(query)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setLinks(Array.isArray(data.links) ? data.links : []);
        }
      } catch (err) {
        console.error("Failed to fetch eBay listings", err);
      }
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return links;
}
