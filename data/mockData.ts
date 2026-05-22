
import { MineralType, SpectrumPoint } from '../types';

const generatePeak = (mz: number, height: number, sigma: number, type: MineralType): SpectrumPoint[] => {
  const points: SpectrumPoint[] = [];
  // Generate a small Gaussian peak
  for (let i = -5; i <= 5; i += 0.2) {
    const x = mz + i * 0.1;
    const intensity = height * Math.exp(-(Math.pow(x - mz, 2) / (2 * Math.pow(sigma, 2))));
    points.push({ mz: Number(x.toFixed(2)), intensity, type });
  }
  return points;
};

export const generateMockSpectra = (selectedMinerals: MineralType[]): SpectrumPoint[] => {
  let data: SpectrumPoint[] = [];

  // Seed for reproducibility
  // Fixed: changed parameter type from number to MineralType to fix comparison and assignment errors
  const seed = (m: MineralType) => {
    if (m === MineralType.BASALT) return 1.1;
    if (m === MineralType.GRANITE) return 1.5;
    return 1.9;
  };

  selectedMinerals.forEach((mineral) => {
    const s = seed(mineral);
    // Base floor noise
    for (let mz = 50; mz < 800; mz += 1) {
      data.push({ mz, intensity: Math.random() * 1e6, type: mineral });
    }

    // Significant Peaks
    const peaks = [
      { mz: 70 * s, h: 4e8 * s, w: 0.5 },
      { mz: 120 * s, h: 8e8 / s, w: 0.8 },
      { mz: 150 * s, h: 3e8 * s, w: 0.4 },
      { mz: 220 * s, h: 2e8, w: 1.2 },
      { mz: 450, h: 1e8, w: 0.5 }, // Common peak for all
    ];

    peaks.forEach(p => {
      data = [...data, ...generatePeak(p.mz, p.h, p.w, mineral)];
    });
  });

  return data.sort((a, b) => a.mz - b.mz);
};
