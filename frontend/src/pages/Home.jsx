import React, { useEffect, useState } from 'react';
import { fetchSongs } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import './Home.css';

function Home() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { playSong, playlist } = usePlayer();

  useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSongs();
      
      if (response.success) {
        setSongs(response.data);
        
        // Set initial playlist if not already set
        if (playlist.length === 0) {
          // Playlist will be set when user clicks a song
        }
      }
    } catch (err) {
      console.error('Failed to load songs:', err);
      setError('Failed to load songs. Please try again later.');
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
      <div className="page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
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
      <div className="page-header">
        <h2>Discover Music</h2>
        {songs.length > 0 && (
          <button onClick={handlePlayAll} className="play-all-btn">
            ▶️ Play All
          </button>
        )}
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <p>No songs available</p>
        </div>
      ) : (
        <div className="songs-grid">
          {songs.map(song => (
            <SongCard 
              key={song.id} 
              song={song}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
