import React, { useState, useEffect } from 'react';
import { Song, Comment } from '../types';
import { supabase } from '../lib/supabaseClient';

interface CommentsModalProps {
  song: Song;
  onClose: () => void;
  onCommentAdded: () => void;
}

const CommentsModal: React.FC<CommentsModalProps> = ({ song, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [song.id]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('song_id', song.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authorName.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          song_id: song.id,
          author_name: authorName.trim(),
          content: content.trim(),
        });

      if (error) throw error;

      setAuthorName('');
      setContent('');
      fetchComments();
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Comments</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="comments-section">
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Your name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                required
                style={{ minHeight: '80px' }}
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
                No comments yet. Be the first to comment!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-author">{comment.author_name}</div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-date">{formatDate(comment.created_at)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
