 'use client';
 
 import { useState } from 'react';
 import { Mail, ArrowRight, Check } from 'lucide-react';
 
 interface SubscribeCardProps {
   variant?: 'inline' | 'compact';
   title?: string;
   description?: string;
 }
 
 export default function SubscribeCard({
   variant = 'inline',
   title = 'Get Weekly China Travel Tips',
   description = 'Join our newsletter for destination guides, travel hacks, visa updates, and insider recommendations delivered to your inbox.',
 }: SubscribeCardProps) {
   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     try {
       const res = await fetch('/api/subscribe', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email }),
       });
       if (res.ok) {
         setSubmitted(true);
       }
     } catch {
       // Fallback: redirect to subscribe page
       window.location.href = `/subscribe?email=${encodeURIComponent(email)}`;
     }
   };
 
   if (submitted) {
     return (
       <div className="rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/20 p-6 text-center">
         <Check className="w-10 h-10 mx-auto mb-3 text-[var(--success)]" />
         <p className="font-semibold text-[var(--foreground)] mb-1">You're subscribed!</p>
         <p className="text-sm text-[var(--muted)]">Thanks for joining. We'll send you the best China travel tips weekly.</p>
       </div>
     );
   }
 
   if (variant === 'compact') {
     return (
       <div className="rounded-xl bg-gradient-to-br from-[var(--primary)]/5 to-[var(--gold)]/5 border border-[var(--border)] p-4">
         <p className="text-sm font-semibold text-[var(--foreground)] mb-2">{title}</p>
         <form onSubmit={handleSubmit} className="flex gap-2">
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="your@email.com"
             required
             className="flex-1 px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[var(--background)]"
           />
           <button type="submit" className="px-3 py-2 bg-[var(--primary)] text-white rounded-lg text-sm hover:bg-[var(--primary-hover)]">
             <ArrowRight className="w-4 h-4" />
           </button>
         </form>
       </div>
     );
   }
 
   return (
     <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)]/5 via-[var(--gold)]/5 to-[var(--background)] border border-[var(--border)] p-8 md:p-10 text-center relative overflow-hidden">
       <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[var(--primary)]/5 blur-3xl -translate-y-1/2 translate-x-1/4" />
       <div className="relative">
         <Mail className="w-10 h-10 mx-auto mb-4 text-[var(--primary)]" />
         <h3 className="text-xl font-semibold mb-2">{title}</h3>
         <p className="text-[var(--muted)] max-w-md mx-auto mb-6 text-sm leading-relaxed">{description}</p>
         <form onSubmit={handleSubmit} className="max-w-sm mx-auto flex gap-2">
           <input
             type="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             placeholder="your@email.com"
             required
             className="flex-1 px-4 py-2.5 border border-[var(--border)] rounded-lg bg-[var(--background)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
           />
           <button
             type="submit"
             className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors whitespace-nowrap"
           >
             Subscribe
           </button>
         </form>
         <p className="text-xs text-[var(--muted)] mt-3">No spam. Unsubscribe anytime.</p>
       </div>
     </div>
   );
 }
