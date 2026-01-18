import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UploadModalProps {
  onClose: () => void;
  onUploadSuccess: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUploadSuccess }) => {
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload an MP3 or WAV file');
        return;
      }
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }
      setAudioFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !authorName.trim() || !audioFile) {
      alert('Please fill in all fields and select an audio file');
      return;
    }

    setUploading(true);
    try {
      // Upload audio file to Supabase Storage
      const fileExt = audioFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(filePath, audioFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('songs')
        .getPublicUrl(filePath);

      // Save song metadata to database
      const { error: dbError } = await supabase
        .from('songs')
        .insert({
          title: title.trim(),
          author_name: authorName.trim(),
          audio_url: publicUrl,
        });

      if (dbError) throw dbError;

      alert('Song uploaded successfully!');
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Failed to upload song. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Upload Song</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Song Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter song title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Name *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={50}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Audio File * (MP3 or WAV, max 50MB)</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="audio-file"
                accept="audio/mpeg,audio/mp3,audio/wav"
                onChange={handleFileChange}
                required
              />
              <label htmlFor="audio-file">
                <div style={{ fontSize: '3rem' }}>🎵</div>
                <div style={{ marginTop: '0.5rem', color: 'var(--text-primary)' }}>
                  Click to select audio file
                </div>
                {audioFile && (
                  <div className="file-name">
                    Selected: {audioFile.name}
                  </div>
                )}
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={uploading}
            style={{ width: '100%' }}
          >
            {uploading ? 'Uploading...' : 'Upload Song'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
