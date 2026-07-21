import React, { useEffect, useState } from 'react';
import { X, Camera, Sliders, MapPin, Heart } from 'lucide-react';
import HeartButton from './HeartButton';

export default function DetailModal({ photo, likedPhotos, onLike, onClose }) {
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock scroll on background when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleDoubleTap = () => {
    if (!likedPhotos.includes(photo.id)) {
      onLike(photo.id);
    }
    // Show big heart splash animation
    setShowBigHeart(true);
    setTimeout(() => {
      setShowBigHeart(false), 800;
    }, 800);
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      handleDoubleTap();
    }
    setLastTap(now);
  };

  const isLiked = likedPhotos.includes(photo.id);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(28, 25, 23, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto', // Backstop scroll if display is smaller than card
        padding: '1.5rem',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel fade-in detail-modal-card"
        style={{
          display: 'flex',
          borderRadius: '12px',
          position: 'relative',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.15)',
          margin: 'auto', // Centers card safely in flex container
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Universal) */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-secondary)',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.background = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          <X size={16} />
        </button>

        {/* Left Side: Photo (PC View) */}
        <div
          onClick={handleTap}
          className="modal-photo-panel"
          style={{
            position: 'relative',
            backgroundColor: 'var(--bg-tertiary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <img
            src={photo.url}
            alt={photo.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
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
                size={80}
                fill="var(--accent)"
                color="var(--accent)"
                style={{
                  animation: 'doubleTapHeart 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
                }}
              />
            </div>
          )}
        </div>

        {/* Right Side: Details & Story (PC View) */}
        <div
          className="modal-details-panel"
          style={{
            backgroundColor: 'var(--bg-secondary)'
          }}
        >
          {/* Title and Date */}
          <div style={{
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem'
          }}>
            <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontWeight: 500
            }}>
              {photo.series}
            </span>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 400,
              color: 'var(--text-primary)',
              marginTop: '0.2rem'
            }}>
              {photo.title}
            </h2>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginTop: '0.3rem',
              display: 'block'
            }}>
              {photo.date}
            </span>
          </div>

          {/* Story Text */}
          <div style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1rem',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            overflowY: 'auto',
            flex: 1,
            marginBottom: '1.5rem',
            paddingRight: '0.5rem'
          }}
            className="story-scroll-area"
          >
            {photo.story}
          </div>

          {/* EXIF Metadata Card */}
          {photo.exif && (
            <div style={{
              padding: '1rem',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.01)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Camera size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{photo.exif.camera} • {photo.exif.lens}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sliders size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{photo.exif.aperture} • {photo.exif.shutter} • {photo.exif.iso}</span>
              </div>
              {photo.exif.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                  <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                  <span>{photo.exif.location}</span>
                </div>
              )}
            </div>
          )}

          {/* Heart Button footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            marginTop: 'auto',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(0,0,0,0.05)'
          }}>
            <HeartButton
              count={photo.hearts}
              isLiked={isLiked}
              onLike={() => onLike(photo.id)}
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Styled JSX for Responsive split layout */}
      <style>{`
        /* Desktop split dimensions */
        .detail-modal-card {
          width: 85vw;
          max-width: 1200px;
          height: 80vh;
          flex-direction: row;
          overflow: hidden; /* Contained on desktop */
        }

        .modal-photo-panel {
          flex: 1.8;
          height: 100%;
        }

        .modal-details-panel {
          flex: 1;
          height: 100%;
          padding: 2.5rem;
          border-left: 1px solid rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          min-height: 0; /* Restricts vertical growth inside flex layouts */
          overflow: hidden; /* Forces text container to shrink and scroll */
          box-sizing: border-box;
        }



        /* Mobile stacked dimensions */
        @media (max-width: 768px) {
          .detail-modal-card {
            width: 92vw;
            height: auto;
            max-height: 88vh;
            flex-direction: column;
            overflow-y: auto; /* Scrollable card on mobile */
            -webkit-overflow-scrolling: touch; /* Smooth iOS inertial scroll */
          }

          .modal-photo-panel {
            width: 100%;
            height: auto;
            aspect-ratio: 4/3;
            flex: none;
          }

          .modal-details-panel {
            width: 100%;
            height: auto;
            padding: 1.5rem;
            flex: none;
            border-left: none;
            border-top: 1px solid rgba(0, 0, 0, 0.06);
            display: flex;
            flex-direction: column;
            overflow: visible; /* Allows mobile panel to auto-size inside scroll */
            box-sizing: border-box;
          }

          .modal-close-btn {
            top: 0.75rem !important;
            right: 0.75rem !important;
            background: rgba(255, 255, 255, 0.9) !important;
          }
        }
      `}</style>
    </div>
  );
}
