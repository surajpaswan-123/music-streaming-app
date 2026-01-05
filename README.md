# 🎵 Music Streaming App

A modern, production-ready music streaming application with authentication, personalized recommendations, and a polished UI. Built with React, Node.js, and Supabase.

## 📋 Project Overview

This is a complete, full-stack music streaming platform featuring user authentication, intelligent recommendations, personal library management, and a beautiful, responsive interface inspired by modern music streaming services.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **HTML5 Audio API** - Audio playback
- **Supabase Client** - Authentication and database
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Authentication and PostgreSQL database
- **RESTful API** - API architecture

### Database & Auth
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security (RLS)** - Data security

## ✨ Features (Phase-4 Complete)

### 🔐 Authentication
- ✅ Email/Password signup and login
- ✅ Secure session management
- ✅ Protected routes
- ✅ Persistent authentication
- ✅ User profiles

### 🎵 Music Player
- ✅ Play/Pause/Next/Previous controls
- ✅ Interactive progress bar with seek
- ✅ Volume control with visual feedback
- ✅ Time elapsed/duration display
- ✅ Auto-play next song
- ✅ Smooth animations
- ✅ Empty state handling

### 🔍 Search System
- ✅ Fast, debounced search (300ms)
- ✅ Search by title, artist, album
- ✅ Real-time results
- ✅ Loading states
- ✅ Empty state with hints
- ✅ Popular search suggestions

### 🎯 Recommendations
- ✅ Logic-based recommendations (no AI)
- ✅ Based on liked songs
- ✅ Based on listening history
- ✅ Same artist suggestions
- ✅ Recently played tracking
- ✅ Personalized for each user

### ❤️ User Library
- ✅ Like/Unlike songs
- ✅ View liked songs
- ✅ User-specific data
- ✅ Real-time updates
- ✅ Playlist management

### 🎨 UI/UX Polish
- ✅ Modern, clean design
- ✅ Smooth hover effects
- ✅ Active song highlighting
- ✅ Gradient backgrounds
- ✅ Responsive design (mobile-first)
- ✅ Loading animations
- ✅ Empty states
- ✅ Consistent color theme

## 📁 Project Structure

```
music-streaming-app/
├── frontend/                # React Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI (SongCard, ProtectedRoute)
│       ├── pages/          # Pages (Home, Search, Library, Profile, Auth)
│       ├── player/         # Audio player component
│       ├── services/       # API integration & recommendations
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
├── SUPABASE-SETUP.md       # Supabase setup guide
├── PHASE-3-SUMMARY.md      # Phase-3 implementation details
├── PHASE-4-SUMMARY.md      # Phase-4 implementation details
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

## 🎨 Design Features

### Color Scheme
- **Primary**: #1db954 (Spotify Green)
- **Background**: #121212 (Dark)
- **Surface**: #1a1a1a (Card Background)
- **Text**: #ffffff (Primary Text)
- **Secondary Text**: #b3b3b3

### UI Components
- Gradient backgrounds
- Smooth hover effects
- Active state animations
- Loading spinners
- Empty state illustrations
- Responsive grid layouts

## 🧪 Testing the App

1. **Sign Up**: Create account at `/signup`
2. **Browse**: View recommended and all songs
3. **Search**: Find songs by title/artist
4. **Like Songs**: Click heart icon
5. **Play Music**: Click any song
6. **View Library**: Check liked songs at `/library`
7. **Recently Played**: See your listening history
8. **Recommendations**: Get personalized suggestions

## 🎯 Phase Status

### ✅ Phase-1: Foundation (Complete)
- Repository structure
- Frontend/Backend boilerplate
- Basic routing

### ✅ Phase-2: Core Player (Complete)
- Song listing API
- Functional audio player
- Basic search
- Responsive UI

### ✅ Phase-3: Auth & Library (Complete)
- User authentication
- Liked songs
- User library
- Playlists
- Protected routes

### ✅ Phase-4: Search & Polish (Complete)
- Advanced search with debouncing
- Logic-based recommendations
- Recently played tracking
- UI/UX polish
- Enhanced player controls
- Modern design system

### 🔜 Phase-5: Coming Soon
- Performance optimizations
- Deployment (Vercel/Netlify)
- Production readiness
- Analytics
- Error tracking

## 🚀 Key Improvements in Phase-4

### Search System
- 300ms debounced input
- Real-time results
- Popular search suggestions
- Empty state with helpful hints

### Recommendations
- Based on liked songs
- Same artist suggestions
- Recently played tracking
- Personalized for each user

### UI Polish
- Modern gradients
- Smooth animations
- Better spacing
- Consistent design
- Mobile-first responsive

### Player Enhancements
- Interactive progress bar
- Volume percentage display
- Empty state handling
- Smooth transitions
- Better mobile experience

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

**Current Status**: Phase-4 Complete - Production-ready music streaming app! 🎉

**Repository**: https://github.com/surajpaswan-123/music-streaming-app

**Features**: Authentication ✅ | Search ✅ | Recommendations ✅ | Library ✅ | Playlists ✅ | Polish ✅
