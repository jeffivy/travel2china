// Utility functions
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

// Generate a visitor ID (simple fingerprint)
export function generateVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  const stored = localStorage.getItem('visitor_id');
  if (stored) return stored;
  const id = 'visitor_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  localStorage.setItem('visitor_id', id);
  return id;
}

// Generate a session ID
export function generateSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  const stored = sessionStorage.getItem('session_id');
  if (stored) return stored;
  const id = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  sessionStorage.setItem('session_id', id);
  return id;
}

// Format date
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format relative time
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(dateString);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).replace(/\s+\S*$/, '') + '...';
}

// Estimate reading time
export function readingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Highlight search terms in text
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>');
}

// Slugify
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
