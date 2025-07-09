import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const appId = process.env.EBAY_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: "Missing eBay credentials" }, { status: 500 });
  }

  const url =
    "https://svcs.ebay.com/services/search/FindingService/v1" +
    `?OPERATION-NAME=findItemsByKeywords` +
    `&SERVICE-VERSION=1.13.0` +
    `&SECURITY-APPNAME=${appId}` +
    `&RESPONSE-DATA-FORMAT=JSON` +
    `&keywords=${encodeURIComponent(query)}` +
    `&paginationInput.entriesPerPage=3`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
    const data = await res.json();
    const items =
      data.findItemsByKeywordsResponse?.[0]?.searchResult?.[0]?.item || [];
    const links = items
      .map((item: any) => item.viewItemURL?.[0])
      .filter(Boolean);
    return NextResponse.json({ links });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
