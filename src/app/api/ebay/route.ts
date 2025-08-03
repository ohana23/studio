import { NextRequest, NextResponse } from "next/server";

const ENDPOINTS = {
  sandbox: "https://api.sandbox.ebay.com/buy/browse/v1/item_summary/search",
  production: "https://api.ebay.com/buy/browse/v1/item_summary/search",
} as const;

const CAMP_ID = process.env.EBAY_CAMPAIGN_ID || "5339118344";

function appendCampId(url: string) {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}campid=${CAMP_ID}`;
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
  const { token, endpoint, mode } = getConfig(envOverride || process.env.EBAY_ENV);

  const url = `${endpoint}?q=${encodeURIComponent(query)}&limit=3`;
  const requestInfo = {
    endpoint,
    env: mode,
    params: { q: query, limit: 3 },
    url,
  };

  if (!token) {
    console.error("Missing eBay credentials", requestInfo);
    return NextResponse.json(
      { error: "Missing eBay credentials" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const text = await res.text();
      let payload: unknown = text;
      try {
        payload = JSON.parse(text);
      } catch {
        // ignore parsing errors and keep raw text
      }
      const errorInfo = {
        ...requestInfo,
        status: res.status,
        statusText: res.statusText,
        response: payload,
      };
      console.error("eBay API request failed", errorInfo);
      return NextResponse.json(
        {
          error: "eBay API request failed",
          details: errorInfo,
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    const items = data.itemSummaries || [];
    const listings = items
      .map((item: any) => ({
        url: item.itemWebUrl ? appendCampId(item.itemWebUrl) : null,
        title: item.title,
        image:
          item.image?.imageUrl ||
          item.thumbnailImages?.[0]?.imageUrl ||
          null,
      }))
      .filter((i: { url: string | null; title: any }) => i.url && i.title);
    return NextResponse.json({ listings });
  } catch (err: any) {
    const errorInfo = { ...requestInfo, message: err?.message ?? String(err) };
    console.error("Failed to fetch eBay data", errorInfo);
    return NextResponse.json(
      {
        error: "Failed to fetch eBay data",
        details: errorInfo,
      },
      { status: 500 }
    );
  }
}
