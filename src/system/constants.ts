import type { Song } from './types';

export const PLAYLIST: Song[] = [
  { 
    id: 1, 
    title: "Blinding Lights", 
    artist: "The Weeknd", 
    duration: 200, 
    albumArt: "🎵",
    audioUrl: "https://www.youtube.com/watch?v=NWU33fvPxd0&list=RDsjN-NGsRg9g&index=6"
  },
  { 
    id: 2, 
    title: "Shape of You", 
    artist: "Ed Sheeran", 
    duration: 233, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  { 
    id: 3, 
    title: "Levitating", 
    artist: "Dua Lipa", 
    duration: 203, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  { 
    id: 4, 
    title: "Peaches", 
    artist: "Justin Bieber", 
    duration: 198, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  { 
    id: 5, 
    title: "Stay", 
    artist: "The Kid LAROI, Justin Bieber", 
    duration: 141, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  { 
    id: 6, 
    title: "Good 4 U", 
    artist: "Olivia Rodrigo", 
    duration: 178, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  { 
    id: 7, 
    title: "Montero", 
    artist: "Lil Nas X", 
    duration: 137, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  { 
    id: 8, 
    title: "Save Your Tears", 
    artist: "The Weeknd", 
    duration: 215, 
    albumArt: "🎵",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
];

export const DEFAULT_TOGGLES = {
  wifi: true,
  linkedin: false,
  airplane: true,
  flashlight: false,
  autoRotate: false,
  spotify: false,
  github: false,
  location: true
};

export const DEFAULT_BRIGHTNESS = 100;
export const DEFAULT_VOLUME = 70;
