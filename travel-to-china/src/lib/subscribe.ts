import { getDb, getAll, getOne } from './db';
import crypto from 'crypto';

export interface Subscriber {
  id: number;
  email: string;
  name?: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  confirmation_token?: string;
  confirmed_at?: string;
  created_at: string;
}

// Subscribe an email
export async function subscribe(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  const db = getDb();

  // Check if already subscribed
  const existing = getOne<Subscriber>('SELECT * FROM subscribers WHERE email = ?', [email]);

  if (existing) {
    if (existing.status === 'confirmed') {
      return { success: false, message: 'This email is already subscribed.' };
    }
    if (existing.status === 'pending') {
      return { success: false, message: 'A confirmation email has already been sent. Please check your inbox.' };
    }
    // Resubscribe
    db.prepare('UPDATE subscribers SET status = "pending", unsubscribed_at = NULL WHERE email = ?').run(email);
    return { success: true, message: 'Please check your email to confirm your subscription.' };
  }

  const confirmationToken = crypto.randomBytes(32).toString('hex');

  db.prepare(
    `INSERT INTO subscribers (email, name, status, confirmation_token) VALUES (?, ?, 'pending', ?)`
  ).run(email, name || '', confirmationToken);

  // Optionally: Send to Mailchimp API here
  await sendToMailchimp(email, name);

  return { success: true, message: 'Please check your email to confirm your subscription.' };
}

// Confirm subscription
export function confirmSubscription(token: string): boolean {
  const result = getDb()
    .prepare(
      `UPDATE subscribers SET status = 'confirmed', confirmed_at = datetime('now'), confirmation_token = NULL
     WHERE confirmation_token = ? AND status = 'pending'`
    )
    .run(token);

  return result.changes > 0;
}

// Unsubscribe
export function unsubscribe(email: string): boolean {
  const result = getDb()
    .prepare(`UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = datetime('now') WHERE email = ?`)
    .run(email);

  return result.changes > 0;
}

// Get all subscribers
export function getAllSubscribers(status?: string): Subscriber[] {
  if (status) {
    return getAll('SELECT * FROM subscribers WHERE status = ? ORDER BY created_at DESC', [status]);
  }
  return getAll('SELECT * FROM subscribers ORDER BY created_at DESC');
}

// Get subscriber count
export function getSubscriberCount(): number {
  const result = getOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'"
  );
  return result?.count || 0;
}

// Send to Mailchimp (mock implementation)
async function sendToMailchimp(email: string, name?: string): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !server) {
    console.log('Mailchimp not configured. Skipping email sync for:', email);
    return;
  }

  try {
    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `apikey ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'pending',
          merge_fields: {
            FNAME: name || '',
          },
        }),
      }
    );

    if (!response.ok) {
      console.error('Mailchimp API error:', await response.text());
    }
  } catch (error) {
    console.error('Failed to sync with Mailchimp:', error);
  }
}
