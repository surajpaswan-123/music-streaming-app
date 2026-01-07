import React from 'react';
import './SongBanner.css';

/**
 * SongBanner Component
 * 
 * Displays a promotional banner for a song when:
 * - song.show_banner === true
 * - song.banner_url exists
 * 
 * Data-driven: Updates automatically when Supabase data changes
 */
function SongBanner({ song, onPlayClick }) {
  // Don't render if banner shouldn't be shown
  if (!song.show_banner || !song.banner_url) {
    return null;
  }

  const handleBannerClick = () => {
    if (onPlayClick) {
      onPlayClick(song);
    }
  };

  return (
    <div className="song-banner" onClick={handleBannerClick}>
      <div className="song-banner-image-container">
        <img 
          src={song.banner_url} 
          alt={`${song.title} banner`}
          className="song-banner-image"
          loading="lazy"
        />
        <div className="song-banner-overlay">
          <div className="song-banner-content">
            <span className="song-banner-badge">Featured</span>
            <h2 className="song-banner-title">{song.title}</h2>
            <p className="song-banner-artist">{song.artist}</p>
            <button className="song-banner-play-btn">
              ▶️ Play Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SongBanner;
