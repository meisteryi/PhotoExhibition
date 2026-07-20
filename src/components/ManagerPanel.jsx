import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ManagerPanel({
  isOpen,
  onClose,
  photos = [],
  onDeletePhoto,
  onRenameCategory,
  onDeleteCategory
}) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryVal, setEditCategoryVal] = useState('');

  // Handle Esc key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll on background when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const startEditCategory = (cat) => {
    setEditingCategory(cat);
    setEditCategoryVal(cat);
  };

  const saveEditCategory = (oldCat) => {
    if (!editCategoryVal.trim() || editCategoryVal === oldCat) {
      setEditingCategory(null);
      return;
    }
    onRenameCategory(oldCat, editCategoryVal.trim());
    setEditingCategory(null);
  };

  if (!isOpen) return null;

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
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '3rem 1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel fade-in"
        style={{
          width: '100%',
          maxWidth: '650px',
          borderRadius: '12px',
          padding: '2.5rem',
          position: 'relative',
          margin: 'auto 0',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            color: 'var(--text-secondary)',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.5rem',
          fontWeight: 400,
          marginBottom: '1.75rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          paddingBottom: '0.6rem'
        }}>
          기록 및 카테고리 관리
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* 1. Category Management Section */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
              paddingBottom: '0.4rem'
            }}>
              시리즈(카테고리) 관리
            </h3>
            
            {/* Category List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1rem' }}>
              {[...new Set(photos.map(p => p.series))].filter(Boolean).map((cat) => (
                <div
                  key={cat}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.01)',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  {editingCategory === cat ? (
                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                      <input
                        type="text"
                        value={editCategoryVal}
                        onChange={(e) => setEditCategoryVal(e.target.value)}
                        className="glass-input"
                        style={{ flex: 1, padding: '4px 8px', fontSize: '0.8rem' }}
                      />
                      <button
                        onClick={() => saveEditCategory(cat)}
                        style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500 }}
                      >
                        저장
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}
                      >
                        취소
                      </button>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {cat} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({photos.filter(p => p.series === cat).length}장)</span>
                      </span>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => startEditCategory(cat)}
                          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}
                        >
                          이름 변경
                        </button>
                        <button
                          onClick={() => onDeleteCategory(cat)}
                          style={{ fontSize: '0.75rem', color: 'var(--accent)' }}
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Photo Content Management Section */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.1rem',
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              borderBottom: '1px solid rgba(0,0,0,0.04)',
              paddingBottom: '0.4rem'
            }}>
              업로드한 사진 관리 ({photos.length}장)
            </h3>

            {/* Photos List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(0, 0, 0, 0.01)',
                    border: '1px solid rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(0,0,0,0.05)' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {photo.title}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {photo.series} • {photo.date}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeletePhoto(photo.id)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      fontSize: '0.75rem',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-glow)',
                      borderRadius: '4px',
                      background: 'transparent',
                      transition: 'var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--accent-glow)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Close Action */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            paddingTop: '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 2rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'white',
                background: 'var(--text-primary)',
                transition: 'var(--transition-fast)',
                fontWeight: 500
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
