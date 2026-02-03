export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: number;
  albumArt: string;
  audioUrl: string;
}

export interface CurrentSong {
  title: string;
  artist: string;
  duration: number;
  currentTime: number;
  audioUrl: string;
}

export type ToggleKey = 'wifi' | 'linkedin' | 'airplane' | 'flashlight' | 'autoRotate' | 'spotify' | 'github' | 'location';

export interface Toggles {
  wifi: boolean;
  linkedin: boolean;
  airplane: boolean;
  flashlight: boolean;
  autoRotate: boolean;
  spotify: boolean;
  github: boolean;
  location: boolean;
}

export interface QuickSettingTileProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}
