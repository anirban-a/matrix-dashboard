
import React from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, trend }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between group hover:border-slate-500 transition-colors">
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-white mono">{value}</h4>
        {trend && <p className="text-emerald-400 text-xs mt-1">↑ {trend} from baseline</p>}
      </div>
      <div className="p-3 bg-slate-900 rounded-lg text-slate-400 group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
    </div>
  );
};
