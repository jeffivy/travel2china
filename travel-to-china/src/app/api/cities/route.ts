import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/mdx';

export async function GET() {
  const cities = getAllContent('cities');

  return NextResponse.json({
    cities: cities.map((c) => ({
      slug: c.slug,
      title: c.meta.title,
      description: c.meta.description,
      region: c.meta.region,
      population: c.meta.population,
      bestTimeToVisit: c.meta.bestTimeToVisit,
      highlights: c.meta.highlights,
      image: c.meta.image,
    })),
  });
}
