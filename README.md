# 🎵 Music Streaming App

A modern, scalable music streaming application inspired by JioSaavn, built with React and Node.js.

## 📋 Project Overview

This is a full-stack music streaming platform that provides users with a seamless experience for discovering, playing, and managing their favorite music. The application is built with modern web technologies and follows industry-standard practices for scalability and maintainability.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Context API** - State management
- **HTML5 Audio API** - Audio playback
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **RESTful API** - API architecture

### Development Tools
- **Git** - Version control
- **npm** - Package manager

## 📁 Project Structure

```
music-streaming-app/
├── frontend/                # React Application
│   ├── public/             # Static assets
│   └── src/
│       ├── components/     # Reusable UI components (SongCard)
│       ├── pages/          # Page components (Home, Search, Library, Profile)
│       ├── player/         # Audio player component
│       ├── services/       # API integration layer
│       ├── hooks/          # Custom React hooks
│       ├── context/        # React Context (PlayerContext)
│       ├── assets/         # Images, icons, fonts
│       ├── styles/         # Global styles and CSS modules
│       ├── App.jsx         # Root component
│       └── main.jsx        # Application entry point
│
├── backend/                # API Server
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
│   │   ├── data/           # Sample song data
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── app.js          # Express app setup
│   ├── package.json
│   └── README.md
│
├── database/
│   └── schema.md           # Database design documentation
│
├── .gitignore
├── .env.example
├── README.md
└── SETUP.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/surajpaswan-123/music-streaming-app.git
   cd music-streaming-app
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp ../.env.example .env
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## ✨ Features (Phase-2 Complete)

### ✅ Implemented
- **Song Listing**: Browse 10 sample songs with cover art
- **Audio Player**: Fully functional player with:
  - Play/Pause controls
  - Next/Previous track navigation
  - Progress bar with seek functionality
  - Volume control
  - Current song display
- **Search**: Real-time song search by title, artist, or album
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

### 🎵 Audio Player Features
- Global state management using React Context
- Persistent player across page navigation
- Auto-play next song when current ends
- Visual playing indicator on active song
- Keyboard-friendly controls
- Smooth animations and transitions

### 🎯 API Endpoints

#### Songs
- `GET /api/songs` - Get all songs
- `GET /api/songs/:id` - Get single song by ID
- `GET /api/songs/search?q=query` - Search songs

#### Health
- `GET /api/health` - Server health status

## 🎨 UI Components

- **SongCard**: Interactive song cards with hover effects and play buttons
- **AudioPlayer**: Bottom-fixed player with full controls
- **Search Bar**: Real-time search with clear functionality
- **Loading Spinner**: Animated loading states
- **Error Messages**: User-friendly error displays

## 📝 Sample Data

The app uses 10 royalty-free sample songs with:
- High-quality cover images from Unsplash
- Sample audio from SoundHelix
- Metadata (title, artist, album, duration)

**Note**: All audio files are royalty-free samples for demonstration purposes.

## 🎯 Phase Status

### ✅ Phase-1: Foundation Setup (Complete)
- Repository structure
- Frontend boilerplate (React + Vite)
- Backend boilerplate (Node.js + Express)
- Basic routing
- Documentation

### ✅ Phase-2: Core Player & Song Listing (Complete)
- Song listing API with sample data
- Functional audio player with all controls
- Song selection and playback
- Search functionality
- Responsive UI
- Loading and error states

### 🔜 Phase-3: Coming Soon
- User authentication
- Playlist creation and management
- User library
- Favorites/Liked songs
- Database integration (Supabase)

## 🧪 Testing the App

1. **Start both servers** (backend on :5000, frontend on :5173)
2. **Browse songs** on the Home page
3. **Click any song** to start playback
4. **Use player controls**:
   - Play/Pause button
   - Next/Previous buttons
   - Seek by clicking progress bar
   - Adjust volume with slider
5. **Search songs** using the Search page
6. **Navigate pages** - player persists across routes

## 🤝 Contributing

This project follows industry-standard coding practices. Please ensure:
- Clean, readable code
- Meaningful commit messages
- Proper documentation
- No hardcoded secrets or API keys

## 📄 License

MIT License

## 👨‍💻 Author

Suraj Paswan

---

**Current Status**: Phase-2 Complete - Core music streaming functionality is live! 🎉

**Repository**: https://github.com/surajpaswan-123/music-streaming-app
