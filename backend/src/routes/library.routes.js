import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getLikedSongs,
  likeSong,
  unlikeSong,
  isLiked
} from '../controllers/library.controller.js';

const router = express.Router();

// All library routes require authentication
router.use(authenticate);

// Get liked songs
router.get('/liked', getLikedSongs);

// Like a song
router.post('/like/:songId', likeSong);

// Unlike a song
router.delete('/unlike/:songId', unlikeSong);

// Check if song is liked
router.get('/is-liked/:songId', isLiked);

export default router;
