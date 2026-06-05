'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MessageCircle, ThumbsUp, Reply } from 'lucide-react';
import { timeAgo } from '@/lib/utils';

interface CommentData {
  id: number;
  article_slug: string;
  author_name: string;
  author_email?: string;
  author_image?: string;
  content: string;
  parent_id: number | null;
  is_approved: number;
  likes: number;
  created_at: string;
  replies?: CommentData[];
}

export default function Comments({ articleSlug }: { articleSlug: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?article=${encodeURIComponent(articleSlug)}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [articleSlug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!session) {
      signIn();
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_slug: articleSlug,
          author_name: session.user?.name || 'Anonymous',
          author_email: session.user?.email || '',
          author_image: session.user?.image || '',
          content: newComment.trim(),
          parent_id: replyTo?.id || null,
        }),
      });

      if (res.ok) {
        setNewComment('');
        setReplyTo(null);
        await fetchComments();
      } else {
        const err = await res.json();
        setError(err.message || 'Failed to post comment');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: number) => {
    if (!session) {
      signIn();
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentId,
          userEmail: session.user?.email,
          action: 'like',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          updateCommentLike(prev, commentId, data.likes)
        );
      }
    } catch (e) {
      console.error('Like failed:', e);
    }
  };

  const updateCommentLike = (
    comments: CommentData[],
    commentId: number,
    newLikes: number
  ): CommentData[] => {
    return comments.map((c) => {
      if (c.id === commentId) return { ...c, likes: newLikes };
      if (c.replies) return { ...c, replies: updateCommentLike(c.replies, commentId, newLikes) };
      return c;
    });
  };

  const renderComment = (comment: CommentData, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-6 pl-4 border-l-2 border-[var(--border)]' : ''}`}>
      <div className="py-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 text-sm font-bold text-[var(--primary)]">
            {comment.author_image ? (
              <img src={comment.author_image} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              comment.author_name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm">{comment.author_name}</span>
              <span className="text-xs text-[var(--muted)]">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm text-[var(--foreground)]/90 mb-2 whitespace-pre-wrap">{comment.content}</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLike(comment.id)}
                className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                {comment.likes > 0 && comment.likes}
              </button>
              <button
                onClick={() => {
                  if (!session) { signIn(); return; }
                  setReplyTo({ id: comment.id, name: comment.author_name });
                }}
                className="inline-flex items-center gap-1 text-xs text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
              >
                <Reply className="w-3.5 h-3.5" /> Reply
              </button>
            </div>
          </div>
        </div>
      </div>
      {comment.replies?.map((reply) => renderComment(reply, depth + 1))}
    </div>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-[var(--primary)]" />
        Comments
        <span className="text-base font-normal text-[var(--muted)]">
          ({comments.length})
        </span>
      </h3>

      {/* Comment Form */}
      <div className="mt-6 mb-10">
        {replyTo && (
          <div className="flex items-center justify-between text-sm bg-[var(--primary)]/5 rounded-lg px-4 py-2 mb-3">
            <span>Replying to <strong>{replyTo.name}</strong></span>
            <button onClick={() => setReplyTo(null)} className="text-[var(--muted)] hover:text-[var(--primary)]">Cancel</button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={session ? 'Share your thoughts...' : 'Sign in to leave a comment...'}
            rows={3}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--background)] text-[var(--foreground)]
                       placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent
                       resize-none text-sm"
            disabled={!session}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end">
            {session ? (
              <button type="submit" disabled={submitting || !newComment.trim()} className="btn-primary text-sm">
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            ) : (
              <button type="button" onClick={() => signIn()} className="btn-primary text-sm">
                Sign In to Comment
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-[var(--muted)]">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-[var(--muted)]">
          <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
