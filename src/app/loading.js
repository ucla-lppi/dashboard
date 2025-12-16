export default function Loading() {
  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 120000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    fontFamily: 'var(--font-lexend-deca), Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
  };

  const labelStyle = {
    marginTop: '12px',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'none',
  };

  return (
    <div style={overlayStyle} role="status" aria-live="polite">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 50 50"
          aria-hidden="true"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="31.4 94.2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div style={labelStyle} aria-hidden="false">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0px' }}>
            <style>{`
              .inline-ellipsis { display:inline-flex; align-items:center; gap:0px; }
              .inline-ellipsis__dot { display:inline-block; color:#ffffff; opacity:0.28; font-weight:700; font-size:13px; line-height:1; transform:translateY(0); animation:ie-pulse 1.05s infinite ease-in-out; margin-left:0; }
              .inline-ellipsis__dot:nth-child(1) { animation-delay: 0s; }
              .inline-ellipsis__dot:nth-child(2) { animation-delay: 0.18s; }
              .inline-ellipsis__dot:nth-child(3) { animation-delay: 0.36s; }
              @keyframes ie-pulse { 0% { opacity:0.28; transform:translateY(0);} 50% { opacity:1; transform:translateY(-2px);} 100% { opacity:0.28; transform:translateY(0);} }
            `}</style>
            <span style={{ whiteSpace: 'nowrap' }}>
              <span>Loading</span>
              <span className="inline-ellipsis" aria-hidden="true" style={{ verticalAlign: 'middle' }}>
                <span className="inline-ellipsis__dot">.</span>
                <span className="inline-ellipsis__dot">.</span>
                <span className="inline-ellipsis__dot">.</span>
              </span>
            </span>
          </span>
        </div>
        <span className="sr-only">Loading content</span>
      </div>
    </div>
  );
}
