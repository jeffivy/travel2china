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

export async function subscribe(email: string, name?: string): Promise<{ success: boolean; message: string }> {
  // Check if already subscribed
  const existing = await getOne<Subscriber>('SELECT * FROM subscribers WHERE email = ?', [email]);

  if (existing) {
    if (existing.status === 'confirmed') {
      return { success: false, message: 'This email is already subscribed.' };
    }
    if (existing.status === 'pending') {
      return { success: false, message: 'A confirmation email has already been sent. Please check your inbox.' };
    }
    await getDb().execute({ sql: 'UPDATE subscribers SET status = ?, unsubscribed_at = NULL WHERE email = ?', args: ['pending', email] });
    return { success: true, message: 'Please check your email to confirm your subscription.' };
  }

  const confirmationToken = crypto.randomBytes(32).toString('hex');

  await getDb().execute({
    sql: `INSERT INTO subscribers (email, name, status, confirmation_token) VALUES (?, ?, 'pending', ?)`,
    args: [email, name || '', confirmationToken],
  });

  await sendToMailchimp(email, name);

  return { success: true, message: 'Please check your email to confirm your subscription.' };
}

export async function confirmSubscription(token: string): Promise<boolean> {
  const result = await getDb().execute({
    sql: `UPDATE subscribers SET status = 'confirmed', confirmed_at = datetime('now'), confirmation_token = NULL
     WHERE confirmation_token = ? AND status = 'pending'`,
    args: [token],
  });
  return result.rowsAffected > 0;
}

export async function unsubscribe(email: string): Promise<boolean> {
  const result = await getDb().execute({
    sql: `UPDATE subscribers SET status = 'unsubscribed', unsubscribed_at = datetime('now') WHERE email = ?`,
    args: [email],
  });
  return result.rowsAffected > 0;
}

export async function getAllSubscribers(status?: string): Promise<Subscriber[]> {
  if (status) {
    return getAll('SELECT * FROM subscribers WHERE status = ? ORDER BY created_at DESC', [status]);
  }
  return getAll('SELECT * FROM subscribers ORDER BY created_at DESC');
}

export async function getSubscriberCount(): Promise<number> {
  const result = await getOne<{ count: number }>(
    "SELECT COUNT(*) as count FROM subscribers WHERE status = 'confirmed'"
  );
  return result?.count || 0;
}

async function sendToMailchimp(email: string, name?: string): Promise<void> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !listId || !server) return;

  try {
    await fetch(`https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `apikey ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        status: 'pending',
        merge_fields: { FNAME: name || '' },
      }),
    });
  } catch {
    // Silently fail Mailchimp sync
  }
}
