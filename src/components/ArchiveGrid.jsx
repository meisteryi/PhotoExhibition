import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function ArchiveGrid({ 
  photos, 
  onSelectPhoto, 
  likedPhotos, 
  activeCategory, 
  setActiveCategory,
  categories = []
}) {

  // Filter photos based on category
  const filteredPhotos = activeCategory === '전체'
    ? photos
    : photos.filter(p => p.series === activeCategory);

  return (
    <div className="fade-in container" style={{ paddingBottom: '8rem' }}>
      {/* Category Navigation (Minimalist Serif Links) */}
      <nav 
        className="category-scroll-nav"
        style={{
          display: 'flex',
          gap: '2.5rem',
          marginBottom: '3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
          paddingBottom: '1rem',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem'
        }}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1rem',
                letterSpacing: '1px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                opacity: isActive ? 1 : 0.5,
                transition: 'var(--transition-fast)',
                padding: '0.5rem 0',
                position: 'relative',
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.opacity = 0.85;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.opacity = 0.5;
              }}
            >
              {category}
              {/* Active Underline */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  width: '80%',
                  height: '1px',
                  background: 'var(--text-primary)',
                  display: 'block'
                }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Masonry Grid Layout */}
      {filteredPhotos.length === 0 ? (
        <div key={activeCategory} className="category-fade-in" style={{
          textAlign: 'center',
          padding: '8rem 0',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-serif)',
          fontSize: '1.2rem',
          fontStyle: 'italic'
        }}>
          등록된 사진이 없습니다.
        </div>
      ) : (
        <div key={activeCategory} className="masonry-grid category-fade-in">
          {filteredPhotos.map((photo) => {
            const isLiked = likedPhotos.includes(photo.id);
            return (
              <div
                key={photo.id}
                className="masonry-item"
                onClick={() => onSelectPhoto(photo.id)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)'
                }}
              >
                {/* Photo Image */}
                <img
                  src={photo.url}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    display: 'block',
                    transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden'
                  }}
                  className="grid-image"
                />

                {/* Hover Details Overlay */}
                <div
                  className="grid-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(to top, rgba(246, 245, 240, 0.96) 0%, rgba(246, 245, 240, 0.6) 60%, rgba(246, 245, 240, 0) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '1.5rem',
                    opacity: 0,
                    transition: 'opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '1.5px'
                      }}>
                        {photo.series}
                      </span>
                      <h3 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: 'var(--text-primary)'
                      }}>
                        {photo.title}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.8 }}>
                        {photo.date}
                      </span>
                    </div>

                    {/* Like Counter Indicator */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: isLiked ? 'var(--accent)' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      background: 'rgba(0, 0, 0, 0.03)',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.06)'
                    }}>
                      <Heart size={12} fill={isLiked ? 'var(--accent)' : 'none'} />
                      <span style={{ fontWeight: 500 }}>{photo.hearts}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded CSS for Masonry grid responsiveness and image hover scale */}
      <style>{`
        .category-scroll-nav {
          justify-content: center;
        }
        .category-scroll-nav::-webkit-scrollbar {
          display: none;
        }
        @media (max-width: 1024px) {
          .category-scroll-nav {
            justify-content: flex-start;
          }
        }

        .masonry-grid {
          column-count: 3;
          column-gap: 2rem;
        }

        @keyframes categoryFade {
          from {
            opacity: 0;
            filter: blur(4px);
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }

        .category-fade-in {
          animation: categoryFade 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .masonry-item {
          break-inside: avoid;
          margin-bottom: 2rem;
          transform: translateY(0);
          transition: transform 1.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 1.5s ease;
        }

        .grid-image {
          will-change: transform;
          backface-visibility: hidden;
        }

        .masonry-item:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 0, 0, 0.12);
        }

        .masonry-item:hover .grid-image {
          transform: scale(1.05);
        }

        .masonry-item:hover .grid-overlay {
          opacity: 1 !important;
        }

        @media (max-width: 1024px) {
          .masonry-grid {
            column-count: 2;
            column-gap: 1.5rem;
          }
          .masonry-item {
            margin-bottom: 1.5rem;
          }
        }

        @media (max-width: 600px) {
          .masonry-grid {
            column-count: 1;
            column-gap: 0;
          }
          .grid-overlay {
            opacity: 1 !important; /* Always visible on mobile touch */
            background: linear-gradient(to top, rgba(246, 245, 240, 0.98) 0%, rgba(246, 245, 240, 0.55) 70%, rgba(246, 245, 240, 0) 100%) !important;
          }
        }
      `}</style>
    </div>
  );
}
