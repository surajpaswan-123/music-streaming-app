# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v18+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)
- ✅ Git installed (`git --version`)

## Step-by-Step Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/surajpaswan-123/music-streaming-app.git
cd music-streaming-app
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp ../.env.example .env

# Start development server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

Test it: Open `http://localhost:5000/api/health` in your browser

### 3️⃣ Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

Open `http://localhost:5173` in your browser to see the app!

## 🎯 What You Should See

### Backend (http://localhost:5000)
```json
{
  "message": "Music Streaming API",
  "version": "1.0.0",
  "status": "running"
}
```

### Frontend (http://localhost:5173)
- Navigation bar with Home, Search, Library, Profile links
- Placeholder content for each page
- Audio player shell at the bottom

## 📂 Project Structure Overview

```
music-streaming-app/
├── frontend/          # React app (Port 5173)
│   ├── src/
│   │   ├── pages/     # Home, Search, Library, Profile
│   │   ├── player/    # Audio player component
│   │   └── services/  # API integration
│   └── package.json
│
├── backend/           # Express API (Port 5000)
│   ├── src/
│   │   ├── routes/    # API endpoints
│   │   └── controllers/
│   └── package.json
│
└── database/          # DB schema docs
```

## 🛠️ Available Commands

### Backend
```bash
npm start      # Production mode
npm run dev    # Development mode (auto-reload)
```

### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

## 🔍 Testing the Setup

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Frontend Pages**
   - Home: http://localhost:5173/
   - Search: http://localhost:5173/search
   - Library: http://localhost:5173/library
   - Profile: http://localhost:5173/profile

## ⚠️ Common Issues

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 5173 (frontend)
npx kill-port 5173
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Ensure backend is running on port 5000
- Check Vite proxy configuration in `frontend/vite.config.js`

## 🎓 Next Steps

This is **Phase-1: Foundation Setup**. The following are NOT implemented yet:
- ❌ Music playback
- ❌ Search functionality
- ❌ User authentication
- ❌ Database integration
- ❌ Playlist management

Wait for **Phase-2: Core Player & Song Listing** instructions.

## 📚 Documentation

- Main README: [README.md](./README.md)
- Backend README: [backend/README.md](./backend/README.md)
- Database Schema: [database/schema.md](./database/schema.md)

## 🤝 Development Guidelines

1. **Commit Messages**: Use conventional commits
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `chore:` for maintenance

2. **Code Style**: Follow existing patterns
3. **No Secrets**: Never commit API keys or passwords

## 💡 Tips

- Keep both terminals open (frontend + backend)
- Use browser DevTools for debugging
- Check console for errors
- API calls go through Vite proxy automatically

---

**Ready to build?** 🚀 Both servers should be running and you should see the app in your browser!
