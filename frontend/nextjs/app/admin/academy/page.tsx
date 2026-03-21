'use client';

import { useState } from 'react';
import { Plus, Edit3, Trash2, GripVertical, BookOpen, ChevronDown, ChevronRight, Video, FileText, Eye, EyeOff } from 'lucide-react';

interface Lesson { id: string; title: string; slug: string; is_published: boolean; video_url?: string; }
interface CourseItem { id: string; title: string; slug: string; is_published: boolean; difficulty: string; lessons: Lesson[]; category?: { name: string }; }

const demoCourses: CourseItem[] = [
  { id: '1', title: 'Market Foundations', slug: 'market-foundations', is_published: true, difficulty: 'beginner', category: { name: 'Market Foundations' },
    lessons: [
      { id: 'l1', title: 'What is Forex?', slug: 'what-is-forex', is_published: true, video_url: 'https://...' },
      { id: 'l2', title: 'Currency Pairs Explained', slug: 'currency-pairs', is_published: true },
      { id: 'l3', title: 'How the Market Works', slug: 'how-market-works', is_published: false },
    ] },
  { id: '2', title: 'Risk Management', slug: 'risk-management', is_published: true, difficulty: 'intermediate', category: { name: 'Risk Management' },
    lessons: [
      { id: 'l4', title: 'Position Sizing', slug: 'position-sizing', is_published: true },
      { id: 'l5', title: 'Stop Loss Strategies', slug: 'stop-loss', is_published: true },
    ] },
  { id: '3', title: 'Trading Psychology', slug: 'trading-psychology', is_published: false, difficulty: 'advanced', category: { name: 'Trading Psychology' }, lessons: [] },
];

const diffBadge: Record<string, string> = {
  beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  advanced: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AdminAcademyPage() {
  const [courses, setCourses] = useState(demoCourses);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Academy</h1>
          <p className="text-sm text-slate-400 mt-1">Manage courses, modules, and lessons</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-dark-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold-light transition-colors">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      <div className="space-y-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-surface-100 rounded-2xl border border-white/5 overflow-hidden">
            {/* Course header */}
            <div className="p-5 flex items-center gap-3 cursor-pointer" onClick={() => toggle(course.id)}>
              <GripVertical className="w-4 h-4 text-slate-600 shrink-0" />
              {expanded[course.id] ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-white text-sm truncate">{course.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diffBadge[course.difficulty]}`}>{course.difficulty}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${course.is_published ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{course.lessons.length} lessons</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-brand-gold transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Lessons */}
            {expanded[course.id] && (
              <div className="border-t border-white/5">
                {course.lessons.map((lesson, i) => (
                  <div key={lesson.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] border-b border-white/[0.03] last:border-b-0">
                    <span className="text-xs text-slate-600 w-6 text-right">{i + 1}.</span>
                    {lesson.video_url ? <Video className="w-4 h-4 text-blue-400 shrink-0" /> : <FileText className="w-4 h-4 text-slate-500 shrink-0" />}
                    <span className="flex-1 text-sm text-slate-300 truncate">{lesson.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${lesson.is_published ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {lesson.is_published ? 'Live' : 'Draft'}
                    </span>
                    <button className="p-1.5 rounded hover:bg-white/5 text-slate-600 hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded hover:bg-red-500/10 text-slate-600 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-3 text-xs text-slate-500 hover:text-brand-gold hover:bg-white/[0.02] transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
