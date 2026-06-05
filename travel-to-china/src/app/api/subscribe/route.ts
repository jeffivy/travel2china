import { NextRequest, NextResponse } from 'next/server';
import { subscribe, confirmSubscription, unsubscribe } from '@/lib/subscribe';

// POST /api/subscribe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, action } = body;

    if (action === 'confirm') {
      const token = body.token;
      if (!token) {
        return NextResponse.json({ error: 'Token required' }, { status: 400 });
      }
      const confirmed = confirmSubscription(token);
      return NextResponse.json({
        success: confirmed,
        message: confirmed ? 'Email confirmed! You are now subscribed.' : 'Invalid or expired confirmation link.',
      });
    }

    if (action === 'unsubscribe') {
      if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
      }
      const result = unsubscribe(email);
      return NextResponse.json({
        success: result,
        message: result ? 'You have been unsubscribed.' : 'Email not found.',
      });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const result = await subscribe(email, name);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
