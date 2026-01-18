# TOKA 🎵

A lightweight, modern music-sharing platform built with React, TypeScript, Vite, and Supabase.

## Features

✅ **Music Streaming** - Upload and stream audio files (MP3, WAV)  
✅ **Reactions** - Like songs with session-based tracking  
✅ **Comments** - Engage with flat comments on each song  
✅ **Profiles** - View songs by specific artists  
✅ **Light/Dark Mode** - Seamless theme switching  
✅ **No Auth Required** - Simple MVP without user authentication  
✅ **Modern UI** - Clean, minimal design with Violet (#7C3AED) and Green (#22C55E) accents

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (Database + Storage)
- **Styling**: CSS Variables for theming
- **State Management**: React Hooks

## Project Structure

```
toka/
├── src/
│   ├── components/
│   │   ├── CommentsModal.tsx    # Comments UI
│   │   ├── Header.tsx            # App header with theme toggle
│   │   ├── Router.tsx            # Simple client-side routing
│   │   ├── SongCard.tsx          # Song display card
│   │   └── UploadModal.tsx       # Upload song form
│   ├── lib/
│   │   └── supabaseClient.ts     # Supabase configuration
│   ├── pages/
│   │   ├── HomePage.tsx          # Main song feed
│   │   └── ProfilePage.tsx       # Author profile
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── DATABASE_SCHEMA.md            # SQL schema for Supabase
├── .env                          # Environment variables
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Setup Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `DATABASE_SCHEMA.md`:
   - Create `songs` table
   - Create `comments` table
   - Create `reactions` table

### 4. Setup Storage

1. Go to Storage in Supabase dashboard
2. Create a new bucket named `songs`
3. Make it **public** (for audio streaming)
4. Apply the storage policies from `DATABASE_SCHEMA.md`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

### Uploading Songs

1. Click "Upload Song" button in the header
2. Fill in the song title and your name
3. Select an audio file (MP3 or WAV, max 50MB)
4. Click "Upload Song"

### Listening to Music

- Browse songs on the home page
- Click play on any audio player
- Like songs with the ❤️ button
- Open comments with the 💬 button

### Profiles

- Click on any author name to view their profile
- See all songs uploaded by that author

### Theme Switching

- Click the 🌙/☀️ button in the header
- Theme preference is saved to localStorage

## Color Palette

- **Primary (Violet)**: `#7C3AED`
- **Accent (Green)**: `#22C55E`
- **Light Mode**:
  - Background: `#F8FAFC`
  - Card: `#FFFFFF`
  - Text: `#0F172A`
- **Dark Mode**:
  - Background: `#0F172A`
  - Card: `#1E293B`
  - Text: `#E5E7EB`

## TypeScript Types

```typescript
interface Song {
  id: string;
  title: string;
  author_name: string;
  audio_url: string;
  created_at: string;
}

interface Comment {
  id: string;
  song_id: string;
  author_name: string;
  content: string;
  created_at: string;
}

interface Reaction {
  id: string;
  song_id: string;
  session_id: string;
  created_at: string;
}
```

## Future Enhancements

- 🔐 User authentication
- 📝 Playlists
- 🔍 Search functionality
- 🎨 Waveform visualization
- 📱 Mobile app
- 🔔 Notifications
- 👥 Follow artists
- 🎧 Queue management

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

MIT

## Contributing

This is an MVP project. Feel free to fork and extend!

---

Built with ❤️ using React, TypeScript, and Supabase
