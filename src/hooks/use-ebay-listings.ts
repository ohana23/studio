"use client"

import { useEffect, useState } from "react";

export function useEbayListings(query: string | null) {
  const [links, setLinks] = useState<string[]>([]);

  useEffect(() => {
    if (!query) return;
    let cancelled = false;
    const fetchListings = async () => {
      console.log("Fetching eBay listings...");
      try {
        const res = await fetch(`/api/ebay?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        console.log("eBay response:", data);
        if (!res.ok) return;
        if (!cancelled) {
          setLinks(Array.isArray(data.links) ? data.links : []);
        }
      } catch (err) {
        console.error("eBay listings error:", err);
      }
    };
    fetchListings();
    return () => {
      cancelled = true;
    };
  }, [query]);

  return links;
}
