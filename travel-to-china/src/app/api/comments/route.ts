import { NextRequest, NextResponse } from 'next/server';
import { getCommentsByArticle, createComment, likeComment, getAllComments, approveComment, markCommentAsSpam, deleteComment } from '@/lib/comments';

// GET /api/comments?article=slug
export async function GET(request: NextRequest) {
  const articleSlug = request.nextUrl.searchParams.get('article');
  const admin = request.nextUrl.searchParams.get('admin');

  if (admin === 'true') {
    const comments = getAllComments();
    return NextResponse.json({ comments });
  }

  if (articleSlug) {
    const comments = getCommentsByArticle(articleSlug);
    return NextResponse.json({ comments });
  }

  return NextResponse.json({ error: 'article or admin parameter required' }, { status: 400 });
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { article_slug, author_name, author_email, author_image, content, parent_id } = body;

    if (!article_slug || !author_name || !content) {
      return NextResponse.json({ error: 'article_slug, author_name, and content are required' }, { status: 400 });
    }

    if (content.trim().length < 2) {
      return NextResponse.json({ error: 'Comment is too short' }, { status: 400 });
    }

    const comment = createComment({
      article_slug,
      author_name,
      author_email: author_email || '',
      author_image: author_image || '',
      content: content.trim(),
      parent_id: parent_id || null,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}

// PUT /api/comments (like, approve, spam, delete)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, userEmail, action } = body;

    if (action === 'like') {
      if (!commentId || !userEmail) {
        return NextResponse.json({ error: 'commentId and userEmail required' }, { status: 400 });
      }
      const result = likeComment(commentId, userEmail);
      return NextResponse.json(result);
    }

    if (action === 'approve') {
      approveComment(commentId);
      return NextResponse.json({ success: true });
    }

    if (action === 'spam') {
      markCommentAsSpam(commentId);
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      deleteComment(commentId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
