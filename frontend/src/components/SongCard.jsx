import React, { useState, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../context/AuthContext';
import { likeSong, unlikeSong, checkIsLiked } from '../services/api';
import './SongCard.css';

function SongCard({ song }) {
  const { currentSong, isPlaying, playSong, togglePlay, playlist } = usePlayer();
  const { user, getAccessToken } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likePending, setLikePending] = useState(false);
  
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  // Use cover_url for background, fallback to cover field
  const backgroundImage = song.cover_url || song.cover;

  // Check if song is liked on mount
  useEffect(() => {
    if (user) {
      checkLikedStatus();
    }
  }, [user, song.id]);

  const checkLikedStatus = async () => {
    try {
      const token = await getAccessToken();
      const response = await checkIsLiked(song.id, token);
      setIsLiked(response.isLiked);
    } catch (error) {
      console.error('Failed to check liked status:', error);
    }
  };

  const handlePlayClick = (e) => {
    e.stopPropagation();
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, playlist.length > 0 ? playlist : null);
    }
  };

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    if (likePending) return;

    try {
      setLikePending(true);
      const token = await getAccessToken();
      
      if (isLiked) {
        await unlikeSong(song.id, token);
        setIsLiked(false);
      } else {
        await likeSong(song.id, token);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLikePending(false);
    }
  };

  return (
    <div 
      className={`song-card ${isCurrentSong ? 'song-card-active' : ''}`}
      onClick={handlePlayClick}
    >
      <div 
        className="song-card-cover-container"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="song-card-background-overlay"></div>
        
        <div className="song-card-overlay">
          <button className="song-card-play-btn">
            {isCurrentlyPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
        {isCurrentlyPlaying && (
          <div className="song-card-playing-indicator">
            <div className="playing-bar"></div>
            <div className="playing-bar"></div>
            <div className="playing-bar"></div>
          </div>
        )}
        <button
          className={`song-card-like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLikeClick}
          disabled={likePending}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className="song-card-info">
        <h3 className="song-card-title">{song.title}</h3>
        <p className="song-card-artist">{song.artist}</p>
        <p className="song-card-duration">{song.duration}</p>
      </div>
    </div>
  );
}

export default SongCard;
