import React from 'react';
import { Camera, Grid, BookOpen } from 'lucide-react';

export default function Header({ viewMode, setViewMode, onOpenUpload, onOpenManage }) {
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
            onClick={onOpenUpload}
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
            title="기록 업로드"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </button>

          {/* Admin Manage Trigger */}
          <button
            onClick={onOpenManage}
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
            title="기록 및 카테고리 관리"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14" />
              <line x1="4" y1="10" x2="4" y2="3" />
              <line x1="12" y1="21" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12" y2="3" />
              <line x1="20" y1="21" x2="20" y2="16" />
              <line x1="20" y1="12" x2="20" y2="3" />
              <line x1="1" y1="14" x2="7" y2="14" />
              <line x1="9" y1="8" x2="15" y2="8" />
              <line x1="17" y1="16" x2="23" y2="16" />
            </svg>
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
