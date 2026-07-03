'use client';

import { useState } from 'react';
import { Share2, Check, Link2, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  compact?: boolean;
}

export default function ShareButtons({ title, url, description, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description || title, url: shareUrl });
      } catch { /* User cancelled */ }
    } else {
      handleCopyLink();
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleWebShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                   border border-[var(--border)] hover:bg-[var(--card-hover)] transition-colors
                   text-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Share this page"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[var(--muted)] font-medium mr-1">Share:</span>

      <button
        onClick={handleWebShare}
        className="p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Share via native share"
      >
        <Share2 className="w-5 h-5" />
      </button>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#1877F2]/10 transition-colors text-[#1877F2]"
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      </a>

      {/* X (Twitter) */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[var(--foreground)]"
        aria-label="Share on X (Twitter)"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg hover:bg-[#25D366]/10 transition-colors text-[#25D366]"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors text-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label="Copy link"
      >
        {copied ? <Check className="w-5 h-5 text-green-500" /> : <Link2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
