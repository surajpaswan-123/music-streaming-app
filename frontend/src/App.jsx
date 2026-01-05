import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import './styles/App.css';

function App() {
  return (
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

        <footer className="app-footer">
          <p>Phase-1: Foundation Setup Complete</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
