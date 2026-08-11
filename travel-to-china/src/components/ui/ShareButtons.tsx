'use client';

import { useState, useCallback } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url?: string;
  description?: string;
  compact?: boolean;
}

export default function ShareButtons({ title, url, description, compact }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = useCallback(() => {
    if (url) return url;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  }, [url]);

  const shareUrl = getShareUrl();
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

  const shareLinks = [
    {
      name: 'X',
      label: 'Twitter / X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: '#0f1419',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'Reddit',
      label: 'Reddit',
      href: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color: '#FF4500',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547.8-3.747c1.058.073 1.907.579 2.463 1.312a1.25 1.25 0 0 1 .582-1.323zm-10.02 0c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547.8-3.747c1.058.073 1.907.579 2.463 1.312a1.25 1.25 0 0 1 .582-1.323zM12 7.5c3.316 0 6.057 1.824 7.262 4.502.34.758.473 1.589.406 2.408-.085 1.04-.526 1.958-1.24 2.638-.713.68-1.654 1.08-2.636 1.122-1.048.044-2.074-.288-2.886-.934-1.622.358-3.304.358-4.926 0-.812.646-1.838.978-2.886.934-.982-.041-1.923-.442-2.636-1.122-.714-.68-1.155-1.598-1.24-2.638a5.27 5.27 0 0 1 .406-2.408C5.943 9.324 8.684 7.5 12 7.5zM9.5 13.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm5 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zm-5.91 3.91c.22.221.506.377.816.446.31.07.63.04.916-.085.286-.126.534-.316.712-.556a.75.75 0 1 1 1.232.856 2.8 2.8 0 0 1-1.066.848 2.8 2.8 0 0 1-1.374.127 2.8 2.8 0 0 1-1.222-.668.75.75 0 1 1 1.006-1.12z"/>
        </svg>
      ),
    },
    {
      name: 'Pinterest',
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      color: '#E60023',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0a12 12 0 0 0-4.73 23.09c-.05-.55-.01-1.21.12-1.8l.88-3.73s-.22-.44-.22-1.08c0-1.02.6-1.78 1.33-1.78.63 0 .93.47.93 1.04 0 .63-.4 1.57-.6 2.44-.17.72.36 1.3 1.06 1.3 1.28 0 2.14-1.64 2.14-3.59 0-1.48-1.0-2.59-2.81-2.59-2.05 0-3.33 1.53-3.33 3.24 0 .59.17 1 .43 1.29.12.14.13.2.09.37-.03.12-.1.4-.13.52-.04.16-.15.22-.27.16-.76-.31-1.1-1.14-1.1-2.07 0-1.54 1.3-3.39 3.88-3.39 2.07 0 3.44 1.5 3.44 3.11 0 2.13-1.19 3.73-2.94 3.73-.59 0-1.14-.32-1.33-.68l-.36 1.45c-.12.45-.43 1.02-.64 1.37A12 12 0 1 0 12 0z"/>
        </svg>
      ),
    },
  ];

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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--muted)] mr-1 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>

      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${link.label}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full
                     border border-[var(--border)] text-[var(--muted)]
                     hover:border-current hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]
                     transition-all"
        >
          {link.icon}
          <span className="hidden sm:inline">{link.label}</span>
        </a>
      ))}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full
                   border border-[var(--border)] text-[var(--muted)]
                   hover:border-current hover:text-[var(--foreground)] hover:bg-[var(--card-hover)]
                   transition-all"
        aria-label="Copy link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="hidden sm:inline text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-4 h-4" />
            <span className="hidden sm:inline">Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
