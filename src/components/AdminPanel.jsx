import React, { useState, useEffect } from 'react';
import { X, Upload, Camera, Sliders, MapPin } from 'lucide-react';

export default function AdminPanel({ isOpen, onClose, onUpload, existingSeries = [] }) {
  const [title, setTitle] = useState('');
  const [series, setSeries] = useState(existingSeries[1] || '');
  const [newSeriesName, setNewSeriesName] = useState('');
  const [isAddingNewSeries, setIsAddingNewSeries] = useState(false);
  const [story, setStory] = useState('');
  const [date, setDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // EXIF states
  const [camera, setCamera] = useState('Fujifilm X-T5');
  const [lens, setLens] = useState('XF 35mm F1.4 R');
  const [aperture, setAperture] = useState('f/1.4');
  const [shutter, setShutter] = useState('1/250s');
  const [iso, setIso] = useState('ISO 400');
  const [location, setLocation] = useState('Seoul, South Korea');

  // Set default date as today
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setDate(`${yyyy}. ${mm}. ${dd}`);
  }, [isOpen]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !story || !imagePreview) {
      alert('사진과 제목, 이야기는 필수 항목입니다.');
      return;
    }

    const finalSeries = isAddingNewSeries ? newSeriesName : series;
    if (!finalSeries) {
      alert('시리즈(카테고리)를 선택하거나 생성해주세요.');
      return;
    }

    const newPhoto = {
      id: `photo-${Date.now()}`,
      title,
      series: finalSeries,
      url: imagePreview, // Base64 data URL
      story,
      date,
      hearts: 0,
      exif: {
        camera,
        lens,
        aperture,
        shutter,
        iso,
        location
      }
    };

    onUpload(newPhoto);

    // Reset Form
    setTitle('');
    setStory('');
    setImageFile(null);
    setImagePreview('');
    setIsAddingNewSeries(false);
    setNewSeriesName('');
    onClose();
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
        backgroundColor: 'rgba(28, 25, 23, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel fade-in"
        style={{
          width: '100%',
          maxWidth: '650px',
          maxHeight: '90vh',
          borderRadius: '12px',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative'
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
          marginBottom: '1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          paddingBottom: '0.5rem'
        }}>
          새로운 기록 올리기
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* File Upload Slot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              사진 선택 *
            </label>
            
            {imagePreview ? (
              <div style={{
                position: 'relative',
                borderRadius: '6px',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)',
                aspectRatio: '16/9',
                background: 'black'
              }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    borderRadius: '50%',
                    padding: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '16/9',
                border: '1px dashed rgba(0, 0, 0, 0.15)',
                borderRadius: '6px',
                cursor: 'pointer',
                background: 'rgba(0,0,0,0.01)',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.01)';
              }}
              >
                <Upload size={24} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>사진 파일을 선택하세요</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  required
                />
              </label>
            )}
          </div>

          {/* Title input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="admin-title" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              제목 *
            </label>
            <input
              id="admin-title"
              type="text"
              className="glass-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="사진의 제목을 입력해 주세요"
              required
            />
          </div>

          {/* Category Series Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="admin-series" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              시리즈 (카테고리) *
            </label>
            {!isAddingNewSeries ? (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <select
                  id="admin-series"
                  className="glass-input"
                  style={{ flex: 1 }}
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                >
                  {existingSeries.filter(s => s !== '전체').map((s) => (
                    <option key={s} value={s} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingNewSeries(true)}
                  style={{
                    padding: '0 1rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(0, 0, 0, 0.02)',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)'}
                >
                  새 시리즈 생성
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  className="glass-input"
                  style={{ flex: 1 }}
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  placeholder="새 시리즈명을 입력해 주세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsAddingNewSeries(false)}
                  style={{
                    padding: '0 1rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(0, 0, 0, 0.02)'
                  }}
                >
                  취소
                </button>
              </div>
            )}
          </div>

          {/* Story Textarea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="admin-story" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              기록할 이야기 *
            </label>
            <textarea
              id="admin-story"
              className="glass-input"
              style={{ minHeight: '120px', resize: 'vertical', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="사진 뒤에 숨겨진 이야기나 상념을 기록해 주세요"
              required
            />
          </div>

          {/* EXIF Metadata Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              촬영 정보 (EXIF)
            </span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.01)',
              border: '1px solid rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  placeholder="바디 (예: Fujifilm X-T5)"
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={lens}
                  onChange={(e) => setLens(e.target.value)}
                  placeholder="렌즈 (예: XF 35mm F1.4 R)"
                />
              </div>
              <input
                type="text"
                className="glass-input"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                value={aperture}
                onChange={(e) => setAperture(e.target.value)}
                placeholder="조리개 (예: f/1.4)"
              />
              <input
                type="text"
                className="glass-input"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                value={shutter}
                onChange={(e) => setShutter(e.target.value)}
                placeholder="셔터 스피드 (예: 1/250s)"
              />
              <input
                type="text"
                className="glass-input"
                style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                value={iso}
                onChange={(e) => setIso(e.target.value)}
                placeholder="ISO (예: ISO 100)"
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="촬영 장소 (예: Seoul, Korea)"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '0.5rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            paddingTop: '1rem'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: '0.5rem 2rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
                color: 'white',
                background: 'var(--accent)',
                transition: 'var(--transition-fast)',
                fontWeight: 500
              }}
              onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
            >
              업로드
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
