import { useState, useRef, useEffect, useCallback } from 'react';
import type { CurrentSong, Song } from '../system/types';
import { PLAYLIST } from '../system/constants';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<CurrentSong>({
    title: "Select a song",
    artist: "Spotify",
    duration: 0,
    currentTime: 0,
    audioUrl: ""
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentSong(prev => ({
          ...prev,
          currentTime: Math.floor(audioRef.current!.currentTime)
        }));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentSong(prev => ({
        ...prev,
        currentTime: 0
      }));
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setCurrentSong(prev => ({
          ...prev,
          duration: Math.floor(audioRef.current!.duration)
        }));
      }
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.pause();
      }
    };
  }, []);

  const handleSongSelect = useCallback((song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      audioRef.current.src = song.audioUrl;
      audioRef.current.load();
      
      setCurrentSong({
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        currentTime: 0,
        audioUrl: song.audioUrl
      });
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [isPlaying]);

  const handleSkipForward = useCallback(() => {
    const currentIndex = PLAYLIST.findIndex(song => song.audioUrl === currentSong.audioUrl);
    if (currentIndex < PLAYLIST.length - 1) {
      handleSongSelect(PLAYLIST[currentIndex + 1]);
    } else {
      handleSongSelect(PLAYLIST[0]);
    }
  }, [currentSong.audioUrl, handleSongSelect]);

  const handleSkipBack = useCallback(() => {
    const currentIndex = PLAYLIST.findIndex(song => song.audioUrl === currentSong.audioUrl);
    if (currentIndex > 0) {
      handleSongSelect(PLAYLIST[currentIndex - 1]);
    } else {
      handleSongSelect(PLAYLIST[PLAYLIST.length - 1]);
    }
  }, [currentSong.audioUrl, handleSongSelect]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && currentSong.duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * currentSong.duration;
      audioRef.current.currentTime = newTime;
      setCurrentSong(prev => ({
        ...prev,
        currentTime: Math.floor(newTime)
      }));
    }
  }, [currentSong.duration]);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    audioRef,
    isPlaying,
    currentSong,
    handleSongSelect,
    togglePlayPause,
    handleSkipForward,
    handleSkipBack,
    handleProgressClick,
    setVolume,
    formatTime,
    playlist: PLAYLIST
  };
}
