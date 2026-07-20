import React, { useEffect, useState, useRef } from 'react';
import { Camera, MapPin, Sliders, Heart } from 'lucide-react';
import HeartButton from './HeartButton';

// Custom requestAnimationFrame smooth scroll helper with easeInOutCubic easing
const smoothScrollTo = (element, target, duration, onComplete) => {
  const start = element.scrollTop;
  const change = target - start;
  let startTime = null;

  const animateScroll = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    // easeInOutCubic calculation
    const t = timeElapsed / (duration / 2);
    let val = 0;
    if (t < 1) {
      val = (change / 2) * t * t * t + start;
    } else {
      const u = t - 2;
      val = (change / 2) * (u * u * u + 2) + start;
    }

    element.scrollTop = val;

    if (timeElapsed < duration) {
      requestAnimationFrame(animateScroll);
    } else {
      element.scrollTop = target;
      if (onComplete) onComplete();
    }
  };

  requestAnimationFrame(animateScroll);
};

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
  const containerRef = useRef(null);

  const handleScrollNav = (direction) => {
    const container = containerRef.current;
    if (!container) return;

    const slideHeight = container.clientHeight;
    const currentScroll = Math.round(container.scrollTop);

    let targetScroll;
    if (direction === 'up') {
      targetScroll = Math.max(0, currentScroll - slideHeight);
    } else {
      targetScroll = Math.min(container.scrollHeight - slideHeight, currentScroll + slideHeight);
    }

    // Disable scroll-snap during animation to prevent browser scroll friction conflicts
    container.style.scrollSnapType = 'none';

    // Glide smoothly over 1.5 seconds (easeInOutCubic)
    smoothScrollTo(container, targetScroll, 1500, () => {
      // Re-enable scroll-snap once in position to maintain native snapping on manual scroll
      container.style.scrollSnapType = 'y mandatory';
    });
  };

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
        className="back-arrow-btn"
        title="아카이브로 돌아가기"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="20" y1="12" x2="4" y2="12"></line>
          <polyline points="10 18 4 12 10 6"></polyline>
        </svg>
      </button>

      {/* Full-Screen Slides Container */}
      <div ref={containerRef} className="slides-container">
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

      {/* Fixed up/down navigation buttons (PC/Landscape only) */}
      <div className="navigation-controls" style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <button
          onClick={() => handleScrollNav('up')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
          }}
          title="이전 사진"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
        </button>
        <button
          onClick={() => handleScrollNav('down')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            background: 'rgba(255, 255, 255, 0.4)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '50%',
            width: '42px',
            height: '42px',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)';
            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)';
          }}
          title="다음 사진"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>

      {/* Responsive layout CSS overrides specifically for PC/Landscape centered galleries */}
      <style>{`
        .back-arrow-btn {
          position: fixed;
          top: 2rem;
          left: 2rem;
          z-index: 150;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          background: transparent;
          border: none;
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .back-arrow-btn:hover {
          color: var(--text-secondary);
        }

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
          transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .exhibition-image {
          max-width: 100%;
          max-height: 70vh; /* Fits completely on screen with massive margins */
          object-fit: contain;
          border-radius: 4px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
          transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
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
          transition: opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1), transform 1.5s cubic-bezier(0.16, 1, 0.3, 1);
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
          .back-arrow-btn {
            top: 1.5rem;
            left: 1.5rem;
            width: auto;
            height: auto;
            border-radius: 0;
            background: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border: none;
            color: var(--text-secondary); /* Elegant charcoal line arrow for contrast */
            padding: 0.5rem;
            box-shadow: none;
            z-index: 999;
          }

          .navigation-controls {
            display: none !important;
          }

          .slides-container {
            height: 100vh; /* Full viewport height on mobile */
          }

          .slide-section {
            height: 100vh; /* Full slide snap on mobile portrait */
            padding: 1rem 0;
          }

          .photo-frame {
            width: 100vw;
            height: 100%;
            overflow: visible; /* Prevents rotated image corners from being cropped */
          }

          .exhibition-image {
            max-width: 90vw; /* Safety horizontal margins to prevent screen-edge cropping when tilted */
            max-height: 65vh;
            object-fit: contain;
            border-radius: 2px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          }

          .editorial-overlay {
            width: 90vw;
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
