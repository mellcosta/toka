import React, { useState, useEffect } from 'react';
import { useParams } from './Router';
import { Song } from '../types';
import { supabase } from '../lib/supabaseClient';
import SongCard from '../components/SongCard';

const ProfilePage: React.FC = () => {
  const { authorName } = useParams();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authorName) {
      fetchAuthorSongs();
    }
  }, [authorName]);

  const fetchAuthorSongs = async () => {
    try {
      const decodedName = decodeURIComponent(authorName || '');
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('author_name', decodedName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching author songs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  const decodedName = decodeURIComponent(authorName || '');

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{decodedName}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {songs.length} {songs.length === 1 ? 'song' : 'songs'}
        </p>
      </div>

      {songs.length === 0 ? (
        <div className="empty-state">
          <p>No songs uploaded yet.</p>
        </div>
      ) : (
        <div className="songs-grid">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
