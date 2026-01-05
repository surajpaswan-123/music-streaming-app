import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist
} from '../controllers/playlists.controller.js';

const router = express.Router();

// All playlist routes require authentication
router.use(authenticate);

// Get all playlists
router.get('/', getPlaylists);

// Create playlist
router.post('/', createPlaylist);

// Get single playlist
router.get('/:id', getPlaylist);

// Update playlist
router.put('/:id', updatePlaylist);

// Delete playlist
router.delete('/:id', deletePlaylist);

// Add song to playlist
router.post('/:id/songs', addSongToPlaylist);

// Remove song from playlist
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

export default router;
