import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import AudioPlayer from './player/AudioPlayer';
import './styles/App.css';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>🎵 Music Streaming App</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/search">Search</a>
              <a href="/library">Library</a>
              <a href="/profile">Profile</a>
            </nav>
          </header>
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>

          <AudioPlayer />
        </div>
      </Router>
    </PlayerProvider>
  );
}

export default App;
