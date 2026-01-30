import React, { useState, useEffect, useCallback } from 'react';
import { searchSongs } from '../services/api';
import SongCard from '../components/SongCard';
import './Search.css';

// Debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      console.log('🔍 Search: Searching for:', searchQuery);

      // searchSongs() returns array directly (stories)
      const searchResults = await searchSongs(searchQuery);
      
      console.log('🔍 Search: Results:', searchResults);
      console.log('🔍 Search: Results count:', searchResults?.length || 0);

      // Validate data
      if (!Array.isArray(searchResults)) {
        console.error('❌ Search: searchSongs() did not return an array:', searchResults);
        throw new Error('Invalid data format received from searchSongs()');
      }

      setResults(searchResults);
      console.log('✅ Search: Search completed successfully');

    } catch (err) {
      console.error('❌ Search: Search failed:', err);
      setError(err.message || 'Failed to search stories. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  return (
    <div className="page search-page">
      <div className="search-header">
        <h2>Search</h2>
        <p className="search-subtitle">Find your favorite stories, narrators, and collections</p>
      </div>

      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search for stories, narrators, or genres..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear-btn" onClick={handleClear}>
              ✕
            </button>
          )}
        </div>

        {loading && (
          <div className="search-loading">
            <div className="loading-spinner"></div>
            <p>Searching...</p>
          </div>
        )}

        {error && (
          <div className="search-error">
            <p className="error-message">❌ {error}</p>
          </div>
        )}

        {!loading && !error && hasSearched && results.length === 0 && (
          <div className="search-empty">
            <div className="empty-icon">📖</div>
            <h3>No results found</h3>
            <p>Try searching with different keywords</p>
            <div className="search-hints">
              <p className="hints-title">Search tips:</p>
              <ul>
                <li>Check your spelling</li>
                <li>Try different keywords</li>
                <li>Search by narrator name</li>
                <li>Search by story title</li>
              </ul>
            </div>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="search-results">
            <div className="results-header">
              <h3>Found {results.length} {results.length === 1 ? 'story' : 'stories'}</h3>
            </div>
            <div className="songs-grid">
              {results.map(song => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && !hasSearched && (
          <div className="search-suggestions">
            <h3>Popular Genres</h3>
            <div className="suggestion-chips">
              <button className="suggestion-chip" onClick={() => setQuery('horror')}>
                👻 Horror
              </button>
              <button className="suggestion-chip" onClick={() => setQuery('motivation')}>
                💪 Motivation
              </button>
              <button className="suggestion-chip" onClick={() => setQuery('love')}>
                ❤️ Love
              </button>
              <button className="suggestion-chip" onClick={() => setQuery('history')}>
                📜 History
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
