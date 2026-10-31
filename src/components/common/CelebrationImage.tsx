import React, { useState } from 'react';
import { getAssetUrl } from '../../utils/assetHelper';
import { Sparkles } from 'lucide-react';

export interface CelebrationImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  priority?: boolean;
  overlay?: React.ReactNode;
  fallbackTitle?: string;
  borderRadius?: string;
}

export const CelebrationImage: React.FC<CelebrationImageProps> = ({
  src,
  webpSrc,
  alt,
  aspectRatio = '16/10',
  className = '',
  style = {},
  imgStyle = {},
  priority = false,
  overlay,
  fallbackTitle = 'Utsav Celebration',
  borderRadius = 'var(--radius-lg)',
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Compute resolved URLs with GitHub Pages subpath safety
  const resolvedSrc = getAssetUrl(src);
  // Auto-infer webp alternative if not explicitly passed and src is jpg/png
  const resolvedWebp = webpSrc 
    ? getAssetUrl(webpSrc) 
    : src.endsWith('.jpg') || src.endsWith('.jpeg') || src.endsWith('.png')
      ? getAssetUrl(src.replace(/\.(jpg|jpeg|png)$/i, '.webp'))
      : undefined;

  return (
    <div
      className={`celebration-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio,
        borderRadius,
        backgroundColor: 'var(--bg-canvas-subtle)',
        ...style,
      }}
    >
      {!hasError ? (
        <picture>
          {resolvedWebp && (
            <source
              type="image/webp"
              srcSet={resolvedWebp}
            />
          )}
          <img
            src={resolvedSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              // Graceful error recovery: fallback to graceful styling
              setHasError(true);
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transition: 'opacity 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              opacity: isLoaded ? 1 : 0.85,
              ...imgStyle,
            }}
          />
        </picture>
      ) : (
        /* Graceful fallback banner when an image cannot load */
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(40, 21, 47, 0.92) 0%, rgba(232, 93, 63, 0.85) 100%)',
            color: '#FAF5EE',
            padding: 'var(--space-4)',
            textAlign: 'center',
          }}
          role="img"
          aria-label={alt}
        >
          <Sparkles size={28} style={{ color: 'var(--color-gold)', marginBottom: '8px' }} />
          <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.3px' }}>
            {fallbackTitle}
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px', maxWidth: '220px' }}>
            {alt}
          </div>
        </div>
      )}

      {/* Optional Overlay (e.g. gradient or editorial text) */}
      {overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          {overlay}
        </div>
      )}
    </div>
  );
};
