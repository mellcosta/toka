import { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import UploadModal from './components/UploadModal';
import { Router } from './components/Router';
import './index.css';

function App() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Listen for path changes
  useState(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  });

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    // Refresh the page to show new song
    window.location.reload();
  };

  const renderPage = () => {
    if (currentPath.startsWith('/profile/')) {
      return <ProfilePage />;
    }
    return <HomePage />;
  };

  return (
    <Router>
      <div id="root">
        <Header onUploadClick={() => setShowUploadModal(true)} />
        {renderPage()}
        {showUploadModal && (
          <UploadModal 
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={handleUploadSuccess}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
