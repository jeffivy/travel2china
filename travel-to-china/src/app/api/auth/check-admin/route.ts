import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.email) {
      return NextResponse.json({
        isAdmin: false,
        reason: 'No token or email found in session',
        hasToken: !!token,
      }, { status: 401 });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean) || [];

    if (adminEmails.length === 0) {
      return NextResponse.json({ isAdmin: true, reason: 'No admin emails configured, all users allowed' });
    }

    const isAdmin = adminEmails.includes(token.email.toLowerCase());
    return NextResponse.json({
      isAdmin,
      email: token.email,
      adminEmails,
      reason: isAdmin ? 'Email matches admin list' : 'Email not in admin list',
    });
  } catch {
    return NextResponse.json({ isAdmin: false, reason: 'Server error' }, { status: 500 });
  }
}
