import express from 'express';
import { getSongs, getSong, searchSongsController } from '../controllers/songs.controller.js';

const router = express.Router();

// Search songs (must be before /:id route)
router.get('/search', searchSongsController);

// Get all songs
router.get('/', getSongs);

// Get single song
router.get('/:id', getSong);

export default router;
