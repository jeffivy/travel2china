import { NextRequest, NextResponse } from 'next/server';

const REDIRECTS: Record<string, string> = {
  '/country/payment-guide': '/country/payment-guide-v2',
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirectTarget = REDIRECTS[pathname];

  if (redirectTarget) {
    const url = request.nextUrl.clone();
    url.pathname = redirectTarget;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/country/payment-guide',
};
