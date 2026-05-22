
import React from 'react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 md:p-16">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-2 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Scientific Documentation</h1>
          <p className="text-slate-400 text-lg">Understanding Mineral Differentiation and MATRIX Logic Models</p>
        </header>

        <section className="space-y-12">
          {/* Mineral Differentiation */}
          <article>
            <h2 className="text-2xl font-bold text-white mb-4">What is Mineral Differentiation?</h2>
            <div className="bg-slate-800/40 border-l-4 border-cyan-500 p-6 rounded-r-xl mb-6">
              <p className="italic text-slate-300 leading-relaxed">
                Mineral differentiation is the geological process by which a homogeneous chemical system (usually a magma or hydrothermal fluid) separates into chemically distinct mineral phases.
              </p>
            </div>
            <div className="prose prose-invert prose-slate max-w-none space-y-4">
              <p>
                In the context of Mass Spectrometry (MS), we use this differentiation to identify the "fingerprint" of specific minerals based on their mass-to-charge ($m/z$) ratio. As minerals crystallize from a melt, they selectively incorporate different elements and isotopes.
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400">
                <li><span className="text-slate-200 font-medium">Fractional Crystallization:</span> The removal of early-formed crystals from a magma, changing the remaining melt's composition.</li>
                <li><span className="text-slate-200 font-medium">Isotopic Fractionation:</span> The separation of isotopes based on their mass during physical or chemical processes.</li>
                <li><span className="text-slate-200 font-medium">Trace Element Partitioning:</span> How specific elements (like Rare Earth Elements) distribute between solid and liquid phases.</li>
              </ul>
            </div>
          </article>

          {/* Logic Behind Plot Generation */}
          <article>
            <h2 className="text-2xl font-bold text-white mb-4">Plot Generation Logic</h2>
            <p className="text-slate-400 mb-6">
              The MATRIX dashboard uses a deterministic-random hybrid model to simulate Mass Spectrometry data. The core logic resides in <code>data/mockData.ts</code>.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs mono text-cyan-400">01</span>
                  Gaussian Peak Modeling
                </h3>
                <p className="text-slate-400 mb-4">
                  Every "peak" in the visualization is not a single point, but a mathematical distribution. We use the Gaussian function to simulate the physical limitations of mass analyzers:
                </p>
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 mb-4 overflow-x-auto">
                  <code className="mono text-cyan-400 text-sm">
                    Intensity = Height * exp( -((x - mz)^2) / (2 * sigma^2) )
                  </code>
                </div>
                <p className="text-slate-400 text-sm">
                  Where <span className="mono text-slate-200">mz</span> is the theoretical mass, <span className="mono text-slate-200">Height</span> is the abundance, and <span className="mono text-slate-200">sigma</span> controls the resolution (peak width).
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs mono text-cyan-400">02</span>
                  Mineral-Specific Seeding
                </h3>
                <p className="text-slate-400 mb-4">
                  To differentiate Basalt, Granite, and Olivine, we apply a unique <span className="italic">scaling seed</span> to each mineral's peak list:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <li className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <span className="block text-cyan-400 font-bold mb-1">Basalt</span>
                    <span className="text-xs text-slate-500">Seed: 1.1x</span>
                    <p className="text-xs mt-2 text-slate-400">Simulates high Iron/Magnesium content with shifted mz peaks.</p>
                  </li>
                  <li className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <span className="block text-pink-400 font-bold mb-1">Granite</span>
                    <span className="text-xs text-slate-500">Seed: 1.5x</span>
                    <p className="text-xs mt-2 text-slate-400">Models Silica-rich composition with higher mass dispersion.</p>
                  </li>
                  <li className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                    <span className="block text-emerald-400 font-bold mb-1">Olivine</span>
                    <span className="text-xs text-slate-500">Seed: 1.9x</span>
                    <p className="text-xs mt-2 text-slate-400">Represents extreme Magnesium enrichment in the mantle.</p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-xs mono text-cyan-400">03</span>
                  Baseline Noise & Common Peaks
                </h3>
                <p className="text-slate-400">
                  Real-world instruments never produce clean zero-values. We simulate this by:
                </p>
                <ol className="list-decimal list-inside mt-4 space-y-2 text-slate-400 text-sm">
                  <li>Generating <span className="mono text-slate-200">Math.random() * 1e6</span> floor noise across the entire spectrum.</li>
                  <li>Injecting <span className="font-medium text-slate-200">Common Peaks</span> at fixed mz values (e.g., 450 $m/z$) to simulate atmospheric contamination or calibration standards.</li>
                </ol>
              </div>
            </div>
          </article>

          <footer className="pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Developed for the Mineralogy Research Laboratory &copy; 2025
            </p>
          </footer>
        </section>
      </div>
    </div>
  );
}
