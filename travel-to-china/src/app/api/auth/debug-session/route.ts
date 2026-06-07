import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request });
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return NextResponse.json({
    hasToken: !!token,
    tokenEmail: token?.email || '(none)',
    tokenName: token?.name || '(none)',
    tokenProvider: (token as any)?.provider || '(none)',
    adminEmails: adminEmails,
    isAdmin:
      token?.email && adminEmails.includes(token.email.toLowerCase())
        ? 'YES'
        : 'NO',
    rawKeys: token ? Object.keys(token) : [],
  });
}
