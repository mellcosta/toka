import React, { useState, useEffect, useCallback } from 'react';
import type { Song } from '../types';
import { supabase } from '../lib/supabaseClient';
import CommentsModal from './CommentsModal';

interface SongCardProps {
  song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  const getSessionId = useCallback(() => {
    let sessionId = localStorage.getItem('toka_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('toka_session_id', sessionId);
    }
    return sessionId;
  }, []);

  const fetchLikes = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('reactions')
        .select('*', { count: 'exact', head: true })
        .eq('song_id', song.id);

      if (error) throw error;
      setLikes(count || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }, [song.id]);

  const fetchCommentCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('song_id', song.id);

      if (error) throw error;
      setCommentCount(count || 0);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  }, [song.id]);

  const checkIfLiked = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from('reactions')
        .select('id')
        .eq('song_id', song.id)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  }, [song.id, getSessionId]);

  useEffect(() => {
    fetchLikes();
    fetchCommentCount();
    checkIfLiked();
  }, [fetchLikes, fetchCommentCount, checkIfLiked]);

  const toggleLike = async () => {
    try {
      const sessionId = getSessionId();

      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('song_id', song.id)
          .eq('session_id', sessionId);

        if (error) throw error;
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        // Like
        const { error } = await supabase
          .from('reactions')
          .insert({ song_id: song.id, session_id: sessionId });

        if (error) throw error;
        setLikes(likes + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <>
      <div className="song-card">
        <div className="song-header">
          <h3 className="song-title">{song.title}</h3>
          <a 
            href={`/profile/${encodeURIComponent(song.author_name)}`} 
            className="song-author"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = `/profile/${encodeURIComponent(song.author_name)}`;
            }}
          >
            by {song.author_name}
          </a>
        </div>

        <audio 
          controls 
          className="audio-player"
          preload="metadata"
        >
          <source src={song.audio_url} type="audio/mpeg" />
          <source src={song.audio_url} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>

        <div className="song-actions">
          <button 
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={toggleLike}
          >
            <span>❤️</span>
            <span>{likes}</span>
          </button>

          <button 
            className="action-btn"
            onClick={() => setShowComments(true)}
          >
            <span>💬</span>
            <span>{commentCount}</span>
          </button>
        </div>
      </div>

      {showComments && (
        <CommentsModal 
          song={song} 
          onClose={() => setShowComments(false)}
          onCommentAdded={() => setCommentCount(commentCount + 1)}
        />
      )}
    </>
  );
};

export default SongCard;
