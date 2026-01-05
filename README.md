# 🎵 Music Streaming App

A modern, full-stack music streaming application with user authentication, personal library, and playlist management. Built with React, Node.js, and Supabase.

## 📋 Project Overview

This is a complete music streaming platform that provides users with authentication, personalized music library, playlist management, and seamless audio playback. The application follows industry-standard practices for security, scalability, and user experience.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **HTML5 Audio API** - Audio playback
- **Supabase Client** - Authentication and database
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Authentication and PostgreSQL database
- **RESTful API** - API architecture

### Database & Auth
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data security

### Development Tools
- **Git** - Version control
- **npm** - Package manager

## ✨ Features (Phase-3 Complete)

### 🔐 Authentication
- ✅ Email/Password signup and login
- ✅ Secure session management
- ✅ Protected routes
- ✅ Persistent authentication
- ✅ Sign out functionality

### 🎵 Music Player
- ✅ Play/Pause controls
- ✅ Next/Previous track
- ✅ Progress bar with seek
- ✅ Volume control
- ✅ Auto-play next song
- ✅ Persistent across navigation

### ❤️ User Library
- ✅ Like/Unlike songs
- ✅ View liked songs
- ✅ User-specific data
- ✅ Real-time updates
- ✅ Data persistence

### 📚 Playlists
- ✅ Create playlists
- ✅ View user playlists
- ✅ User-specific playlists
- ✅ Playlist metadata

### 🎨 User Interface
- ✅ Song listing with covers
- ✅ Real-time search
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ User profile page

## 📁 Project Structure

```
music-streaming-app/
├── frontend/                # React Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI (SongCard, ProtectedRoute)
│       ├── pages/          # Pages (Home, Search, Library, Profile, Login, Signup)
│       ├── player/         # Audio player component
│       ├── services/       # API integration
│       ├── context/        # React Context (Auth, Player)
│       ├── config/         # Supabase configuration
│       ├── styles/         # Global styles
│       └── App.jsx         # Root component
│
├── backend/                # API Server
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth middleware
│   │   ├── config/         # Supabase config
│   │   ├── data/           # Sample data
│   │   └── app.js          # Express app
│   └── package.json
│
├── database/
│   └── schema.md           # Database design
│
├── SUPABASE-SETUP.md       # Supabase setup guide
├── .env.example
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier)

### 1. Supabase Setup

Follow the detailed guide in [SUPABASE-SETUP.md](./SUPABASE-SETUP.md):

1. Create Supabase project
2. Enable email authentication
3. Run SQL schema to create tables
4. Get API keys

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp ../.env.example .env

# Add your Supabase credentials:
# SUPABASE_URL=your_project_url
# SUPABASE_SERVICE_KEY=your_service_role_key

npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp ../.env.example .env

# Add your Supabase credentials:
# VITE_SUPABASE_URL=your_project_url
# VITE_SUPABASE_ANON_KEY=your_anon_key

npm run dev
```

Frontend runs on `http://localhost:5173`

## 🎯 API Endpoints

### Public Endpoints
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get single song
- `GET /api/songs/search?q=query` - Search songs

### Protected Endpoints (Require Authentication)

#### Library
- `GET /api/library/liked` - Get liked songs
- `POST /api/library/like/:songId` - Like a song
- `DELETE /api/library/unlike/:songId` - Unlike a song
- `GET /api/library/is-liked/:songId` - Check if song is liked

#### Playlists
- `GET /api/playlists` - Get user playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get playlist with songs
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

## 🔒 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ JWT-based authentication
- ✅ Secure password hashing (Supabase)
- ✅ Protected API routes
- ✅ User-specific data isolation
- ✅ Service key only in backend
- ✅ CORS configuration

## 🧪 Testing the App

1. **Sign Up**: Create a new account at `/signup`
2. **Sign In**: Login at `/login`
3. **Browse Music**: View songs on home page
4. **Like Songs**: Click heart icon on any song
5. **View Library**: Check your liked songs at `/library`
6. **Create Playlist**: (Coming in Phase-4)
7. **Play Music**: Click any song to play
8. **Sign Out**: Use sign out button in header

## 📊 Database Schema

### Tables

**playlists**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `name` (TEXT)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**playlist_songs**
- `id` (UUID, Primary Key)
- `playlist_id` (UUID, Foreign Key → playlists)
- `song_id` (TEXT)
- `added_at` (TIMESTAMP)

**liked_songs**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → auth.users)
- `song_id` (TEXT)
- `liked_at` (TIMESTAMP)
- UNIQUE constraint on (user_id, song_id)

## 🎯 Phase Status

### ✅ Phase-1: Foundation (Complete)
- Repository structure
- Frontend/Backend boilerplate
- Basic routing
- Documentation

### ✅ Phase-2: Core Player (Complete)
- Song listing API
- Functional audio player
- Search functionality
- Responsive UI

### ✅ Phase-3: Auth & Library (Complete)
- User authentication (Supabase)
- Liked songs functionality
- User library
- Playlist structure
- Protected routes
- User profiles

### 🔜 Phase-4: Coming Soon
- Advanced playlist management
- Song recommendations
- UI polish
- Social features

## 🤝 Contributing

This project follows industry-standard coding practices:
- Clean, readable code
- Meaningful commit messages
- Proper documentation
- Security best practices

## 📄 License

MIT License

## 👨‍💻 Author

Suraj Paswan

---

**Current Status**: Phase-3 Complete - Full authentication and user library system! 🎉

**Repository**: https://github.com/surajpaswan-123/music-streaming-app

**Live Demo**: Deploy to Vercel/Netlify (Coming Soon)
