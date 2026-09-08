import { NextRequest, NextResponse } from 'next/server';

const REDIRECTS: Record<string, string> = {
  '/country/payment-guide': '/country/payment-guide-v2',
  // Legacy visa page consolidated into the tourist visa guide
  '/country/visa-policy': '/country/visa-tourist-guide',
  // Legacy .html URLs from the pre-rewrite static site (found in analytics)
  '/china-food/chinese-foods-that-symbolize-luck-and-prosperity.html': '/country/food-culture',
  '/china-tours/the-city-of-dongtan.html': '/cities/shanghai',
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Canonicalize www -> apex to avoid duplicate content and split link equity
  if (url.hostname === 'www.travels2china.com') {
    url.hostname = 'travels2china.com';
    url.protocol = 'https:';
    return NextResponse.redirect(url, 301);
  }

  const pathname = url.pathname;

  const exactTarget = REDIRECTS[pathname];
  if (exactTarget) {
    return redirectTo(request, exactTarget);
  }

  // Catch-all: any other legacy .html URL → homepage (current site uses clean URLs)
  if (pathname.endsWith('.html')) {
    return redirectTo(request, '/');
  }

  return NextResponse.next();
}

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
