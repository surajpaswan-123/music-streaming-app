/**
 * API Service Layer - Direct Supabase Integration
 * No backend server needed - uses Supabase JS client directly
 */

import { supabase } from '../config/supabase.js';

/**
 * Get current user session
 */
const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

/**
 * Get all songs from Supabase
 */
export async function fetchSongs() {
  try {
    console.log('📡 Fetching songs from Supabase...');
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error fetching songs:', error);
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No songs found in database');
      return [];
    }

    console.log(`✅ Successfully fetched ${data.length} songs`);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch songs:', error);
    throw error;
  }
}

/**
 * Get single song by ID
 */
export async function fetchSongById(id) {
  try {
    console.log(`📡 Fetching song ${id} from Supabase...`);
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('❌ Supabase error fetching song:', error);
      throw new Error(error.message);
    }

    console.log('✅ Successfully fetched song:', data);
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch song:', error);
    throw error;
  }
}

/**
 * Search songs by title or artist
 */
export async function searchSongs(query) {
  try {
    console.log(`🔍 Searching songs for: "${query}"`);
    
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .or(`title.ilike.%${query}%,artist.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error searching songs:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Found ${data?.length || 0} songs matching "${query}"`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to search songs:', error);
    throw error;
  }
}

/**
 * Get liked songs for current user
 */
export async function getLikedSongs() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.warn('⚠️ No user logged in');
      return [];
    }

    console.log('📡 Fetching liked songs...');
    
    const { data, error } = await supabase
      .from('liked_songs')
      .select(`
        *,
        songs (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error fetching liked songs:', error);
      throw new Error(error.message);
    }

    const songs = data?.map(item => item.songs) || [];
    console.log(`✅ Found ${songs.length} liked songs`);
    return songs;
  } catch (error) {
    console.error('❌ Failed to fetch liked songs:', error);
    throw error;
  }
}

/**
 * Like a song
 */
export async function likeSong(songId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to like songs');
    }

    console.log(`❤️ Liking song ${songId}...`);
    
    const { error } = await supabase
      .from('liked_songs')
      .insert({
        user_id: user.id,
        song_id: songId
      });

    if (error) {
      console.error('❌ Supabase error liking song:', error);
      throw new Error(error.message);
    }

    console.log('✅ Song liked successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to like song:', error);
    throw error;
  }
}

/**
 * Unlike a song
 */
export async function unlikeSong(songId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to unlike songs');
    }

    console.log(`💔 Unliking song ${songId}...`);
    
    const { error } = await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', user.id)
      .eq('song_id', songId);

    if (error) {
      console.error('❌ Supabase error unliking song:', error);
      throw new Error(error.message);
    }

    console.log('✅ Song unliked successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to unlike song:', error);
    throw error;
  }
}

/**
 * Check if song is liked by current user
 */
export async function checkIsLiked(songId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('liked_songs')
      .select('id')
      .eq('user_id', user.id)
      .eq('song_id', songId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Supabase error checking liked status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('❌ Failed to check liked status:', error);
    return false;
  }
}

/**
 * Get user's playlists
 */
export async function getPlaylists() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.warn('⚠️ No user logged in');
      return [];
    }

    console.log('📡 Fetching playlists...');
    
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error fetching playlists:', error);
      throw new Error(error.message);
    }

    console.log(`✅ Found ${data?.length || 0} playlists`);
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch playlists:', error);
    throw error;
  }
}

/**
 * Get single playlist with songs
 */
export async function getPlaylist(playlistId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to view playlists');
    }

    console.log(`📡 Fetching playlist ${playlistId}...`);
    
    const { data, error } = await supabase
      .from('playlists')
      .select(`
        *,
        playlist_songs (
          *,
          songs (*)
        )
      `)
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('❌ Supabase error fetching playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Successfully fetched playlist');
    return data;
  } catch (error) {
    console.error('❌ Failed to fetch playlist:', error);
    throw error;
  }
}

/**
 * Create new playlist
 */
export async function createPlaylist(name, description = '') {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to create playlists');
    }

    console.log(`📝 Creating playlist "${name}"...`);
    
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: user.id,
        name,
        description
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error creating playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Playlist created successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to create playlist:', error);
    throw error;
  }
}

/**
 * Update playlist
 */
export async function updatePlaylist(playlistId, name, description) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to update playlists');
    }

    console.log(`📝 Updating playlist ${playlistId}...`);
    
    const { data, error } = await supabase
      .from('playlists')
      .update({ name, description })
      .eq('id', playlistId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error updating playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Playlist updated successfully');
    return data;
  } catch (error) {
    console.error('❌ Failed to update playlist:', error);
    throw error;
  }
}

/**
 * Delete playlist
 */
export async function deletePlaylist(playlistId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to delete playlists');
    }

    console.log(`🗑️ Deleting playlist ${playlistId}...`);
    
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', playlistId)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Supabase error deleting playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Playlist deleted successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to delete playlist:', error);
    throw error;
  }
}

/**
 * Add song to playlist
 */
export async function addSongToPlaylist(playlistId, songId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to add songs to playlists');
    }

    console.log(`➕ Adding song ${songId} to playlist ${playlistId}...`);
    
    const { error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: playlistId,
        song_id: songId
      });

    if (error) {
      console.error('❌ Supabase error adding song to playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Song added to playlist successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to add song to playlist:', error);
    throw error;
  }
}

/**
 * Remove song from playlist
 */
export async function removeSongFromPlaylist(playlistId, songId) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('You must be logged in to remove songs from playlists');
    }

    console.log(`➖ Removing song ${songId} from playlist ${playlistId}...`);
    
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', playlistId)
      .eq('song_id', songId);

    if (error) {
      console.error('❌ Supabase error removing song from playlist:', error);
      throw new Error(error.message);
    }

    console.log('✅ Song removed from playlist successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to remove song from playlist:', error);
    throw error;
  }
}

// Health check - verify Supabase connection
export async function checkHealth() {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Health check failed:', error);
      return { status: 'error', message: error.message };
    }

    console.log('✅ Health check passed');
    return { status: 'ok', message: 'Supabase connection healthy' };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { status: 'error', message: error.message };
  }
}

export default {
  checkHealth,
  fetchSongs,
  fetchSongById,
  searchSongs,
  getLikedSongs,
  likeSong,
  unlikeSong,
  checkIsLiked,
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
};
