import supabase from '../config/supabase.js';

/**
 * Get user's liked songs
 * GET /api/library/liked
 */
export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const { data, error } = await supabase
      .from('liked_songs')
      .select('*')
      .eq('user_id', userId)
      .order('liked_at', { ascending: false });
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      count: data.length,
      data: data
    });
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch liked songs'
    });
  }
};

/**
 * Like a song
 * POST /api/library/like/:songId
 */
export const likeSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;
    
    const { data, error } = await supabase
      .from('liked_songs')
      .insert({
        user_id: userId,
        song_id: songId
      })
      .select()
      .single();
    
    if (error) {
      // Handle duplicate like
      if (error.code === '23505') {
        return res.status(400).json({
          success: false,
          error: 'Song already liked'
        });
      }
      throw error;
    }
    
    res.status(201).json({
      success: true,
      message: 'Song liked successfully',
      data: data
    });
  } catch (error) {
    console.error('Error liking song:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like song'
    });
  }
};

/**
 * Unlike a song
 * DELETE /api/library/unlike/:songId
 */
export const unlikeSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;
    
    const { error } = await supabase
      .from('liked_songs')
      .delete()
      .eq('user_id', userId)
      .eq('song_id', songId);
    
    if (error) throw error;
    
    res.status(200).json({
      success: true,
      message: 'Song unliked successfully'
    });
  } catch (error) {
    console.error('Error unliking song:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unlike song'
    });
  }
};

/**
 * Check if song is liked
 * GET /api/library/is-liked/:songId
 */
export const isLiked = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;
    
    const { data, error } = await supabase
      .from('liked_songs')
      .select('id')
      .eq('user_id', userId)
      .eq('song_id', songId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    res.status(200).json({
      success: true,
      isLiked: !!data
    });
  } catch (error) {
    console.error('Error checking liked status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check liked status'
    });
  }
};
