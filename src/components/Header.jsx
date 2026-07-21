import React from 'react';

export default function Header({ viewMode, setViewMode, onOpenUpload, onOpenManage }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 2rem',
      marginBottom: '2.5rem',
      borderBottom: '1px solid rgba(0, 0, 0, 0.03)',
      background: 'rgba(246, 245, 240, 0.85)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem'
      }}>
        {/* Title */}
        <div>
          <h1 
            onClick={() => setViewMode('archive')}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 400,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              margin: 0
            }}
          >
            YJH ARCHIVE
          </h1>
        </div>

        {/* Control Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {/* View Mode Toggle Text Links */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('archive')}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                color: 'var(--text-primary)',
                opacity: viewMode === 'archive' ? 1 : 0.35,
                background: 'transparent',
                border: 'none',
                padding: '0.25rem 0',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                borderBottom: viewMode === 'archive' ? '1px solid var(--text-primary)' : '1px solid transparent'
              }}
              title="아카이브 그리드 뷰"
            >
              아카이브
            </button>
            <button
              onClick={() => setViewMode('exhibition')}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                color: 'var(--text-primary)',
                opacity: viewMode === 'exhibition' ? 1 : 0.35,
                background: 'transparent',
                border: 'none',
                padding: '0.25rem 0',
                cursor: 'pointer',
                transition: 'opacity 0.3s ease',
                borderBottom: viewMode === 'exhibition' ? '1px solid var(--text-primary)' : '1px solid transparent'
              }}
              title="모노그래프 전시 모드"
            >
              전시회
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '1rem' }}>
            {/* Admin Upload Trigger */}
            <button
              onClick={onOpenUpload}
              style={{
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                opacity: 0.4,
                cursor: 'pointer',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
              title="기록 업로드"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>

            {/* Admin Manage Trigger */}
            <button
              onClick={onOpenManage}
              style={{
                padding: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-primary)',
                opacity: 0.4,
                cursor: 'pointer',
                transition: 'opacity 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.85}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.4}
              title="기록 및 카테고리 관리"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
      </div>
    </header>
  );
}
