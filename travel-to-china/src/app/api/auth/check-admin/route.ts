import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import * as jose from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'travel-to-china-secret-key-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // Method 1: Check NextAuth session
    const token = await getToken({ req: request });
    if (token?.email) {
      const isAdmin = checkAdminEmail(token.email);
      if (isAdmin) return NextResponse.json({ isAdmin: true });
    }

    // Method 2: Check admin_token cookie (credentials login)
    const adminToken = request.cookies.get('admin_token')?.value;
    if (adminToken) {
      try {
        const { payload } = await jose.jwtVerify(adminToken, SECRET);
        if (payload.role === 'admin') {
          return NextResponse.json({ isAdmin: true });
        }
      } catch {
        // Token invalid or expired
      }
    }

    return NextResponse.json({ isAdmin: false }, { status: 401 });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

function checkAdminEmail(email: string): boolean {
  const adminEmails = process.env.ADMIN_EMAILS?.split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean) || [];
  if (adminEmails.length === 0) return true;
  return adminEmails.includes(email.toLowerCase());
}
