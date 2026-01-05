import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/health.routes.js';
import songsRoutes from './routes/songs.routes.js';

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

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Music Streaming API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      songs: '/api/songs',
      songById: '/api/songs/:id',
      search: '/api/songs/search?q=query'
    }
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎵 Songs API: http://localhost:${PORT}/api/songs`);
});

export default app;
