import React from 'react';

function Search() {
  return (
    <div className="page">
      <h2>Search</h2>
      <div className="placeholder">
        <p>🔍 Search functionality will be implemented in Phase-2</p>
        <input 
          type="text" 
          placeholder="Search for songs, artists, albums..." 
          disabled 
          style={{ width: '100%', padding: '10px', marginTop: '20px' }}
        />
      </div>
    </div>
  );
}

export default Search;
