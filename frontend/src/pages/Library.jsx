import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLikedSongs, getPlaylists } from '../services/api';
import { fetchSongs } from '../services/api';
import SongCard from '../components/SongCard';
import './Library.css';

function Library() {
  const { user, getAccessToken } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('liked'); // 'liked' or 'playlists'

  useEffect(() => {
    if (user) {
      loadLibraryData();
    }
  }, [user]);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getAccessToken();
      
      // Load all songs first
      const songsResponse = await fetchSongs();
      const songs = songsResponse.data || [];
      setAllSongs(songs);
      
      // Load liked songs
      const likedResponse = await getLikedSongs(token);
      const likedData = likedResponse.data || [];
      
      // Map liked song IDs to full song objects
      const likedSongObjects = likedData
        .map(liked => songs.find(song => song.id === liked.song_id))
        .filter(Boolean);
      
      setLikedSongs(likedSongObjects);
      
      // Load playlists
      const playlistsResponse = await getPlaylists(token);
      setPlaylists(playlistsResponse.data || []);
      
    } catch (err) {
      console.error('Failed to load library:', err);
      setError('Failed to load library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page library-page">
        <div className="empty-state">
          <h2>Sign in to view your library</h2>
          <p>Create an account to save your favorite songs and playlists</p>
          <a href="/login" className="cta-button">Sign In</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page library-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your library...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page library-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={loadLibraryData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page library-page">
      <h2>Your Library</h2>
      
      <div className="library-tabs">
        <button
          className={`tab-button ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => setActiveTab('liked')}
        >
          ❤️ Liked Songs ({likedSongs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          📚 Playlists ({playlists.length})
        </button>
      </div>

      {activeTab === 'liked' && (
        <div className="library-content">
          {likedSongs.length === 0 ? (
            <div className="empty-state">
              <p>No liked songs yet</p>
              <p className="empty-state-hint">
                Like songs by clicking the heart icon
              </p>
            </div>
          ) : (
            <div className="songs-grid">
              {likedSongs.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="library-content">
          {playlists.length === 0 ? (
            <div className="empty-state">
              <p>No playlists yet</p>
              <p className="empty-state-hint">
                Create your first playlist to organize your music
              </p>
              <button className="cta-button">Create Playlist</button>
            </div>
          ) : (
            <div className="playlists-grid">
              {playlists.map(playlist => (
                <div key={playlist.id} className="playlist-card">
                  <div className="playlist-cover">
                    <span className="playlist-icon">📚</span>
                  </div>
                  <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    {playlist.description && (
                      <p className="playlist-description">{playlist.description}</p>
                    )}
                    <p className="playlist-meta">
                      Created {new Date(playlist.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Library;
