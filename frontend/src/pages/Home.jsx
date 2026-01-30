import React, { useEffect, useState } from 'react';
import { fetchSongs } from '../services/api';
import { getLikedSongs } from '../services/api';
import { getRecommendations, getRecentlyPlayed } from '../services/recommendations';
import { useAuth } from '../context/AuthContext';
import { usePlayer } from '../context/PlayerContext';
import SongCard from '../components/SongCard';
import HeroSongCard from '../components/HeroSongCard';
import { supabase } from '../config/supabase';
import './Home.css';

function Home() {
  const [songs, setSongs] = useState([]); // stories/episodes
  const [recommendedSongs, setRecommendedSongs] = useState([]); // recommended stories
  const [recentlyPlayed, setRecentlyPlayed] = useState([]); // recently listened stories
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, getAccessToken } = useAuth();
  const { currentSong, playSong } = usePlayer(); // currentStory, playStory

  useEffect(() => {
    loadSongs();

    // Real-time listener for instant updates
    console.log('🔄 Setting up real-time listener for stories...');
    
    const channel = supabase
      .channel('songs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'songs' // stories table
        },
        (payload) => {
          console.log('🔥 Real-time update detected:', payload);
          console.log('🔄 Reloading stories automatically...');
          loadSongs();
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
      });

    return () => {
      console.log('🔌 Unsubscribing from real-time updates...');
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📖 Home: Loading stories...');

      const allSongs = await fetchSongs(); // fetch stories
      
      console.log('📖 Home: Received stories:', allSongs);
      console.log('📖 Home: Stories count:', allSongs?.length || 0);

      if (!Array.isArray(allSongs)) {
        console.error('❌ Home: fetchSongs() did not return an array:', allSongs);
        throw new Error('Invalid data format received from fetchSongs()');
      }

      setSongs(allSongs);

      const recent = getRecentlyPlayed();
      setRecentlyPlayed(recent);

      if (user) {
        try {
          const token = await getAccessToken();
          const likedSongs = await getLikedSongs(token); // liked stories
          
          console.log('❤️ Home: Liked stories:', likedSongs);

          const likedData = Array.isArray(likedSongs) ? likedSongs : [];

          const likedSongObjects = likedData
            .map(liked => allSongs.find(song => song.id === liked.song_id))
            .filter(Boolean);

          const recommended = getRecommendations(
            allSongs,
            likedSongObjects,
            currentSong,
            recent
          );
          setRecommendedSongs(recommended);
        } catch (err) {
          console.error('⚠️ Home: Failed to load recommendations:', err);
        }
      } else {
        const shuffled = [...allSongs].sort(() => 0.5 - Math.random());
        setRecommendedSongs(shuffled.slice(0, 6));
      }

      console.log('✅ Home: Stories loaded successfully');

    } catch (err) {
      console.error('❌ Home: Failed to load stories:', err);
      setError(err.message || 'Failed to load stories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0], songs); // play first story
    }
  };

  // Find featured story (has banner)
  const featuredSong = songs.find(song => song.show_banner && song.banner_url);
  
  // Other stories (excluding featured)
  const otherSongs = featuredSong 
    ? songs.filter(song => song.id !== featuredSong.id)
    : songs;

  if (loading) {
    return (
      <div className="page home-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading stories...</p>
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
          <h2>Discover Stories</h2>
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

      {/* Recommended Section with Hero Card */}
      {recommendedSongs.length > 0 && (
        <section className="music-section">
          <div className="section-header">
            <h3>
              {user ? '🎯 Recommended for You' : '🔥 Popular Stories'}
            </h3>
            <p className="section-subtitle">
              {user ? 'Based on your listening history' : 'Trending now'}
            </p>
          </div>
          <div className="songs-grid">
            {/* Hero Card with Banner Background (if featured story exists) */}
            {featuredSong && <HeroSongCard song={featuredSong} />}
            
            {/* Regular Story Cards */}
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

      {/* All Stories Section */}
      <section className="music-section">
        <div className="section-header">
          <h3>📚 All Stories</h3>
          <p className="section-subtitle">
            {songs.length} {songs.length === 1 ? 'story' : 'stories'} available
          </p>
        </div>
        {songs.length === 0 ? (
          <div className="empty-state">
            <p>No stories available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="songs-grid">
            {/* Hero Card with Banner Background (if featured story exists) */}
            {featuredSong && <HeroSongCard song={featuredSong} />}
            
            {/* Other Story Cards */}
            {otherSongs.map(song => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
