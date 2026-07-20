import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArchiveGrid from './components/ArchiveGrid';
import MonographView from './components/MonographView';
import AdminPanel from './components/AdminPanel';
import { defaultPhotos } from './data/defaultPhotos';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('archive'); // 'archive' or 'exhibition'
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Initialize data from LocalStorage or Default Mock Data
  useEffect(() => {
    const savedPhotos = localStorage.getItem('photo_exhibition_photos');
    if (savedPhotos) {
      let parsed = JSON.parse(savedPhotos);
      // Hotfix: Update photo-1's URL if it's the old broken Unsplash link
      parsed = parsed.map(p => {
        if (p.id === 'photo-1' && p.url.includes('1472214222541-d510753a4707')) {
          return {
            ...p,
            url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1200"
          };
        }
        return p;
      });
      setPhotos(parsed);
      localStorage.setItem('photo_exhibition_photos', JSON.stringify(parsed));
    } else {
      setPhotos(defaultPhotos);
      localStorage.setItem('photo_exhibition_photos', JSON.stringify(defaultPhotos));
    }

    const savedLikes = localStorage.getItem('photo_exhibition_likes');
    if (savedLikes) {
      setLikedPhotos(JSON.parse(savedLikes));
    } else {
      setLikedPhotos([]);
    }
  }, []);

  // Handle Liking a Photo (Heart reaction)
  const handleLike = (photoId) => {
    let updatedLikes;
    let increment = 0;

    if (likedPhotos.includes(photoId)) {
      // Unlike
      updatedLikes = likedPhotos.filter(id => id !== photoId);
      increment = -1;
    } else {
      // Like
      updatedLikes = [...likedPhotos, photoId];
      increment = 1;
    }

    setLikedPhotos(updatedLikes);
    localStorage.setItem('photo_exhibition_likes', JSON.stringify(updatedLikes));

    // Update photo heart count in list
    const updatedPhotos = photos.map(photo => {
      if (photo.id === photoId) {
        return {
          ...photo,
          hearts: Math.max(0, photo.hearts + increment)
        };
      }
      return photo;
    });

    setPhotos(updatedPhotos);
    localStorage.setItem('photo_exhibition_photos', JSON.stringify(updatedPhotos));
  };

  // Handle Uploading a new Photo
  const handleUpload = (newPhoto) => {
    const updatedPhotos = [newPhoto, ...photos]; // Prepend new photo to the front
    setPhotos(updatedPhotos);
    localStorage.setItem('photo_exhibition_photos', JSON.stringify(updatedPhotos));
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotoId(photoId);
    setViewMode('exhibition');
  };

  const handleBackToArchive = () => {
    setViewMode('archive');
    setSelectedPhotoId(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Site Header */}
      {viewMode === 'archive' && (
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1 }}>
        {viewMode === 'archive' ? (
          <ArchiveGrid
            photos={photos}
            onSelectPhoto={handleSelectPhoto}
            likedPhotos={likedPhotos}
          />
        ) : (
          <MonographView
            photos={photos}
            onLike={handleLike}
            likedPhotos={likedPhotos}
            selectedPhotoId={selectedPhotoId}
            onBackToArchive={handleBackToArchive}
          />
        )}
      </main>

      {/* Admin Panel Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onUpload={handleUpload}
        existingSeries={['전체', ...new Set(photos.map(p => p.series))]}
      />

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        fontFamily: 'var(--font-serif)',
        letterSpacing: '1px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <span>© {new Date().getFullYear()} YJH Photography Archive. All Rights Reserved.</span>
          <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>
            Built with React & Vanilla CSS • Single Heart Interaction
          </span>
        </div>
      </footer>
    </div>
  );
}
