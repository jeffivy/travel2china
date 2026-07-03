 'use client';
 
 import { useState } from 'react';
 import { Share2, Check, Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';
 
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
   const encodedDesc = encodeURIComponent(description || title);
 
   const handleCopyLink = async () => {
     try {
       await navigator.clipboard.writeText(shareUrl);
       setCopied(true);
       setTimeout(() => setCopied(false), 2000);
     } catch {
       // Fallback
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
         await navigator.share({
           title,
           text: description || title,
           url: shareUrl,
         });
       } catch {
         // User cancelled or error
       }
     } else {
       // Web Share API not supported, copy link instead
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
 
       {/* Web Share (native share sheet on mobile) */}
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
         <Facebook className="w-5 h-5" />
       </a>
 
       {/* Twitter / X */}
       <a
         href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
         target="_blank"
         rel="noopener noreferrer"
         className="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-[var(--foreground)]"
         aria-label="Share on X (Twitter)"
       >
         <Twitter className="w-5 h-5" />
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
