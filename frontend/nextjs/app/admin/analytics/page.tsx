'use client';

import { Users, TrendingUp, BookOpen, FileText, Eye, Target } from 'lucide-react';

// Demo chart data
const userGrowth = [
  { month: 'Oct', value: 380 }, { month: 'Nov', value: 520 }, { month: 'Dec', value: 640 },
  { month: 'Jan', value: 890 }, { month: 'Feb', value: 1120 }, { month: 'Mar', value: 1340 },
];

const topPosts = [
  { title: 'Understanding Order Flow in Forex', views: 1205 },
  { title: 'NFP Week Trading Strategy', views: 876 },
  { title: 'EURUSD Weekly Forecast', views: 342 },
  { title: 'Supply and Demand Basics', views: 298 },
  { title: 'Psychology of a Winning Trader', views: 245 },
];

export default function AdminAnalyticsPage() {
  const maxGrowth = Math.max(...userGrowth.map((d) => d.value));
  const completionRate = 72;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Platform performance and engagement metrics</p>
      </div>

      {/* Top row KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI icon={Users} label="Total Users" value="2,847" change="+12.4%" up />
        <KPI icon={Eye} label="Blog Views" value="8,392" change="+23.1%" up />
        <KPI icon={BookOpen} label="Completion Rate" value="72%" change="+3.2%" up />
        <KPI icon={TrendingUp} label="PAMM AUM" value="$281K" change="+8.7%" up />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* User growth chart */}
        <div className="bg-surface-100 rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> User Growth (6 months)
          </h3>
          <div className="flex items-end gap-3 h-40">
            {userGrowth.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500">{d.value}</span>
                <div
                  className="w-full bg-gradient-to-t from-blue-500/40 to-blue-400/20 rounded-t-lg border border-blue-400/20 transition-all"
                  style={{ height: `${(d.value / maxGrowth) * 100}%` }}
                />
                <span className="text-[10px] text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson completion donut */}
        <div className="bg-surface-100 rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Lesson Completion Rate
          </h3>
          <div className="flex items-center justify-center h-40">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3"
                  strokeDasharray={`${completionRate} ${100 - completionRate}`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-emerald-400">{completionRate}%</span>
                <span className="text-[10px] text-slate-500">Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top posts + AdSense placeholder */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-surface-100 rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400" /> Top Blog Posts
          </h3>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-5 text-right">{i + 1}.</span>
                <span className="flex-1 text-sm text-slate-300 truncate">{post.title}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {post.views.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-100 rounded-2xl border border-white/5 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">AdSense Performance</h3>
          <div className="flex items-center justify-center h-40 border-2 border-dashed border-white/10 rounded-xl">
            <div className="text-center">
              <p className="text-sm text-slate-500">AdSense integration</p>
              <p className="text-xs text-slate-600 mt-1">Connect Google AdSense to view revenue metrics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, label, value, change, up }: { icon: any; label: string; value: string; change: string; up: boolean }) {
  return (
    <div className="bg-surface-100 rounded-2xl border border-white/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <span className="text-xs text-slate-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className={`text-xs mt-1 ${up ? 'text-emerald-400' : 'text-red-400'}`}>{change}</p>
    </div>
  );
}
