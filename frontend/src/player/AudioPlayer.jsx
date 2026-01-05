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
    formatTime
  } = usePlayer();

  const handleProgressClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.nativeEvent.offsetX;
    const barWidth = progressBar.offsetWidth;
    const seekTime = (clickPosition / barWidth) * duration;
    seekTo(seekTime);
  };

  const handleVolumeChange = (e) => {
    changeVolume(parseFloat(e.target.value));
  };

  if (!currentSong) {
    return (
      <div className="audio-player">
        <div className="player-placeholder">
          <p>🎵 Select a song to start playing</p>
        </div>
      </div>
    );
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <div className="player-content">
        {/* Song Info */}
        <div className="player-song-info">
          <img 
            src={currentSong.cover} 
            alt={currentSong.title}
            className="player-cover"
          />
          <div className="player-text">
            <div className="player-title">{currentSong.title}</div>
            <div className="player-artist">{currentSong.artist}</div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="player-center">
          <div className="player-controls">
            <button 
              className="control-btn"
              onClick={playPrevious}
              title="Previous"
            >
              ⏮️
            </button>
            <button 
              className="control-btn control-btn-play"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button 
              className="control-btn"
              onClick={playNext}
              title="Next"
            >
              ⏭️
            </button>
          </div>

          {/* Progress Bar */}
          <div className="player-progress-container">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar-container"
              onClick={handleProgressClick}
            >
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="player-volume">
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
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
