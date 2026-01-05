# 🎵 Music Streaming App

A modern, scalable music streaming application inspired by JioSaavn, built with React and Node.js.

## 📋 Project Overview

This is a full-stack music streaming platform that provides users with a seamless experience for discovering, playing, and managing their favorite music. The application is built with modern web technologies and follows industry-standard practices for scalability and maintainability.

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
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
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components (Home, Search, Library, Profile)
│       ├── player/         # Audio player logic and components
│       ├── services/       # API integration layer
│       ├── hooks/          # Custom React hooks
│       ├── context/        # React Context providers
│       ├── assets/         # Images, icons, fonts
│       ├── styles/         # Global styles and CSS modules
│       ├── App.jsx         # Root component
│       └── main.jsx        # Application entry point
│
├── backend/                # API Server
│   ├── src/
│   │   ├── routes/         # API route definitions
│   │   ├── controllers/    # Request handlers
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
└── README.md
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

## 🎯 Phase-1 Scope (Current)

### ✅ Completed
- Repository structure setup
- Frontend boilerplate (React + Vite)
- Backend boilerplate (Node.js + Express)
- Basic routing structure
- Health check API endpoint
- Development environment configuration
- Documentation

### ❌ Not Included (Future Phases)
- Music streaming logic
- Audio player implementation
- User authentication
- Database integration
- Music scraping/fetching
- Search functionality
- Playlist management
- User profiles

## 🔜 Next Steps

This foundation is ready for **Phase-2: Core Player & Song Listing** development.

## 📝 API Endpoints

### Health Check
- `GET /api/health` - Server health status

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

**Note:** This is a Phase-1 foundation setup. The application is structured for AI-assisted development and follows scalable architecture patterns.
