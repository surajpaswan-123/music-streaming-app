import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLikedSongs, getPlaylists } from '../services/api';
import { fetchSongs } from '../services/api';
import SongCard from '../components/SongCard';
import './Library.css';

function Library() {
  const { user, getAccessToken } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]); // liked stories
  const [playlists, setPlaylists] = useState([]); // story lists
  const [allSongs, setAllSongs] = useState([]); // all stories
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
      
      console.log('📚 Library: Loading library data...');
      
      const token = await getAccessToken();
      
      // Load all stories first - fetchSongs() returns array directly
      const songs = await fetchSongs();
      
      console.log('📚 Library: All stories:', songs);
      console.log('📚 Library: Stories count:', songs?.length || 0);

      // Validate data
      if (!Array.isArray(songs)) {
        console.error('❌ Library: fetchSongs() did not return an array:', songs);
        throw new Error('Invalid data format received from fetchSongs()');
      }

      setAllSongs(songs);
      
      // Load liked stories - getLikedSongs() returns array directly
      const likedData = await getLikedSongs(token);
      
      console.log('❤️ Library: Liked stories data:', likedData);

      // Validate liked data
      const likedArray = Array.isArray(likedData) ? likedData : [];
      
      // Map liked story IDs to full story objects
      const likedSongObjects = likedArray
        .map(liked => songs.find(song => song.id === liked.song_id))
        .filter(Boolean);
      
      console.log('❤️ Library: Liked story objects:', likedSongObjects);
      setLikedSongs(likedSongObjects);
      
      // Load story lists - getPlaylists() returns array directly
      const playlistsData = await getPlaylists(token);
      
      console.log('📚 Library: Story lists:', playlistsData);

      // Validate playlists data
      const playlistsArray = Array.isArray(playlistsData) ? playlistsData : [];
      setPlaylists(playlistsArray);

      console.log('✅ Library: Library data loaded successfully');
      
    } catch (err) {
      console.error('❌ Library: Failed to load library:', err);
      setError(err.message || 'Failed to load library. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page library-page">
        <div className="empty-state">
          <h2>Sign in to view your library</h2>
          <p>Create an account to save your favorite stories and lists</p>
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
          ❤️ Liked Stories ({likedSongs.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          📚 Story Lists ({playlists.length})
        </button>
      </div>

      {activeTab === 'liked' && (
        <div className="library-content">
          {likedSongs.length === 0 ? (
            <div className="empty-state">
              <p>No liked stories yet</p>
              <p className="empty-state-hint">
                Like stories by clicking the heart icon
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
              <p>No story lists yet</p>
              <p className="empty-state-hint">
                Create your first story list to organize your favorites
              </p>
              <button className="cta-button">Create Story List</button>
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
