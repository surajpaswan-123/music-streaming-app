import supabase from '../config/supabase.js';

/**
 * Get user's playlists
 * GET /api/playlists
 */
export const getPlaylists = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch playlists'
    });
  }
};

/**
 * Get single playlist with songs
 * GET /api/playlists/:id
 */
export const getPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Get playlist
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (playlistError) {
      if (playlistError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Playlist not found'
        });
      }
      throw playlistError;
    }
    
    // Get playlist songs
    const { data: songs, error: songsError } = await supabase
      .from('playlist_songs')
      .select('*')
      .eq('playlist_id', id)
      .order('added_at', { ascending: false });
    
    if (songsError) throw songsError;
    
    res.status(200).json({
      success: true,
      data: {
        ...playlist,
        songs: songs
      }
    });
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch playlist'
    });
  }
};

/**
 * Create new playlist
 * POST /api/playlists
 */
export const createPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Playlist name is required'
      });
    }
    
    const { data, error } = await supabase
      .from('playlists')
      .insert({
        user_id: userId,
        name: name.trim(),
        description: description?.trim() || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      data: data
    });
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create playlist'
    });
  }
};

/**
 * Update playlist
 * PUT /api/playlists/:id
 */
export const updatePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;
    
    const updates = {};
    if (name) updates.name = name.trim();
    if (description !== undefined) updates.description = description?.trim() || null;
    
    const { data, error } = await supabase
      .from('playlists')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Playlist not found'
        });
      }
      throw error;
    }
    
    res.status(200).json({
      success: true,
      message: 'Playlist updated successfully',
      data: data
    });
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update playlist'
    });
  }
};

/**
 * Delete playlist
 * DELETE /api/playlists/:id
 */
export const deletePlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    const { error } = await supabase
      .from('playlists')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete playlist'
    });
  }
};

/**
 * Add song to playlist
 * POST /api/playlists/:id/songs
 */
export const addSongToPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { songId } = req.body;
    
    if (!songId) {
      return res.status(400).json({
        success: false,
        error: 'Song ID is required'
      });
    }
    
    // Verify playlist belongs to user
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (playlistError || !playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
    }
    
    // Add song to playlist
    const { data, error } = await supabase
      .from('playlist_songs')
      .insert({
        playlist_id: id,
        song_id: songId
      })
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Song added to playlist',
      data: data
    });
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add song to playlist'
    });
  }
};

/**
 * Remove song from playlist
 * DELETE /api/playlists/:id/songs/:songId
 */
export const removeSongFromPlaylist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, songId } = req.params;
    
    // Verify playlist belongs to user
    const { data: playlist, error: playlistError } = await supabase
      .from('playlists')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (playlistError || !playlist) {
      return res.status(404).json({
        success: false,
        error: 'Playlist not found'
      });
    }
    
    // Remove song from playlist
    const { error } = await supabase
      .from('playlist_songs')
      .delete()
      .eq('playlist_id', id)
      .eq('song_id', songId);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Song removed from playlist'
    });
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove song from playlist'
    });
  }
};
