import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './SongCard.css';

function SongCard({ song }) {
  const { currentSong, isPlaying, playSong, togglePlay, playlist } = usePlayer();
  
  const isCurrentSong = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    
    if (isCurrentSong) {
      togglePlay();
    } else {
      playSong(song, playlist.length > 0 ? playlist : null);
    }
  };

  return (
    <div 
      className={`song-card ${isCurrentSong ? 'song-card-active' : ''}`}
      onClick={handlePlayClick}
    >
      <div className="song-card-cover-container">
        <img 
          src={song.cover} 
          alt={song.title}
          className="song-card-cover"
        />
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
