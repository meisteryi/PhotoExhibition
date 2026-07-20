import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function HeartButton({ count, isLiked, onLike, size = 20, style = {} }) {
  const [particles, setParticles] = useState([]);
  const [isAnimate, setIsAnimate] = useState(false);

  const triggerAnimation = () => {
    setIsAnimate(true);
    setTimeout(() => setIsAnimate(false), 800);

    // Create 8 floating particles radiating outwards
    const newParticles = Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45 * Math.PI) / 180 + (Math.random() * 0.2 - 0.1);
      const distance = 40 + Math.random() * 30;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const scale = 0.5 + Math.random() * 0.5;
      
      return {
        id: Date.now() + i,
        x,
        y,
        scale,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // Clear particles after animation runs (1000ms)
    setTimeout(() => {
      setParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onLike();
    triggerAnimation();
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block', ...style }}>
      <button
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: isLiked ? 'rgba(244, 63, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isLiked ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
          color: isLiked ? 'var(--accent)' : 'var(--text-secondary)',
          transition: 'var(--transition-fast)',
          boxShadow: isLiked ? '0 0 15px rgba(244, 63, 94, 0.05)' : 'none'
        }}
        className={isAnimate ? 'pulse-animation' : ''}
        onMouseEnter={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLiked) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }
        }}
      >
        <Heart
          size={size}
          fill={isLiked ? 'var(--accent)' : 'none'}
          style={{
            transition: 'transform 0.2s ease, fill 0.2s ease',
            transform: isAnimate ? 'scale(1.2)' : 'scale(1)'
          }}
        />
        <span style={{ 
          fontSize: '0.85rem', 
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums'
        }}>
          {count}
        </span>
      </button>

      {/* Heart Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            position: 'absolute',
            left: '35%',
            top: '25%',
            transform: 'translate(-50%, -50%)',
            '--x': `${p.x}px`,
            '--y': `${p.y}px`,
            '--scale': p.scale,
            display: 'block'
          }}
        >
          <Heart size={10} fill="var(--accent)" />
        </span>
      ))}

      {/* CSS dynamic positioning using custom properties */}
      <style>{`
        .particle {
          animation: floatCustomParticle 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes floatCustomParticle {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(var(--x), var(--y)) scale(var(--scale));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
