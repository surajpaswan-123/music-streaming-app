import React, { useEffect, useState } from 'react';
import { fetchSongs } from '../services/api';
import { getLikedSongs } from '../services/api';
import { getRecommendations, getRecentlyPlayed } from '../services/recommendations';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import SongBanner from '../components/SongBanner';
import { supabase } from '../config/supabase';
import './Home.css';

function Home() {
  const [songs, setSongs] = useState([]);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAccessToken } = useAuth();
  const { currentSong, playSong } = usePlayer();

  useEffect(() => {
    loadSongs();

    // 🔥 REAL-TIME LISTENER - Auto-refresh on Supabase changes
    console.log('🔄 Setting up real-time listener for songs table...');
    
    const channel = supabase
      .channel('songs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'songs'
        },
        (payload) => {
          console.log('🔥 Real-time update detected:', payload);
          console.log('🔄 Reloading songs automatically...');
          
          // Reload songs when any change happens
          loadSongs();
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    // Cleanup on unmount
    return () => {
      console.log('🔌 Unsubscribing from real-time updates...');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🎵 Home: Loading songs...');

      // Fetch all songs - fetchSongs() returns data directly, not { data: [...] }
      // This includes banner_url and show_banner fields
      const allSongs = await fetchSongs();
      
      console.log('🎵 Home: Received songs:', allSongs);
      console.log('🎵 Home: Songs count:', allSongs?.length || 0);

      // Validate data
      if (!Array.isArray(allSongs)) {
        console.error('❌ Home: fetchSongs() did not return an array:', allSongs);
        throw new Error('Invalid data format received from fetchSongs()');
      }

      setSongs(allSongs);

      // Get recently played
      const recent = getRecentlyPlayed();
      setRecentlyPlayed(recent);

      // Get recommendations if user is logged in
      if (user) {
        try {
          const token = await getAccessToken();
          const likedSongs = await getLikedSongs(token);
          
          console.log('❤️ Home: Liked songs:', likedSongs);

          // Validate liked songs data
          const likedData = Array.isArray(likedSongs) ? likedSongs : [];

          // Map liked song IDs to full song objects
          const likedSongObjects = likedData
            .map(liked => allSongs.find(song => song.id === liked.song_id))
            .filter(Boolean);

          // Get recommendations
          const recommended = getRecommendations(
            allSongs,
            likedSongObjects,
            currentSong,
            recent
          );
          setRecommendedSongs(recommended);
        } catch (err) {
          console.error('⚠️ Home: Failed to load recommendations:', err);
          // Continue without recommendations - not critical
        }
      } else {
        // For non-logged in users, show random songs as recommendations
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        setRecommendedSongs(shuffled.slice(0, 6));
      }

      console.log('✅ Home: Songs loaded successfully');

    } catch (err) {
      console.error('❌ Home: Failed to load songs:', err);
      setError(err.message || 'Failed to load songs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs);
    }
  };

  const handleBannerPlay = (song) => {
    playSong(song, songs);
  };

  // Filter songs with banners (show_banner === true AND banner_url exists)
  const songsWithBanners = songs.filter(song => song.show_banner && song.banner_url);

  if (loading) {
    return (
      <div className="page home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page home-page">
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button onClick={loadSongs} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <div className="home-header">
        <div className="header-content">
          <h2>Discover Music</h2>
          <p className="header-subtitle">
            {user ? `Welcome back, ${user.email.split('@')[0]}!` : 'Explore our collection'}
          </p>
        </div>
        {songs.length > 0 && (
          <button className="play-all-btn" onClick={handlePlayAll}>
            ▶️ Play All
          </button>
        )}
      </div>

      {/* Banner Section - Data-Driven with Real-time Updates */}
      {songsWithBanners.length > 0 && (
        <section className="banner-section">
          {songsWithBanners.map(song => (
            <SongBanner 
              key={`banner-${song.id}`} 
              song={song} 
              onPlayClick={handleBannerPlay}
            />
          ))}
        </section>
      )}

      {/* Recommended Section */}
      {recommendedSongs.length > 0 && (
        <section className="music-section">
          <div className="section-header">
            <h3>
              {user ? '🎯 Recommended for You' : '🔥 Popular Songs'}
            </h3>
            <p className="section-subtitle">
              {user ? 'Based on your listening history' : 'Trending now'}
            </p>
          </div>
          <div className="songs-grid">
            {recommendedSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Played Section */}
      {recentlyPlayed.length > 0 && (
        <section className="music-section">
          <div className="section-header">
            <h3>🕐 Recently Played</h3>
            <p className="section-subtitle">Pick up where you left off</p>
          </div>
          <div className="songs-grid">
            {recentlyPlayed.slice(0, 6).map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {/* All Songs Section */}
      <section className="music-section">
        <div className="section-header">
          <h3>🎵 All Songs</h3>
          <p className="section-subtitle">
            {songs.length} {songs.length === 1 ? 'song' : 'songs'} available
          </p>
        </div>
        {songs.length === 0 ? (
          <div className="empty-state">
            <p>No songs available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="songs-grid">
            {songs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
