import React, { useEffect, useState } from 'react';
import { Camera, MapPin, Sliders, Heart } from 'lucide-react';
import HeartButton from './HeartButton';

export default function MonographView({ 
  photos, 
  onLike, 
  likedPhotos, 
  selectedPhotoId, 
  onBackToArchive 
}) {
  const [doubleTapStates, setDoubleTapStates] = useState({}); // { photoId: boolean }
  const [activeOverlayId, setActiveOverlayId] = useState(null); // Toggled overlay for mobile/touch
  const [lastTap, setLastTap] = useState(0);

  // Lock body scroll to force scrolling in the snap container
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Scroll to selected photo when entering from Archive Grid
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
    if (!likedPhotos.includes(photoId)) {
      onLike(photoId);
    }
    // Show big heart splash animation
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
    } else {
      // Toggle overlay on mobile/single tap
      setActiveOverlayId(activeOverlayId === photoId ? null : photoId);
    }
    setLastTap(now);
  };

  return (
    <div className="fade-in monograph-view-wrapper" style={{ paddingBottom: '0rem' }}>
      {/* Subtle fixed back arrow button */}
      <button
        onClick={onBackToArchive}
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          background: 'transparent',
          border: 'none',
          padding: '0.5rem',
          cursor: 'pointer',
          transition: 'var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        title="아카이브로 돌아가기"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="12" x2="4" y2="12"></line>
          <polyline points="10 18 4 12 10 6"></polyline>
        </svg>
      </button>

      {/* Full-Screen Slides Container */}
      <div className="slides-container">
        {photos.map((photo, index) => {
          const isLiked = likedPhotos.includes(photo.id);
          const showBigHeart = doubleTapStates[photo.id];
          const isOverlayOpen = activeOverlayId === photo.id;

          // Deterministic organic tilt (e.g., between -1.5 and 1.5 degrees)
          const rotation = (index % 2 === 0 ? -1 : 1) * (1.2 - (index % 3) * 0.3);

          return (
            <section
              key={photo.id}
              id={photo.id}
              className="slide-section"
            >
              {/* Photo Frame Container */}
              <div
                className={`photo-frame ${isOverlayOpen ? 'overlay-active' : ''}`}
                onClick={handleTap(photo.id)}
                style={{
                  transform: `rotate(${rotation}deg)`
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="exhibition-image"
                />

                {/* Big Double Tap Heart Overlay */}
                {showBigHeart && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
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

                {/* Hover / Tap Editorial Overlay Card */}
                <div className={`editorial-overlay ${isOverlayOpen ? 'visible' : ''}`}>
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                    {/* Header: Title & Date */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      paddingBottom: '0.5rem',
                      marginBottom: '0.75rem'
                    }}>
                      <h2 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.4rem',
                        fontWeight: 400,
                        color: 'var(--text-primary)'
                      }}>
                        {photo.title}
                      </h2>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {photo.date}
                      </span>
                    </div>

                    {/* Body: Story Text */}
                    <div style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.95rem',
                      lineHeight: '1.7',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'pre-line',
                      overflowY: 'auto',
                      maxHeight: '180px',
                      marginBottom: '0.75rem',
                      paddingRight: '0.25rem'
                    }}>
                      {photo.story}
                    </div>

                    {/* Footer: EXIF Details & Heart button */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                      paddingTop: '0.75rem',
                      marginTop: 'auto'
                    }}>
                      {/* EXIF summary */}
                      {photo.exif && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Camera size={11} />
                            <span>{photo.exif.camera} • {photo.exif.lens}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Sliders size={11} />
                            <span>{photo.exif.aperture} • {photo.exif.shutter}</span>
                          </div>
                          {photo.exif.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={11} />
                              <span>{photo.exif.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Heart Like Trigger */}
                      <HeartButton
                        count={photo.hearts}
                        isLiked={isLiked}
                        onLike={() => onLike(photo.id)}
                        size={16}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Responsive layout CSS overrides specifically for PC/Landscape centered galleries */}
      <style>{`
        .slides-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100vh; /* Full viewport height */
          overflow-y: scroll;
          scroll-snap-type: y mandatory;
          scroll-behavior: smooth;
        }

        .slide-section {
          width: 100%;
          height: 100vh; /* Full viewport snap */
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          flex-shrink: 0;
          box-sizing: border-box;
          padding: 2rem 0;
        }

        /* Large side margins for PC and mobile landscape screens */
        .photo-frame {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70vw; /* PC margins - leaves 15% each side */
          max-width: 1100px;
          height: 100%;
          background: transparent;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .exhibition-image {
          max-width: 100%;
          max-height: 70vh; /* Fits completely on screen with massive margins */
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
        }

        /* Pure photo layout - overlay starts hidden */
        .editorial-overlay {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          width: 90%;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 6px;
          padding: 1.25rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 12px 30px rgba(0,0,0,0.06);
          z-index: 15;
        }

        /* Tap/Click reveals details on Mobile/Touch/PC */
        .photo-frame.overlay-active .editorial-overlay,
        .editorial-overlay.visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
          pointer-events: auto;
        }

        @media (max-width: 768px) {
          .slides-container {
            height: 100vh; /* Full viewport height on mobile */
          }

          .slide-section {
            height: 100vh; /* Full slide snap on mobile portrait */
            padding: 1rem 0;
          }

          .photo-frame {
            width: 100vw; /* Take full width on mobile screen */
            height: 100%;
          }

          .exhibition-image {
            max-height: 65vh;
            border-radius: 0;
            width: 100%;
          }

          .editorial-overlay {
            width: 92%;
            bottom: 1.5rem;
          }
        }

        /* Mobile Landscape View Specific - Force single screen snap with margins */
        @media (max-height: 480px) and (orientation: landscape) {
          .slides-container {
            height: 100vh;
          }
          .slide-section {
            height: 100vh;
            padding: 0.5rem 0;
          }
          .photo-frame {
            width: 60vw;
          }
          .exhibition-image {
            max-height: 85vh;
          }
        }
      `}</style>
    </div>
  );
}
