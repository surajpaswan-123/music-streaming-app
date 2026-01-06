import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { addToRecentlyPlayed } from '../services/recommendations';

const PlayerContext = createContext();

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState([]);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log('🎵 Audio metadata loaded:', {
        duration: audio.duration,
        src: audio.src
      });
    };

    const handleEnded = () => {
      console.log('🎵 Song ended, playing next...');
      playNext();
    };

    const handleError = (e) => {
      console.error('❌ Audio error:', {
        error: e,
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState,
        errorCode: audio.error?.code,
        errorMessage: audio.error?.message
      });
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can play:', audio.src);
    };

    const handleLoadStart = () => {
      console.log('📡 Audio loading started:', audio.src);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, [playlist]);

  const playSong = (song, newPlaylist = null) => {
    if (!song) {
      console.error('❌ playSong called with no song');
      return;
    }

    console.log('🎵 playSong called:', {
      song: song.title,
      audio_url: song.audio_url,
      hasAudioUrl: !!song.audio_url
    });

    const audio = audioRef.current;
    
    // Update playlist if provided
    if (newPlaylist) {
      setPlaylist(newPlaylist);
    }

    // If same song, just toggle play/pause
    if (currentSong?.id === song.id) {
      console.log('🎵 Same song, toggling play/pause');
      togglePlay();
      return;
    }

    // Validate audio URL
    if (!song.audio_url) {
      console.error('❌ Song has no audio_url:', song);
      alert('This song has no audio file available');
      return;
    }

    // Play new song
    console.log('🎵 Setting new song:', song.title);
    setCurrentSong(song);
    
    // CRITICAL FIX: Use audio_url, not audio
    audio.src = song.audio_url;
    audio.volume = volume;
    
    console.log('🎵 Audio src set to:', audio.src);
    console.log('🎵 Audio volume set to:', audio.volume);
    
    // Load the audio
    audio.load();
    
    // Play with proper error handling
    audio.play()
      .then(() => {
        console.log('✅ Playback started successfully');
        setIsPlaying(true);
        // Add to recently played
        addToRecentlyPlayed(song);
      })
      .catch(error => {
        console.error('❌ Playback failed:', {
          error: error.message,
          name: error.name,
          src: audio.src,
          readyState: audio.readyState,
          networkState: audio.networkState
        });
        setIsPlaying(false);
        
        // User-friendly error message
        if (error.name === 'NotAllowedError') {
          alert('Playback was blocked by browser. Please click play again.');
        } else if (error.name === 'NotSupportedError') {
          alert('This audio format is not supported by your browser.');
        } else {
          alert('Failed to play audio. Please try again.');
        }
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    
    if (!currentSong) {
      console.warn('⚠️ togglePlay called but no current song');
      return;
    }

    console.log('🎵 togglePlay called, isPlaying:', isPlaying);

    if (isPlaying) {
      console.log('⏸️ Pausing audio');
      audio.pause();
      setIsPlaying(false);
    } else {
      console.log('▶️ Playing audio');
      audio.play()
        .then(() => {
          console.log('✅ Playback resumed successfully');
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('❌ Playback failed:', error);
          setIsPlaying(false);
          
          // User-friendly error message
          if (error.name === 'NotAllowedError') {
            alert('Playback was blocked by browser. Please try again.');
          } else {
            alert('Failed to play audio. Please try again.');
          }
        });
    }
  };

  const playNext = () => {
    if (playlist.length === 0 || !currentSong) {
      console.warn('⚠️ playNext called but no playlist or current song');
      return;
    }

    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    
    console.log('⏭️ Playing next song:', {
      currentIndex,
      nextIndex,
      nextSong: playlist[nextIndex]?.title
    });
    
    playSong(playlist[nextIndex], playlist);
  };

  const playPrevious = () => {
    if (playlist.length === 0 || !currentSong) {
      console.warn('⚠️ playPrevious called but no playlist or current song');
      return;
    }

    const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    
    console.log('⏮️ Playing previous song:', {
      currentIndex,
      prevIndex,
      prevSong: playlist[prevIndex]?.title
    });
    
    playSong(playlist[prevIndex], playlist);
  };

  const seekTo = (time) => {
    const audio = audioRef.current;
    console.log('⏩ Seeking to:', time);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const changeVolume = (newVolume) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    console.log('🔊 Volume changed to:', clampedVolume);
    audio.volume = clampedVolume;
    setVolume(clampedVolume);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const value = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    playlist,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    formatTime,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
};
