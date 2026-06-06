import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.email) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) || [];

    if (adminEmails.length === 0) {
      return NextResponse.json({ isAdmin: true });
    }

    const isAdmin = adminEmails.includes(token.email.toLowerCase());
    return NextResponse.json({ isAdmin });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
