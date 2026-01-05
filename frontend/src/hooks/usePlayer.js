import { usePlayer as usePlayerContext } from '../context/PlayerContext';

/**
 * Custom hook for audio player functionality
 * Re-exports PlayerContext hook for convenience
 * 
 * Usage:
 * const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
 */
export const usePlayer = () => {
  return usePlayerContext();
};

export default usePlayer;
