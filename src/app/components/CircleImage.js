import React, { useState } from 'react';

export default function CircleImage({
  src,
  alt = '',
  size = 220,
  overlaySrc = null,
  className = '',
  ...props
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-white ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      aria-label={alt}
    >
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
          <span className="text-gray-300">Loading...</span>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        className={`absolute inset-0 w-full h-full ${loaded ? '' : 'invisible'}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
          Image unavailable
        </div>
      )}
      {overlaySrc && (
        <img
          src={overlaySrc}
          alt="frame"
          className="absolute inset-0 w-full h-full pointer-events-none"
          draggable={false}
        />
      )}
    </div>
  );
}
