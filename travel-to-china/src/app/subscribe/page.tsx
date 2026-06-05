'use client';

import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export default function SubscribePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus('idle');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Updated</h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Get the latest travel tips, city guides, and insider recommendations for exploring China.
          </p>
        </div>
      </section>

      <section className="container-content py-12">
        <div className="max-w-lg mx-auto">
          {/* Benefits */}
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">What You&apos;ll Receive</h2>
            <ul className="space-y-3">
              {[
                'Weekly travel tips and destination highlights',
                'New city guide notifications',
                'Cultural insights and food recommendations',
                'Visa policy updates and travel alerts',
                'Exclusive curated itineraries',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          {status === 'success' ? (
            <div className="card p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
              <p className="text-[var(--muted)]">{message}</p>
            </div>
          ) : (
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">Name (optional)</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl
                               bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email address *</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-xl
                               bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted)]
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-500 text-sm">{message}</p>
                )}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-base"
                >
                  {loading ? 'Subscribing...' : (
                    <>Subscribe <Mail className="w-5 h-5" /></>
                  )}
                </button>
                <p className="text-xs text-[var(--muted)] text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
