import React, { useEffect, useState } from 'react';
import { fetchSongs } from '../services/api';
import { getLikedSongs } from '../services/api';
import { getRecommendations, getRecentlyPlayed } from '../services/recommendations';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import './Home.css';

function Home() {
  const [songs, setSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAccessToken } = useAuth();
  const { currentSong, playSong } = usePlayer();

  useEffect(() => {
    loadSongs();
  }, [user]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all songs
      const response = await fetchSongs();
      const allSongs = response.data || [];
      setSongs(allSongs);

      // Get recently played
      const recent = getRecentlyPlayed();
      setRecentlyPlayed(recent);

      // Get recommendations if user is logged in
      if (user) {
        try {
          const token = await getAccessToken();
          const likedResponse = await getLikedSongs(token);
          const likedData = likedResponse.data || [];
          
          // Map liked song IDs to full song objects
          const likedSongs = likedData
            .map(liked => allSongs.find(song => song.id === liked.song_id))
            .filter(Boolean);

          // Get recommendations
          const recommended = getRecommendations(
            allSongs,
            likedSongs,
            currentSong,
            recent
          );
          setRecommendedSongs(recommended);
        } catch (err) {
          console.error('Failed to load recommendations:', err);
          // Continue without recommendations
        }
      } else {
        // For non-logged in users, show random songs as recommendations
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        setRecommendedSongs(shuffled.slice(0, 6));
      }

    } catch (err) {
      console.error('Failed to load songs:', err);
      setError('Failed to load songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  if (loading) {
    return (
      <div className="page home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page home-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={loadSongs} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <div className="home-header">
        <div className="header-content">
          <h2>Discover Music</h2>
          <p className="header-subtitle">
            {user ? `Welcome back, ${user.email.split('@')[0]}!` : 'Explore our collection'}
          </p>
        </div>
        {songs.length > 0 && (
          <button className="play-all-btn" onClick={handlePlayAll}>
            ▶️ Play All
          </button>
        )}
      </div>

      {/* Recommended Section */}
      {recommendedSongs.length > 0 && (
        <section className="music-section">
          <div className="section-header">
            <h3>
              {user ? '🎯 Recommended for You' : '🔥 Popular Songs'}
            </h3>
            <p className="section-subtitle">
              {user ? 'Based on your listening history' : 'Trending now'}
            </p>
          </div>
          <div className="songs-grid">
            {recommendedSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Played Section */}
      {recentlyPlayed.length > 0 && (
        <section className="music-section">
          <div className="section-header">
            <h3>🕐 Recently Played</h3>
            <p className="section-subtitle">Pick up where you left off</p>
          </div>
          <div className="songs-grid">
            {recentlyPlayed.slice(0, 6).map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* All Songs Section */}
      <section className="music-section">
        <div className="section-header">
          <h3>🎵 All Songs</h3>
          <p className="section-subtitle">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
          </p>
        </div>
        {songs.length === 0 ? (
          <div className="empty-state">
            <p>No songs available</p>
          </div>
        ) : (
          <div className="songs-grid">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
