import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travel-to-china-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || adminPassword.length < 4) {
      return NextResponse.json({ error: 'Admin login not configured' }, { status: 400 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
    }

    // Create a simple JWT token
    const token = await new jose.SignJWT({ role: 'admin', email: 'admin@travel-to-china.local' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET);

    // Set cookie
    const response = NextResponse.json({ success: true, redirectTo: '/admin' });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
