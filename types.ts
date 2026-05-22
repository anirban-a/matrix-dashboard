
export enum MineralType {
  BASALT = 'Basalt',
  GRANITE = 'Granite',
  OLIVINE = 'Olivine'
}

export interface SpectrumPoint {
  mz: number;
  intensity: number;
  type: MineralType;
}

export interface DashboardState {
  selectedMinerals: MineralType[];
  temperature: number;
  intensityCutoff: number;
  binWidth: number;
  peakTolerance: number;
  showRelativeAbundance: boolean;
}

export interface SummaryStats {
  totalPeaks: number;
  uniquePeaks: number;
  commonPeaks: number;
  highestIntensity: number;
}
