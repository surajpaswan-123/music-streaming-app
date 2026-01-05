/**
 * API Service Layer
 * Handles all API calls to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
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

export default {
  checkHealth,
  fetchSongs,
  fetchSongById,
  searchSongs,
};
