'use client';

import { useState } from 'react';
import { Edit3, TrendingUp, TrendingDown, DollarSign, Users, Shield, BarChart3, Plus } from 'lucide-react';

interface Group { id: string; name: string; strategy_type: string; risk_level: string; minimum_investment: number; is_open: boolean; total_capital: number; investor_count: number; monthly_return: number; }

const demoGroups: Group[] = [
  { id: '1', name: 'Scalping Elite', strategy_type: 'scalping', risk_level: 'medium', minimum_investment: 500, is_open: true, total_capital: 125000, investor_count: 34, monthly_return: 8.3 },
  { id: '2', name: 'Swing Masters', strategy_type: 'swing', risk_level: 'low', minimum_investment: 300, is_open: true, total_capital: 89000, investor_count: 28, monthly_return: 5.2 },
  { id: '3', name: 'Hedge Shield', strategy_type: 'hedge', risk_level: 'low', minimum_investment: 200, is_open: true, total_capital: 67000, investor_count: 19, monthly_return: 3.1 },
];

const riskColor: Record<string, string> = {
  low: 'text-emerald-400', medium: 'text-amber-400', high: 'text-red-400', aggressive: 'text-red-500',
};

export default function AdminPammPage() {
  const [groups] = useState(demoGroups);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">PAMM Groups</h1>
          <p className="text-sm text-slate-400 mt-1">Manage trading groups, performance, and reports</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-dark-500 font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-brand-gold-light transition-colors">
          <Plus className="w-4 h-4" /> New Group
        </button>
      </div>

      <div className="grid gap-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-surface-100 rounded-2xl border border-white/5 p-6 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg">{group.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{group.strategy_type}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${riskColor[group.risk_level]}`}>
                    <Shield className="w-3 h-3" /> {group.risk_level} risk
                  </span>
                  <span className={`text-xs font-medium ${group.is_open ? 'text-emerald-400' : 'text-red-400'}`}>
                    {group.is_open ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-brand-gold transition-colors">
                <Edit3 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat icon={DollarSign} label="Total Capital" value={`$${group.total_capital.toLocaleString()}`} color="text-brand-gold" />
              <Stat icon={Users} label="Investors" value={group.investor_count.toString()} color="text-blue-400" />
              <Stat icon={group.monthly_return >= 0 ? TrendingUp : TrendingDown} label="Monthly Return" value={`${group.monthly_return > 0 ? '+' : ''}${group.monthly_return}%`} color={group.monthly_return >= 0 ? 'text-emerald-400' : 'text-red-400'} />
              <Stat icon={BarChart3} label="Min Investment" value={`$${group.minimum_investment}`} color="text-violet-400" />
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
              <button className="text-xs text-slate-500 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">Update Performance</button>
              <button className="text-xs text-slate-500 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">Log Trade</button>
              <button className="text-xs text-slate-500 hover:text-brand-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">Publish Report</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="bg-dark-500/50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
