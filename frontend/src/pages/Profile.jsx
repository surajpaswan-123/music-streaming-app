import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="page profile-page">
        <div className="empty-state">
          <h2>Sign in to view your profile</h2>
          <a href="/login" className="cta-button">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="page profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.email.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>Profile</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-meta">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="profile-sections">
          <div className="profile-section">
            <h2>Account Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">User ID</span>
                <span className="info-value">{user.id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Status</span>
                <span className="info-value status-active">Active</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button 
                className="action-btn"
                onClick={() => navigate('/library')}
              >
                <span className="action-icon">❤️</span>
                <span>View Library</span>
              </button>
              <button 
                className="action-btn"
                onClick={() => navigate('/')}
              >
                <span className="action-icon">🎵</span>
                <span>Browse Music</span>
              </button>
              <button 
                className="action-btn"
                onClick={() => navigate('/search')}
              >
                <span className="action-icon">🔍</span>
                <span>Search Songs</span>
              </button>
            </div>
          </div>

          <div className="profile-section danger-zone">
            <h2>Account Actions</h2>
            <button 
              className="signout-button"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
