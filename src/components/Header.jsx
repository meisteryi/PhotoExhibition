import React from 'react';
import { Camera, Grid, BookOpen, Settings } from 'lucide-react';

export default function Header({ viewMode, setViewMode, onOpenAdmin }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1.25rem 2rem',
      marginBottom: '2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Title & Slogan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Camera size={20} style={{ color: 'var(--text-secondary)' }} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 400,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}>
              YJH ARCHIVE
            </h1>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              letterSpacing: '1px',
              fontWeight: 300
            }}>
              조용히 흘러가는 순간들의 기록
            </p>
          </div>
        </div>

        {/* Bio & Location info (Desktop only) */}
        <div className="header-bio" style={{
          display: 'flex',
          gap: '2rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          fontWeight: 300
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Gear </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>Fujifilm X-T5, Sony A7IV</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Based </span>
            <span>Seoul, Korea</span>
          </div>
        </div>

        {/* Control Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px',
            padding: '2px'
          }}>
            <button
              onClick={() => setViewMode('archive')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '18px',
                fontSize: '0.8rem',
                fontWeight: 400,
                color: viewMode === 'archive' ? 'var(--text-primary)' : 'var(--text-muted)',
                background: viewMode === 'archive' ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
              title="아카이브 그리드 뷰"
            >
              <Grid size={14} />
              <span className="toggle-text">아카이브</span>
            </button>
            <button
              onClick={() => setViewMode('exhibition')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '18px',
                fontSize: '0.8rem',
                fontWeight: 400,
                color: viewMode === 'exhibition' ? 'var(--text-primary)' : 'var(--text-muted)',
                background: viewMode === 'exhibition' ? 'rgba(255,255,255,0.06)' : 'transparent',
                transition: 'var(--transition-fast)'
              }}
              title="모노그래프 전시 모드"
            >
              <BookOpen size={14} />
              <span className="toggle-text">전시회</span>
            </button>
          </div>

          {/* Admin Upload Trigger */}
          <button
            onClick={onOpenAdmin}
            style={{
              padding: '0.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              background: 'rgba(255,255,255,0.02)',
              color: 'var(--text-secondary)',
              transition: 'var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
            }}
            title="사진 등록"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* CSS overrides inside style tag for responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .header-bio {
            display: none !important;
          }
          .toggle-text {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
