import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import InstallPopup from './components/InstallPopup';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AudioPlayer from './player/AudioPlayer';
import './styles/App.css';

function Navigation() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="app-header">
      <h1>📖 SunoNA</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/search">Search</a>
        {user && <a href="/library">Library</a>}
        {user && <a href="/profile">Profile</a>}
      </nav>
      <div className="auth-actions">
        {user ? (
          <>
            <span className="user-email">{user.email}</span>
            <button onClick={handleSignOut} className="signout-btn">
              Sign Out
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="login-link">Login</a>
            <a href="/signup" className="signup-link">Sign Up</a>
          </>
        )}
      </div>
    </header>
  );
}

function AppRoutes() {
  return (
    <div className="app">
      <Navigation />
      
      {/* PWA Install Popup */}
      <InstallPopup />
      
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AudioPlayer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <AppRoutes />
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
