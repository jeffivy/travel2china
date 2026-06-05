'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  BarChart3, Eye, Users, Search, MessageSquare, Mail,
  Clock, Loader2, ShieldAlert, CheckCircle, XCircle,
} from 'lucide-react';

interface DashboardData {
  summary: {
    totalPageViews: number;
    uniqueVisitors: number;
    todayPageViews: number;
    totalComments: number;
    totalSearches: number;
    totalSubscribers: number;
  };
  dailyPageViews: { date: string; count: number }[];
  dailyUniqueVisitors: { date: string; count: number }[];
  popularContent: { page_path: string; views: number }[];
  popularSearches: { query: string; count: number }[];
  comments: any[];
  subscribers: any[];
}

export default function AdminPage() {
  const { data: session } = useSession(); // Only for display — not required
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'overview' | 'comments' | 'subscribers'>('overview');

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/auth/check-admin');
      if (res.ok) {
        const json = await res.json();
        setIsAdmin(json.isAdmin);
        if (json.isAdmin) {
          fetchDashboard();
        } else {
          setLoading(false);
        }
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    } catch {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/stats/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error('Failed to fetch dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAction = async (id: number, action: string) => {
    try {
      await fetch('/api/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId: id, action }),
      });
      fetchDashboard();
    } catch (e) {
      console.error('Failed:', e);
    }
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="container-content py-20 text-center">
        <ShieldAlert className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-[var(--muted)] mb-6">
          Please sign in with your admin key to access the dashboard.
        </p>
        <a href="/auth/signin" className="btn-primary inline-flex text-sm">
          Sign In
        </a>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="container-wide py-10">
      <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-[var(--muted)] mb-8">Analytics, comments, and content management</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        {[
          { icon: Eye, label: 'Total PV', value: summary.totalPageViews.toLocaleString(), color: 'text-blue-500' },
          { icon: Users, label: 'Unique Visitors', value: summary.uniqueVisitors.toLocaleString(), color: 'text-green-500' },
          { icon: Clock, label: 'Today PV', value: summary.todayPageViews.toLocaleString(), color: 'text-orange-500' },
          { icon: MessageSquare, label: 'Comments', value: summary.totalComments.toLocaleString(), color: 'text-purple-500' },
          { icon: Search, label: 'Searches', value: summary.totalSearches.toLocaleString(), color: 'text-pink-500' },
          { icon: Mail, label: 'Subscribers', value: summary.totalSubscribers.toLocaleString(), color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[var(--muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[var(--border)] mb-6">
        {([
          { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
          { key: 'comments' as const, label: 'Comments', icon: MessageSquare },
          { key: 'subscribers' as const, label: 'Subscribers', icon: Mail },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? 'border-[var(--primary)] text-[var(--primary)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="space-y-8">
          {/* Daily PV Chart (simple table) */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Daily Page Views (Last 30 Days)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-[var(--border)]">
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Page Views</th>
                    <th className="py-2 font-medium">Visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {data.dailyPageViews.map((day) => (
                    <tr key={day.date} className="border-b border-[var(--border)]/50 hover:bg-[var(--card-hover)]">
                      <td className="py-2 pr-4">{day.date}</td>
                      <td className="py-2 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[200px] bg-[var(--border)] rounded-full h-2">
                            <div
                              className="bg-[var(--primary)] h-2 rounded-full"
                              style={{ width: `${Math.min(100, (day.count / Math.max(...data.dailyPageViews.map(d => d.count))) * 100)}%` }}
                            />
                          </div>
                          {day.count}
                        </div>
                      </td>
                      <td className="py-2 text-[var(--muted)]">
                        {data.dailyUniqueVisitors.find((v) => v.date === day.date)?.count || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Content */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Popular Pages</h3>
            <div className="space-y-2">
              {data.popularContent.slice(0, 15).map((page) => (
                <div key={page.page_path} className="flex items-center justify-between text-sm py-2 border-b border-[var(--border)]/50">
                  <span className="truncate pr-4">{page.page_path}</span>
                  <span className="font-semibold text-[var(--primary)] flex-shrink-0">{page.views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="card p-6">
            <h3 className="font-bold mb-4">Popular Search Queries</h3>
            <div className="flex flex-wrap gap-2">
              {data.popularSearches.map((s) => (
                <span key={s.query} className="px-3 py-1 text-sm bg-[var(--card-hover)] rounded-full">
                  {s.query} <span className="text-[var(--muted)]">({s.count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'comments' && (
        <div className="card p-6">
          <h3 className="font-bold mb-4">Comment Moderation ({data.comments.length})</h3>
          <div className="space-y-4">
            {data.comments.map((comment: any) => (
              <div key={comment.id} className="flex items-start justify-between gap-4 p-4 border border-[var(--border)] rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="text-sm">{comment.author_name}</strong>
                    <span className="text-xs text-[var(--muted)]">{comment.author_email}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${comment.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {comment.is_approved ? 'Approved' : 'Pending'}
                    </span>
                    {comment.is_spam ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">Spam</span> : null}
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-[var(--muted)] mt-1">{comment.article_slug} · {comment.created_at}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!comment.is_approved && (
                    <button onClick={() => handleCommentAction(comment.id, 'approve')} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleCommentAction(comment.id, 'spam')} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title="Mark spam">
                    <ShieldAlert className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleCommentAction(comment.id, 'delete')} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {data.comments.length === 0 && (
              <p className="text-center text-[var(--muted)] py-8">No comments yet.</p>
            )}
          </div>
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="card p-6">
          <h3 className="font-bold mb-4">Subscribers ({data.subscribers.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left">
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.subscribers.map((sub: any) => (
                  <tr key={sub.id} className="border-b border-[var(--border)]/50">
                    <td className="py-2 pr-4">{sub.email}</td>
                    <td className="py-2 pr-4">{sub.name || '-'}</td>
                    <td className="py-2 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        sub.status === 'unsubscribed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-2 text-[var(--muted)]">{sub.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
