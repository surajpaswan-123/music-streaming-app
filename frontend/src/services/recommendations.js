/**
 * Recommendation Service
 * Logic-based recommendations (no AI/ML)
 */

/**
 * Get recommended songs based on user activity
 * @param {Array} allSongs - All available songs
 * @param {Array} likedSongs - User's liked songs
 * @param {Object} currentSong - Currently playing song
 * @param {Array} recentlyPlayed - Recently played songs
 * @returns {Array} Recommended songs
 */
export function getRecommendations(allSongs, likedSongs = [], currentSong = null, recentlyPlayed = []) {
  const recommendations = new Set();
  const likedSongIds = new Set(likedSongs.map(s => s.id));
  const recentSongIds = new Set(recentlyPlayed.map(s => s.id));

  // 1. Songs by same artist as liked songs
  if (likedSongs.length > 0) {
    const likedArtists = new Set(likedSongs.map(s => s.artist));
    allSongs.forEach(song => {
      if (likedArtists.has(song.artist) && !likedSongIds.has(song.id)) {
        recommendations.add(song);
      }
    });
  }

  // 2. Songs by same artist as currently playing
  if (currentSong) {
    allSongs.forEach(song => {
      if (song.artist === currentSong.artist && song.id !== currentSong.id && !likedSongIds.has(song.id)) {
        recommendations.add(song);
      }
    });
  }

  // 3. Songs from same album as liked songs
  if (likedSongs.length > 0) {
    const likedAlbums = new Set(likedSongs.map(s => s.album));
    allSongs.forEach(song => {
      if (likedAlbums.has(song.album) && !likedSongIds.has(song.id)) {
        recommendations.add(song);
      }
    });
  }

  // 4. If not enough recommendations, add popular songs (not liked)
  if (recommendations.size < 6) {
    allSongs.forEach(song => {
      if (!likedSongIds.has(song.id) && !recentSongIds.has(song.id)) {
        recommendations.add(song);
      }
    });
  }

  // Convert Set to Array and limit to 6 songs
  return Array.from(recommendations).slice(0, 6);
}

/**
 * Get recently played songs from localStorage
 * @returns {Array} Recently played songs
 */
export function getRecentlyPlayed() {
  try {
    const recent = localStorage.getItem('recentlyPlayed');
    return recent ? JSON.parse(recent) : [];
  } catch (error) {
    console.error('Failed to get recently played:', error);
    return [];
  }
}

/**
 * Add song to recently played
 * @param {Object} song - Song to add
 */
export function addToRecentlyPlayed(song) {
  try {
    let recent = getRecentlyPlayed();
    
    // Remove if already exists
    recent = recent.filter(s => s.id !== song.id);
    
    // Add to beginning
    recent.unshift(song);
    
    // Keep only last 10
    recent = recent.slice(0, 10);
    
    localStorage.setItem('recentlyPlayed', JSON.stringify(recent));
  } catch (error) {
    console.error('Failed to add to recently played:', error);
  }
}

/**
 * Get similar songs based on a specific song
 * @param {Object} song - Reference song
 * @param {Array} allSongs - All available songs
 * @returns {Array} Similar songs
 */
export function getSimilarSongs(song, allSongs) {
  if (!song) return [];

  const similar = allSongs.filter(s => 
    s.id !== song.id && (
      s.artist === song.artist || 
      s.album === song.album
    )
  );

  return similar.slice(0, 4);
}

export default {
  getRecommendations,
  getRecentlyPlayed,
  addToRecentlyPlayed,
  getSimilarSongs,
};
