import React, { useState } from 'react';
import { searchSongs } from '../services/api';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import './Search.css';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const { playSong } = usePlayer();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      
      const response = await searchSongs(query);
      
      if (response.success) {
        setResults(response.data);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setResults([]);
      setSearched(false);
    }
  };

  return (
    <div className="page search-page">
      <h2>Search</h2>
      
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={query}
            onChange={handleInputChange}
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setSearched(false);
              }}
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-btn" disabled={!query.trim()}>
          Search
        </button>
      </form>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="empty-state">
          <p>No results found for "{query}"</p>
          <p className="empty-state-hint">Try different keywords</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="search-results">
          <h3 className="results-header">
            Found {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </h3>
          <div className="songs-grid">
            {results.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </div>
      )}

      {!searched && !loading && (
        <div className="search-placeholder">
          <div className="search-placeholder-icon">🎵</div>
          <p>Search for your favorite songs</p>
          <p className="search-placeholder-hint">
            Try searching for song titles, artists, or albums
          </p>
        </div>
      )}
    </div>
  );
}

export default Search;
