import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ArchiveGrid from './components/ArchiveGrid';
import MonographView from './components/MonographView';
import UploadPanel from './components/UploadPanel';
import ManagerPanel from './components/ManagerPanel';
import DetailModal from './components/DetailModal';
import { defaultPhotos } from './data/defaultPhotos';

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [likedPhotos, setLikedPhotos] = useState([]);
  const [viewMode, setViewMode] = useState('archive'); // 'archive' or 'exhibition'
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

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

  const handleDeletePhoto = (photoId) => {
    if (window.confirm("정말 이 사진을 삭제하시겠습니까?")) {
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      setPhotos(updatedPhotos);
      localStorage.setItem('photo_exhibition_photos', JSON.stringify(updatedPhotos));
    }
  };

  const handleRenameCategory = (oldName, newName) => {
    const updatedPhotos = photos.map(p => {
      if (p.series === oldName) {
        return { ...p, series: newName || '미분류' };
      }
      return p;
    });
    setPhotos(updatedPhotos);
    localStorage.setItem('photo_exhibition_photos', JSON.stringify(updatedPhotos));
  };

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`'${categoryName}' 카테고리를 삭제하시겠습니까? 소속된 사진들은 '미분류'로 이동합니다.`)) {
      handleRenameCategory(categoryName, '미분류');
    }
  };

  const handleSelectPhoto = (photoId) => {
    setSelectedPhotoId(photoId);
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
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenManage={() => setIsManagerOpen(true)}
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

      {/* Detail Modal (Archive Pop-up Detail View) */}
      {viewMode === 'archive' && selectedPhotoId && (
        <DetailModal
          photo={photos.find(p => p.id === selectedPhotoId)}
          likedPhotos={likedPhotos}
          onLike={handleLike}
          onClose={() => setSelectedPhotoId(null)}
        />
      )}

      {/* Upload Photo Modal */}
      <UploadPanel
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        existingSeries={['전체', ...new Set(photos.map(p => p.series))]}
      />

      {/* Category & Content Manager Modal */}
      <ManagerPanel
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        photos={photos}
        onDeletePhoto={handleDeletePhoto}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
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
