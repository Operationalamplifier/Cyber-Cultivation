export enum View {
  HOME = 'HOME',
  WOODEN_FISH = 'WOODEN_FISH',
  ROSE = 'ROSE',
  BANANA = 'BANANA',
  BEADS = 'BEADS',
  REPORT = 'REPORT',
}

export interface UserStats {
  woodenFishCount: number;
  rosePetalsTorn: number;
  bananaRubTimeSec: number;
  beadsCount: number;
  lastReportDate: string | null;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
}
