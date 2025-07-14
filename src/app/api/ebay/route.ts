import { NextRequest, NextResponse } from "next/server";

const ENDPOINTS = {
  sandbox: "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search",
  production: "https://api.ebay.com/buy/browse/v1/item_summary/search",
} as const;

export interface Listing {
  url: string;
  title: string;
  image: string | null;
}

function getConfig(env?: string) {
  const mode = env === "production" ? "production" : "sandbox";
  const token =
    mode === "production"
      ? process.env.EBAY_OAUTH_TOKEN
      : process.env.EBAY_SANDBOX_OAUTH_TOKEN;
  return { mode, token, endpoint: ENDPOINTS[mode] };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const envOverride = searchParams.get("env") || undefined;
  const { token, endpoint } = getConfig(envOverride || process.env.EBAY_ENV);

  if (!token) {
    return NextResponse.json(
      { error: "Missing eBay credentials" },
      { status: 500 }
    );
  }

  const url =
    `${endpoint}?q=${encodeURIComponent(query)}&limit=3`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
    const data = await res.json();
    const items = data.itemSummaries || [];

    const listings: Listing[] = items
      .map((item: any): Listing => ({
        url: item.itemWebUrl,
        title: item.title,
        image:
          item.image?.imageUrl ||
          item.thumbnailImages?.[0]?.imageUrl ||
          null,
      }))
      .filter((i): i is Listing => Boolean(i.url && i.title));
    return NextResponse.json({ listings });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
