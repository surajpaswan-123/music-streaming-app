/**
 * API Service Layer
 * Handles all API calls to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Get access token from Supabase
 */
const getAuthToken = async () => {
  // This will be set by AuthContext
  const token = localStorage.getItem('supabase.auth.token');
  return token;
};

/**
 * Generic fetch wrapper with error handling and auth
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    // Get auth token if available
    const token = options.token || await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add auth header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

/**
 * Health check
 */
export async function checkHealth() {
  return fetchAPI('/health');
}

/**
 * Get all songs
 */
export async function fetchSongs() {
  return fetchAPI('/songs');
}

/**
 * Get single song by ID
 */
export async function fetchSongById(id) {
  return fetchAPI(`/songs/${id}`);
}

/**
 * Search songs
 */
export async function searchSongs(query) {
  return fetchAPI(`/songs/search?q=${encodeURIComponent(query)}`);
}

/**
 * Get liked songs
 */
export async function getLikedSongs(token) {
  return fetchAPI('/library/liked', { token });
}

/**
 * Like a song
 */
export async function likeSong(songId, token) {
  return fetchAPI(`/library/like/${songId}`, {
    method: 'POST',
    token
  });
}

/**
 * Unlike a song
 */
export async function unlikeSong(songId, token) {
  return fetchAPI(`/library/unlike/${songId}`, {
    method: 'DELETE',
    token
  });
}

/**
 * Check if song is liked
 */
export async function checkIsLiked(songId, token) {
  return fetchAPI(`/library/is-liked/${songId}`, { token });
}

/**
 * Get user's playlists
 */
export async function getPlaylists(token) {
  return fetchAPI('/playlists', { token });
}

/**
 * Get single playlist with songs
 */
export async function getPlaylist(playlistId, token) {
  return fetchAPI(`/playlists/${playlistId}`, { token });
}

/**
 * Create new playlist
 */
export async function createPlaylist(name, description, token) {
  return fetchAPI('/playlists', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
    token
  });
}

/**
 * Update playlist
 */
export async function updatePlaylist(playlistId, name, description, token) {
  return fetchAPI(`/playlists/${playlistId}`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
    token
  });
}

/**
 * Delete playlist
 */
export async function deletePlaylist(playlistId, token) {
  return fetchAPI(`/playlists/${playlistId}`, {
    method: 'DELETE',
    token
  });
}

/**
 * Add song to playlist
 */
export async function addSongToPlaylist(playlistId, songId, token) {
  return fetchAPI(`/playlists/${playlistId}/songs`, {
    method: 'POST',
    body: JSON.stringify({ songId }),
    token
  });
}

/**
 * Remove song from playlist
 */
export async function removeSongFromPlaylist(playlistId, songId, token) {
  return fetchAPI(`/playlists/${playlistId}/songs/${songId}`, {
    method: 'DELETE',
    token
  });
}

export default {
  checkHealth,
  fetchSongs,
  fetchSongById,
  searchSongs,
  getLikedSongs,
  likeSong,
  unlikeSong,
  checkIsLiked,
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
