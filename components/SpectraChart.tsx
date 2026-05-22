
'use client';

import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { MineralType, SpectrumPoint } from '../types';

interface SpectraChartProps {
  data: SpectrumPoint[];
  title: string;
  colors: Record<MineralType, string>;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-slate-400 text-xs mb-1 font-mono">m/z: {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toExponential(2)}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SpectraChart: React.FC<SpectraChartProps> = ({ data, title, colors, height = 350 }) => {
  const chartData = useMemo(() => {
    const mzMap: Record<number, any> = {};
    data.forEach(p => {
      if (!mzMap[p.mz]) {
        mzMap[p.mz] = { mz: p.mz };
      }
      mzMap[p.mz][p.type] = p.intensity;
    });
    return Object.values(mzMap).sort((a, b) => a.mz - b.mz);
  }, [data]);

  const activeMinerals = useMemo(() => {
    const types = new Set<MineralType>();
    data.forEach(p => types.add(p.type));
    return Array.from(types);
  }, [data]);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 shadow-inner transition-all hover:bg-slate-800/70">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-100 tracking-tight">{title}</h3>
        <div className="text-xs text-slate-500 font-mono">Unit: Intensity (counts)</div>
      </div>
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              {activeMinerals.map(m => (
                <linearGradient key={`grad-${m}`} id={`color-${m}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[m]} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={colors[m]} stopOpacity={0}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="mz" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              label={{ value: 'm/z', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => value === 0 ? '0' : value.toExponential(0)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            {activeMinerals.map(m => (
              <Area
                key={m}
                type="monotone"
                dataKey={m}
                stroke={colors[m]}
                fillOpacity={1}
                fill={`url(#color-${m})`}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
