import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Sliders, Eye, ArrowLeft, Heart } from 'lucide-react';
import HeartButton from './HeartButton';

export default function MonographView({ 
  photos, 
  onLike, 
  likedPhotos, 
  selectedPhotoId, 
  onBackToArchive 
}) {
  const [doubleTapStates, setDoubleTapStates] = useState({}); // { photoId: boolean } to show big heart
  const [lastTap, setLastTap] = useState(0);

  // Auto-scroll to selected photo if opened from Grid
  useEffect(() => {
    if (selectedPhotoId) {
      setTimeout(() => {
        const element = document.getElementById(selectedPhotoId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedPhotoId]);

  const handlePhotoDoubleTap = (photoId) => {
    // Register like
    if (!likedPhotos.includes(photoId)) {
      onLike(photoId);
    }

    // Trigger big overlay heart animation
    setDoubleTapStates(prev => ({ ...prev, [photoId]: true }));
    setTimeout(() => {
      setDoubleTapStates(prev => ({ ...prev, [photoId]: false }));
    }, 800);
  };

  const handleTap = (photoId) => (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handlePhotoDoubleTap(photoId);
    }
    setLastTap(now);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '10rem' }}>
      {/* Back Button */}
      <div className="container" style={{ marginBottom: '2rem' }}>
        <button
          onClick={onBackToArchive}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          아카이브 그리드로 돌아가기
        </button>
      </div>

      {/* Monograph Feed */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8rem',
        alignItems: 'center'
      }}>
        {photos.map((photo) => {
          const isLiked = likedPhotos.includes(photo.id);
          const showBigHeart = doubleTapStates[photo.id];

          return (
            <article
              key={photo.id}
              id={photo.id}
              style={{
                width: '100%',
                maxWidth: '850px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2.5rem',
                padding: '0 1rem'
              }}
            >
              {/* Photo Container with Double Tap Heart Overlay */}
              <div
                onClick={handleTap(photo.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#04060b',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.03)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    userSelect: 'none',
                    pointerEvents: 'none' // Prevents default browser drag select
                  }}
                />

                {/* Big Double Tap Heart Overlay */}
                {showBigHeart && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}>
                    <Heart
                      size={100}
                      fill="var(--accent)"
                      color="var(--accent)"
                      style={{
                        animation: 'doubleTapHeart 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                      }}
                    />
                  </div>
                )}

                {/* Double Tap Hint Overlay on Hover */}
                <div 
                  className="double-tap-hint"
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.6)',
                    pointerEvents: 'none',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                >
                  더블 탭하여 좋아요
                </div>
              </div>

              {/* Story Content & Info */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                padding: '0 0.5rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  paddingBottom: '0.75rem'
                }}>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.8rem',
                    fontWeight: 400,
                    letterSpacing: '1px',
                  }}>
                    {photo.title}
                  </h2>
                  <span style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    fontFamily: 'var(--font-sans)'
                  }}>
                    {photo.date}
                  </span>
                </div>

                {/* Story Body */}
                <div style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.05rem',
                  lineHeight: '1.9',
                  color: 'rgba(248, 250, 252, 0.85)',
                  whiteSpace: 'pre-line',
                  letterSpacing: '0.5px'
                }}>
                  {photo.story}
                </div>

                {/* EXIF Metadata Card */}
                {photo.exif && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    padding: '1rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.01)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Camera size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{photo.exif.camera} • {photo.exif.lens}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sliders size={13} style={{ color: 'var(--text-muted)' }} />
                      <span>{photo.exif.aperture} • {photo.exif.shutter} • {photo.exif.iso}</span>
                    </div>
                    {photo.exif.location && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                        <MapPin size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{photo.exif.location}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Heart Reaction Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  marginTop: '0.5rem'
                }}>
                  <HeartButton
                    count={photo.hearts}
                    isLiked={isLiked}
                    onLike={() => onLike(photo.id)}
                    size={18}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <style>{`
        /* Show double tap hint on image hover */
        article:hover .double-tap-hint {
          opacity: 1 !important;
        }

        @media (max-width: 768px) {
          article {
            gap: 1.5rem !important;
          }
          h2 {
            font-size: 1.4rem !important;
          }
          .exif-location {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
