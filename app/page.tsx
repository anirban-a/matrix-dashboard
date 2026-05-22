
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  MineralType, 
  DashboardState, 
  SpectrumPoint 
} from '../types';
import { generateMockSpectra } from '../data/mockData';
import { SpectraChart } from '../components/SpectraChart';
import { StatsCard } from '../components/StatsCard';

// Icons (SVG strings for simplicity)
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Adjustments: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  Peak: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  Database: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3V7c0-2-1.5-3-3.5-3h-9C5.5 4 4 5 4 7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12c0 2 1.5 3 3.5 3h9c2 0 3.5-1 3.5-3" /></svg>,
  Layers: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Doc: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
};

const MINERAL_COLORS: Record<MineralType, string> = {
  [MineralType.BASALT]: '#22d3ee', // Cyan 400
  [MineralType.GRANITE]: '#f472b6', // Pink 400
  [MineralType.OLIVINE]: '#34d399', // Emerald 400
};

export default function Dashboard() {
  const [state, setState] = useState<DashboardState>({
    selectedMinerals: [MineralType.BASALT, MineralType.GRANITE, MineralType.OLIVINE],
    temperature: 50,
    intensityCutoff: 1e6,
    binWidth: 0,
    peakTolerance: 5,
    showRelativeAbundance: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<SpectrumPoint[]>([]);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData = generateMockSpectra(state.selectedMinerals);
      setData(mockData);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedMinerals]);

  const toggleMineral = (m: MineralType) => {
    setState(prev => ({
      ...prev,
      selectedMinerals: prev.selectedMinerals.includes(m)
        ? prev.selectedMinerals.filter(x => x !== m)
        : [...prev.selectedMinerals, m]
    }));
  };

  const filteredData = useMemo(() => {
    return data.filter(p => p.intensity >= state.intensityCutoff);
  }, [data, state.intensityCutoff]);

  const uniquePeaks = useMemo(() => {
    return filteredData.filter((p, i) => i % 5 === 0);
  }, [filteredData]);

  const commonPeaks = useMemo(() => {
    return filteredData.filter(p => p.mz > 400 && p.mz < 500);
  }, [filteredData]);

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">M</div>
            <h1 className="text-xl font-bold tracking-tighter text-white">MATRIX</h1>
          </div>

          <nav className="space-y-1 mb-8">
            <Link href="/" className="flex items-center gap-3 w-full p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 font-medium transition-all">
              <Icons.Home /> Dashboard
            </Link>
            <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Icons.Search /> Spectra Search
            </button>
            <Link href="/docs" className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Icons.Doc /> Documentation
            </Link>
            <button className="flex items-center gap-3 w-full p-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all">
              <Icons.Adjustments /> Configuration
            </button>
          </nav>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Mineral Types</label>
              <div className="space-y-2">
                {Object.values(MineralType).map(m => (
                  <label key={m} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={state.selectedMinerals.includes(m)} 
                      onChange={() => toggleMineral(m)}
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${state.selectedMinerals.includes(m) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-700 bg-slate-800'}`}>
                      {state.selectedMinerals.includes(m) && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                    <span className={`ml-3 text-sm font-medium transition-colors ${state.selectedMinerals.includes(m) ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-400'}`}>
                      {m}
                    </span>
                    <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: MINERAL_COLORS[m] }}></div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3 block">Experiment Temp</label>
              <select 
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                value={state.temperature}
                onChange={e => setState(s => ({ ...s, temperature: Number(e.target.value) }))}
              >
                <option value={25}>25°C (Ambient)</option>
                <option value={50}>50°C (Moderate)</option>
                <option value={75}>75°C (Elevated)</option>
                <option value={100}>100°C (Boiling)</option>
              </select>
            </div>

            <button 
              onClick={loadData}
              disabled={isLoading}
              className={`w-full py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${isLoading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/5'}`}
            >
              {isLoading ? 'Processing...' : 'Sync Data'}
            </button>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-800">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700"></div>
             <div>
               <p className="text-xs font-bold text-slate-300">Dr. Sarah Chen</p>
               <p className="text-[10px] text-slate-500">Principal Investigator</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f172a] p-8">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Analytics Dashboard</h2>
            <p className="text-slate-400 text-sm">Visualizing mineral differentiation at {state.temperature}°C</p>
          </div>
          <div className="flex gap-3">
            <Link href="/docs" className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-700 transition-all flex items-center gap-2">
              <Icons.Doc />
              Scientific Documentation
            </Link>
            <button className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-sm hover:bg-slate-700 transition-all flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Export PDF
            </button>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
              New Experiment
            </button>
          </div>
        </header>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Analyzed Peaks" value={filteredData.length.toLocaleString()} icon={<Icons.Peak />} trend="12%" />
          <StatsCard label="Unique Signatures" value={uniquePeaks.length} icon={<Icons.Database />} />
          <StatsCard label="Common Overlaps" value={commonPeaks.length} icon={<Icons.Layers />} />
          <StatsCard label="Detection Floor" value="1.0e+6" icon={<Icons.Adjustments />} />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <SpectraChart 
              data={filteredData} 
              title="Global Overlay Spectra Visualization" 
              colors={MINERAL_COLORS} 
              height={450}
            />

            <div className="grid grid-cols-2 gap-6">
               <SpectraChart 
                data={uniquePeaks} 
                title="Unique Peak Distribution" 
                colors={MINERAL_COLORS} 
                height={280}
              />
              <SpectraChart 
                data={commonPeaks} 
                title="Baseline Common Overlaps" 
                colors={MINERAL_COLORS} 
                height={280}
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl sticky top-0">
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-4">Plot Controls</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-300">Intensity Cutoff</label>
                    <span className="mono text-xs text-cyan-400">{state.intensityCutoff.toExponential(1)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="10000000" 
                    step="500000" 
                    className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    value={state.intensityCutoff}
                    onChange={e => setState(s => ({ ...s, intensityCutoff: Number(e.target.value) }))}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-slate-500">Low</span>
                    <span className="text-[10px] text-slate-500">High Noise Reduction</span>
                  </div>
                </div>

                <div>
                   <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-300">Peak Tolerance (ppm)</label>
                    <span className="mono text-xs text-cyan-400">{state.peakTolerance}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1" 
                    className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    value={state.peakTolerance}
                    onChange={e => setState(s => ({ ...s, peakTolerance: Number(e.target.value) }))}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <span className="text-sm font-medium text-slate-200">Show Relative Abundance</span>
                  <button 
                    onClick={() => setState(s => ({ ...s, showRelativeAbundance: !s.showRelativeAbundance }))}
                    className={`w-10 h-5 rounded-full transition-all relative ${state.showRelativeAbundance ? 'bg-cyan-500' : 'bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${state.showRelativeAbundance ? 'left-6' : 'left-1'}`}></div>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Legend & Annotations</h4>
                  <div className="space-y-3">
                    {state.selectedMinerals.map(m => (
                      <div key={m} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: MINERAL_COLORS[m] }}></div>
                        <span className="text-sm text-slate-300">{m} Composition</span>
                        <span className="ml-auto mono text-xs text-slate-500">~24.5%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700">
                  <p className="text-xs text-slate-400 leading-relaxed italic mb-3">
                    "The current data suggests a significant deviation in Olivine peaks compared to baseline at 50°C. Consider re-sampling if tolerance exceeds 10ppm."
                  </p>
                  <Link href="/docs" className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-tighter flex items-center gap-1">
                    Learn about this logic 
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
