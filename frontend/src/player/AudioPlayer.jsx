import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import './AudioPlayer.css';

function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    formatTime,
  } = usePlayer();

  const handleProgressClick = (e) => {
    if (!currentSong || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentSong) {
    return (
      <div className="audio-player audio-player-empty">
        <div className="player-empty-state">
          <span className="empty-icon">🎵</span>
          <span className="empty-text">Select a song to start playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="audio-player">
      {/* Song Info */}
      <div className="player-song-info">
        <img 
          src={currentSong.cover} 
          alt={currentSong.title}
          className="player-cover"
        />
        <div className="player-details">
          <h4 className="player-title">{currentSong.title}</h4>
          <p className="player-artist">{currentSong.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="player-controls-section">
        <div className="player-buttons">
          <button 
            className="player-btn player-btn-prev"
            onClick={playPrevious}
            title="Previous"
          >
            ⏮️
          </button>
          
          <button 
            className="player-btn player-btn-play"
            onClick={togglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          
          <button 
            className="player-btn player-btn-next"
            onClick={playNext}
            title="Next"
          >
            ⏭️
          </button>
        </div>

        {/* Progress Bar */}
        <div className="player-progress-container">
          <span className="player-time">{formatTime(currentTime)}</span>
          <div 
            className="player-progress-bar"
            onClick={handleProgressClick}
          >
            <div 
              className="player-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="player-progress-handle"></div>
            </div>
          </div>
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="player-volume-section">
        <span className="volume-icon">
          {volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
        </span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="player-volume-slider"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
        <span className="volume-percentage">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}

export default AudioPlayer;
