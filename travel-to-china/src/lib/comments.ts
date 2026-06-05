import { getDb, getAll, getOne } from './db';

export interface Comment {
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
  updated_at: string;
  replies?: Comment[];
}

export interface CreateCommentInput {
  article_slug: string;
  author_name: string;
  author_email?: string;
  author_image?: string;
  content: string;
  parent_id?: number | null;
}

// Get comments for an article (top-level + nested)
export function getCommentsByArticle(articleSlug: string): Comment[] {
  const comments = getAll<Comment>(
    `SELECT * FROM comments
     WHERE article_slug = ? AND is_approved = 1 AND is_spam = 0
     ORDER BY created_at DESC`,
    [articleSlug]
  );

  // Build nested structure
  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = comments.filter((c) => c.parent_id);

  topLevel.forEach((comment) => {
    comment.replies = findReplies(comment.id, replies);
  });

  return topLevel;
}

function findReplies(parentId: number, allReplies: Comment[]): Comment[] {
  return allReplies
    .filter((r) => r.parent_id === parentId)
    .map((r) => ({
      ...r,
      replies: findReplies(r.id, allReplies),
    }));
}

// Create a comment
export function createComment(input: CreateCommentInput): Comment | null {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO comments (article_slug, author_name, author_email, author_image, content, parent_id)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  const result = stmt.run(
    input.article_slug,
    input.author_name,
    input.author_email || '',
    input.author_image || '',
    input.content,
    input.parent_id || null
  );

  if (result.lastInsertRowid) {
    return getOne<Comment>('SELECT * FROM comments WHERE id = ?', [result.lastInsertRowid]) || null;
  }
  return null;
}

// Like a comment
export function likeComment(commentId: number, userEmail: string): { liked: boolean; likes: number } {
  const db = getDb();
  const existing = getOne<{ id: number }>(
    'SELECT id FROM comment_likes WHERE comment_id = ? AND user_email = ?',
    [commentId, userEmail]
  );

  if (existing) {
    // Unlike
    db.prepare('DELETE FROM comment_likes WHERE comment_id = ? AND user_email = ?').run(commentId, userEmail);
    db.prepare('UPDATE comments SET likes = MAX(0, likes - 1) WHERE id = ?').run(commentId);
  } else {
    // Like
    db.prepare('INSERT INTO comment_likes (comment_id, user_email) VALUES (?, ?)').run(commentId, userEmail);
    db.prepare('UPDATE comments SET likes = likes + 1 WHERE id = ?').run(commentId);
  }

  const updated = getOne<{ likes: number }>('SELECT likes FROM comments WHERE id = ?', [commentId]);
  return {
    liked: !existing,
    likes: updated?.likes || 0,
  };
}

// Get all comments (for admin)
export function getAllComments(): Comment[] {
  return getAll<Comment>(
    `SELECT * FROM comments ORDER BY created_at DESC LIMIT 200`
  );
}

// Approve a comment
export function approveComment(id: number): void {
  getDb().prepare('UPDATE comments SET is_approved = 1 WHERE id = ?').run(id);
}

// Mark as spam
export function markCommentAsSpam(id: number): void {
  getDb().prepare('UPDATE comments SET is_spam = 1, is_approved = 0 WHERE id = ?').run(id);
}

// Delete a comment
export function deleteComment(id: number): void {
  // Delete replies first
  getDb().prepare('DELETE FROM comments WHERE parent_id = ?').run(id);
  getDb().prepare('DELETE FROM comment_likes WHERE comment_id = ?').run(id);
  getDb().prepare('DELETE FROM comments WHERE id = ?').run(id);
}

// Get comment count per article
export function getCommentCounts(): { article_slug: string; count: number }[] {
  return getAll(
    `SELECT article_slug, COUNT(*) as count FROM comments WHERE is_approved = 1 AND is_spam = 0 GROUP BY article_slug`
  );
}
