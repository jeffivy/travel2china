import { NextRequest, NextResponse } from 'next/server';
import { getContentBySlug } from '@/lib/mdx';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const city = getContentBySlug('cities', params.slug);

  if (!city) {
    return NextResponse.json({ error: 'City not found' }, { status: 404 });
  }

  return NextResponse.json({
    slug: city.slug,
    title: city.meta.title,
    description: city.meta.description,
    content: city.content,
    region: city.meta.region,
    population: city.meta.population,
    bestTimeToVisit: city.meta.bestTimeToVisit,
    weather: city.meta.weather,
    highlights: city.meta.highlights,
    tags: city.meta.tags,
    image: city.meta.image,
  });
}
