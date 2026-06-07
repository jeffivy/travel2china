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

export async function getCommentsByArticle(articleSlug: string): Promise<Comment[]> {
  const comments = await getAll<Comment>(
    `SELECT * FROM comments
     WHERE article_slug = ? AND is_approved = 1 AND is_spam = 0
     ORDER BY created_at DESC`,
    [articleSlug]
  );

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

export async function createComment(input: CreateCommentInput): Promise<Comment | null> {
  const result = await getDb().execute({
    sql: `INSERT INTO comments (article_slug, author_name, author_email, author_image, content, parent_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      input.article_slug,
      input.author_name,
      input.author_email || '',
      input.author_image || '',
      input.content,
      input.parent_id || null,
    ],
  });

  if (result.lastInsertRowid) {
    return (await getOne<Comment>('SELECT * FROM comments WHERE id = ?', [Number(result.lastInsertRowid)])) || null;
  }
  return null;
}

export async function likeComment(commentId: number, userEmail: string): Promise<{ liked: boolean; likes: number }> {
  const existing = await getOne<{ id: number }>(
    'SELECT id FROM comment_likes WHERE comment_id = ? AND user_email = ?',
    [commentId, userEmail]
  );

  if (existing) {
    await getDb().execute({ sql: 'DELETE FROM comment_likes WHERE comment_id = ? AND user_email = ?', args: [commentId, userEmail] });
    await getDb().execute({ sql: 'UPDATE comments SET likes = MAX(0, likes - 1) WHERE id = ?', args: [commentId] });
  } else {
    await getDb().execute({ sql: 'INSERT INTO comment_likes (comment_id, user_email) VALUES (?, ?)', args: [commentId, userEmail] });
    await getDb().execute({ sql: 'UPDATE comments SET likes = likes + 1 WHERE id = ?', args: [commentId] });
  }

  const updated = await getOne<{ likes: number }>('SELECT likes FROM comments WHERE id = ?', [commentId]);
  return { liked: !existing, likes: updated?.likes || 0 };
}

export async function getAllComments(): Promise<Comment[]> {
  return getAll<Comment>(`SELECT * FROM comments ORDER BY created_at DESC LIMIT 200`);
}

export async function approveComment(id: number): Promise<void> {
  await getDb().execute({ sql: 'UPDATE comments SET is_approved = 1 WHERE id = ?', args: [id] });
}

export async function markCommentAsSpam(id: number): Promise<void> {
  await getDb().execute({ sql: 'UPDATE comments SET is_spam = 1, is_approved = 0 WHERE id = ?', args: [id] });
}

export async function deleteComment(id: number): Promise<void> {
  await getDb().execute({ sql: 'DELETE FROM comments WHERE parent_id = ?', args: [id] });
  await getDb().execute({ sql: 'DELETE FROM comment_likes WHERE comment_id = ?', args: [id] });
  await getDb().execute({ sql: 'DELETE FROM comments WHERE id = ?', args: [id] });
}

export async function getCommentCounts(): Promise<{ article_slug: string; count: number }[]> {
  return getAll(
    `SELECT article_slug, COUNT(*) as count FROM comments WHERE is_approved = 1 AND is_spam = 0 GROUP BY article_slug`
  );
}
