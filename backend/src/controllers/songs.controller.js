import { getAllSongs, getSongById, searchSongs } from '../data/songs.data.js';

/**
 * Get all songs
 * GET /api/songs
 */
export const getSongs = (req, res) => {
  try {
    const songs = getAllSongs();
    
    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch songs'
    });
  }
};

/**
 * Get single song by ID
 * GET /api/songs/:id
 */
export const getSong = (req, res) => {
  try {
    const { id } = req.params;
    const song = getSongById(id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        error: 'Song not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch song'
    });
  }
};

/**
 * Search songs
 * GET /api/songs/search?q=query
 */
export const searchSongsController = (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }
    
    const results = searchSongs(q);
    
    res.status(200).json({
      success: true,
      count: results.length,
      query: q,
      data: results
    });
  } catch (error) {
    console.error('Error searching songs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search songs'
    });
  }
};
