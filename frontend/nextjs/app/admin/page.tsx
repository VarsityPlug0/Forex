'use client';

import { useState, useEffect } from 'react';
import {
  Users, FileText, GraduationCap, TrendingUp,
  Megaphone, ArrowUpRight, ArrowDownRight,
  Activity, Eye, BookOpen, DollarSign,
} from 'lucide-react';

interface DashboardStats {
  users: { total: number; active: number; recentSignups: number };
  content: { totalPosts: number; publishedPosts: number; totalCourses: number; totalLessons: number; lessonCompletions: number };
  pamm: { totalGroups: number; activeInvestments: number };
  announcements: number;
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch from API, fall back to demo data
    const fetchStats = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          const res = await fetch(`${API}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setStats(data.stats);
            setLoading(false);
            return;
          }
        }
      } catch (_) {}

      // Demo data fallback
      setStats({
        users: { total: 2847, active: 1923, recentSignups: 124 },
        content: { totalPosts: 48, publishedPosts: 42, totalCourses: 7, totalLessons: 52, lessonCompletions: 1283 },
        pamm: { totalGroups: 3, activeInvestments: 89 },
        announcements: 5,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-100 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Total Users', value: stats.users.total.toLocaleString(), icon: Users, change: `+${stats.users.recentSignups} this month`, up: true, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Active Users', value: stats.users.active.toLocaleString(), icon: Activity, change: `${Math.round((stats.users.active / stats.users.total) * 100)}% of total`, up: true, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Published Posts', value: stats.content.publishedPosts.toString(), icon: FileText, change: `${stats.content.totalPosts} total`, up: true, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Total Courses', value: stats.content.totalCourses.toString(), icon: GraduationCap, change: `${stats.content.totalLessons} lessons`, up: true, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Lesson Completions', value: stats.content.lessonCompletions.toLocaleString(), icon: BookOpen, change: 'All time', up: true, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'PAMM Groups', value: stats.pamm.totalGroups.toString(), icon: TrendingUp, change: `${stats.pamm.activeInvestments} active investors`, up: true, color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
    { label: 'Active Investments', value: stats.pamm.activeInvestments.toString(), icon: DollarSign, change: 'Across all groups', up: true, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Announcements', value: stats.announcements.toString(), icon: Megaphone, change: 'Active', up: true, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Platform statistics and key metrics</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-surface-100 rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.up ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <p className="text-2xl font-bold text-white">{card.value}</p>
              <p className="text-xs text-slate-500 mt-1">{card.label}</p>
              <p className="text-[11px] text-slate-600 mt-0.5">{card.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <QuickAction href="/admin/blog" title="New Blog Post" description="Write and publish articles" icon={FileText} />
        <QuickAction href="/admin/academy" title="Manage Courses" description="Add lessons and modules" icon={GraduationCap} />
        <QuickAction href="/admin/announcements" title="Post Announcement" description="Send updates to users" icon={Megaphone} />
      </div>
    </div>
  );
}

function QuickAction({ href, title, description, icon: Icon }: { href: string; title: string; description: string; icon: any }) {
  return (
    <a href={href} className="bg-surface-100 rounded-2xl p-5 border border-white/5 hover:border-brand-gold/20 transition-all group cursor-pointer block">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
          <Icon className="w-5 h-5 text-brand-gold" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{title}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </a>
  );
}
