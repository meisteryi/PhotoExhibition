import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

export default function UploadPanel({ isOpen, onClose, onUpload, existingSeries = [] }) {
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
                  onClick={() => { setImageFile(null); setImagePreview(''); }}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--text-muted)',
                borderRadius: '6px',
                padding: '3rem 1rem',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.2)',
                transition: 'var(--transition-fast)',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.4)';
                e.currentTarget.style.borderColor = 'var(--text-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'var(--text-muted)';
              }}
              >
                <Upload size={24} style={{ color: 'var(--text-secondary)' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>사진 파일 업로드 (.jpg, .png 등)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Title input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              기록 제목 *
            </label>
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%', fontSize: '0.85rem' }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="사진의 제목을 적어주세요"
              required
            />
          </div>

          {/* Category Select / Add */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              시리즈 (카테고리) *
            </label>

            {!isAddingNewSeries ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="glass-input"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                >
                  <option value="" disabled>시리즈 선택</option>
                  {existingSeries.filter(s => s !== '전체').map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsAddingNewSeries(true)}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    fontWeight: 500,
                    whiteSpace: 'nowrap'
                  }}
                >
                  + 새 시리즈 만들기
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="glass-input"
                  style={{ flex: 1, fontSize: '0.85rem' }}
                  value={newSeriesName}
                  onChange={(e) => setNewSeriesName(e.target.value)}
                  placeholder="새 시리즈 이름 입력"
                />
                <button
                  type="button"
                  onClick={() => setIsAddingNewSeries(false)}
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  기존 선택
                </button>
              </div>
            )}
          </div>

          {/* Date Picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              날짜 *
            </label>
            <input
              type="text"
              className="glass-input"
              style={{ width: '100%', fontSize: '0.85rem' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="예: 2026. 07. 20"
              required
            />
          </div>

          {/* Story TextArea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              에세이 / 스토리 *
            </label>
            <textarea
              className="glass-input"
              rows={4}
              style={{ width: '100%', fontSize: '0.85rem', lineHeight: '1.6', fontFamily: 'inherit' }}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="사진 뒤에 깃든 에세이나 이야기를 들려주세요"
              required
            />
          </div>

          {/* EXIF Metadata Slots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.25rem' }}>
              카메라 촬영 정보 (EXIF - 선택)
            </span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Camera Body</span>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                  placeholder="예: Fujifilm X-T5"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Lens</span>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={lens}
                  onChange={(e) => setLens(e.target.value)}
                  placeholder="예: XF 35mm F1.4"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Aperture</span>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  placeholder="예: f/1.4"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Shutter Speed</span>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={shutter}
                  onChange={(e) => setShutter(e.target.value)}
                  placeholder="예: 1/250s"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ISO</span>
                <input
                  type="text"
                  className="glass-input"
                  style={{ width: '100%', fontSize: '0.75rem', padding: '4px 8px' }}
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  placeholder="예: ISO 400"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Location</span>
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
