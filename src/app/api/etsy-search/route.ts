import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const useMock = process.env.USE_MOCK_ETSY === 'true';

  if (useMock) {
    const base = `https://www.etsy.com/search?q=${encodeURIComponent(query)}`;
    const links = Array.from({ length: 5 }, (_, i) => `${base}&mock=${i + 1}`);
    return NextResponse.json({ links });
  }

  const apiKey = process.env.ETSY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ETSY_API_KEY not configured' }, { status: 500 });
  }

  const endpoint = `https://openapi.etsy.com/v3/application/listings/active?keywords=${encodeURIComponent(query)}&limit=5&sort_on=score`;

  const res = await fetch(endpoint, {
    headers: {
      'x-api-key': apiKey,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Etsy API error', text);
    return NextResponse.json({ error: 'Failed to fetch from Etsy' }, { status: 500 });
  }

  const data = await res.json();
  const items = Array.isArray(data.results) ? data.results : [];
  const links = items.map((item: any) => item.url).filter(Boolean);
  const unique = Array.from(new Set(links)).slice(0, 5);

  return NextResponse.json({ links: unique });
}
