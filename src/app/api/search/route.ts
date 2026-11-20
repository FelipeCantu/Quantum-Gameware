// GET /api/search?q=: up to six product suggestions for the header search. Read only, public data.
import { NextResponse } from 'next/server';
import { getProducts } from '@/sanity/lib/queries';

// Reads the query string, so it always runs per request; getProducts() itself is cached.
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') || '').trim().toLowerCase().slice(0, 64);
  if (q.length < 2) return NextResponse.json({ results: [] });

  const terms = q.split(/\s+/).filter(Boolean);
  const products = await getProducts();
  const results = products
    .map((p) => {
      const hay = `${p.name} ${p.brand ?? ''} ${p.category ?? ''}`.toLowerCase();
      if (!terms.every((t) => hay.includes(t))) return null;
      // Name matches rank above brand or category matches.
      const score = terms.reduce((s, t) => s + (p.name.toLowerCase().includes(t) ? 2 : 1), 0);
      return { score, p };
    })
    .filter((r): r is { score: number; p: (typeof products)[number] } => !!r)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ p }) => ({ name: p.name, slug: p.slug, price: p.price, image: p.image || null, category: p.category }));

  return NextResponse.json({ results });
}
