import React, { useState, useEffect } from 'react';
import type { Song } from '../types';
import { supabase } from '../lib/supabaseClient';
import SongCard from '../components/SongCard';

const HomePage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading songs...</div>;
  }

  if (songs.length === 0) {
    return (
      <div className="empty-state">
        <p>No songs yet. Be the first to upload!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1rem', fontSize: '2rem' }}>Discover Music</h1>
      <div className="songs-grid">
        {songs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
