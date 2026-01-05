/**
 * Sample Song Data
 * Using royalty-free audio samples for demonstration
 * Audio URLs point to publicly available sample files
 */

export const sampleSongs = [
  {
    id: "1",
    title: "Summer Breeze",
    artist: "Acoustic Dreams",
    album: "Chill Vibes",
    duration: "3:45",
    durationSeconds: 225,
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "2",
    title: "Midnight Jazz",
    artist: "The Smooth Collective",
    album: "Late Night Sessions",
    duration: "4:12",
    durationSeconds: 252,
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "3",
    title: "Electric Dreams",
    artist: "Synth Wave",
    album: "Neon Nights",
    duration: "3:28",
    durationSeconds: 208,
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  },
  {
    id: "4",
    title: "Ocean Waves",
    artist: "Nature Sounds",
    album: "Relaxation",
    duration: "5:30",
    durationSeconds: 330,
    cover: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
  },
  {
    id: "5",
    title: "Urban Rhythm",
    artist: "City Beats",
    album: "Street Life",
    duration: "3:55",
    durationSeconds: 235,
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
  },
  {
    id: "6",
    title: "Mountain Echo",
    artist: "Folk Wanderers",
    album: "Wilderness",
    duration: "4:45",
    durationSeconds: 285,
    cover: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
  },
  {
    id: "7",
    title: "Digital Pulse",
    artist: "Electronic Minds",
    album: "Future Sound",
    duration: "3:18",
    durationSeconds: 198,
    cover: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
  },
  {
    id: "8",
    title: "Sunset Boulevard",
    artist: "Smooth Jazz Trio",
    album: "Evening Moods",
    duration: "4:20",
    durationSeconds: 260,
    cover: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: "9",
    title: "Rainy Day",
    artist: "Ambient Collective",
    album: "Atmospheric",
    duration: "5:15",
    durationSeconds: 315,
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
  },
  {
    id: "10",
    title: "Cosmic Journey",
    artist: "Space Explorers",
    album: "Beyond Stars",
    duration: "6:00",
    durationSeconds: 360,
    cover: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=300&h=300&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
  }
];

/**
 * Get all songs
 */
export const getAllSongs = () => {
  return sampleSongs;
};

/**
 * Get song by ID
 */
export const getSongById = (id) => {
  return sampleSongs.find(song => song.id === id);
};

/**
 * Search songs by title or artist
 */
export const searchSongs = (query) => {
  const lowerQuery = query.toLowerCase();
  return sampleSongs.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album.toLowerCase().includes(lowerQuery)
  );
};
