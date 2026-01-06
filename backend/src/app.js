import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import songsRoutes from './routes/songs.routes.js';
import libraryRoutes from './routes/library.routes.js';
import playlistsRoutes from './routes/playlists.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/songs', songsRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/playlists', playlistsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Music Streaming API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      songs: '/api/songs',
      songById: '/api/songs/:id',
      search: '/api/songs/search?q=query',
      library: {
        liked: '/api/library/liked',
        like: '/api/library/like/:songId',
        unlike: '/api/library/unlike/:songId',
        isLiked: '/api/library/is-liked/:songId'
      },
      playlists: {
        all: '/api/playlists',
        create: '/api/playlists',
        get: '/api/playlists/:id',
        update: '/api/playlists/:id',
        delete: '/api/playlists/:id',
        addSong: '/api/playlists/:id/songs',
        removeSong: '/api/playlists/:id/songs/:songId'
      }
    },
    note: 'Library and Playlist endpoints require authentication'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🎵 Songs API: http://localhost:${PORT}/api/songs`);
    console.log(`❤️  Library API: http://localhost:${PORT}/api/library`);
    console.log(`📚 Playlists API: http://localhost:${PORT}/api/playlists`);
  });
}

export default app;
