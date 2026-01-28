import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './HeroSongCard.css';

function HeroSongCard({ song }) {
  const { currentSong, playSong, isPlaying } = usePlayer();
  const isCurrentSong = currentSong?.id === song.id;

  const handlePlay = (e) => {
    e.stopPropagation();
    playSong(song, [song]);
  };

  return (
    <div className="hero-song-card" onClick={handlePlay}>
      {/* Banner Background Image */}
      <div 
        className="hero-song-card-background"
        style={{ backgroundImage: `url(${song.banner_url || song.cover_url})` }}
      >
        <div className="hero-song-card-overlay"></div>
      </div>

      {/* Content */}
      <div className="hero-song-card-content">
        <span className="hero-song-card-badge">Featured</span>
        <h2 className="hero-song-card-title">{song.title}</h2>
        <p className="hero-song-card-artist">{song.artist || 'Unknown Artist'}</p>
        
        <button className="hero-song-card-play-btn" onClick={handlePlay}>
          {isCurrentSong && isPlaying ? '⏸' : '▶'} 
          {isCurrentSong && isPlaying ? 'Pause' : 'Play Now'}
        </button>
      </div>

      {/* Playing Indicator */}
      {isCurrentSong && isPlaying && (
        <div className="hero-song-card-playing-indicator">
          <div className="playing-bar"></div>
          <div className="playing-bar"></div>
          <div className="playing-bar"></div>
        </div>
      )}
    </div>
  );
}

export default HeroSongCard;
