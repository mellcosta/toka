export interface Song {
  id: string;
  title: string;
  author_name: string;
  audio_url: string;
  created_at: string;
}

export interface Comment {
  id: string;
  song_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

export interface Reaction {
  id: string;
  song_id: string;
  session_id: string;
  created_at: string;
}
