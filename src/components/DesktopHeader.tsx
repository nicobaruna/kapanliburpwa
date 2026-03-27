export default function DesktopHeader() {
  return (
    <>
      <header className="desktop-header-container hidden-mobile">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ fontSize: '28px' }}>🇮🇩</span>
             <span className="headline" style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>Kapanlibur</span>
          </div>
          
          <nav style={{ display: 'flex', gap: '24px', marginLeft: '16px' }}>
             <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: 'var(--primary-container)', borderBottom: '2px solid var(--primary-container)', paddingBottom: '4px', cursor: 'pointer' }}>Aplikasi</span>
             <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Community</span>
             <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Premium</span>
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '50%' }} className="hover-surface">
             <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>notifications</span>
          </button>
        </div>
      </header>
      
      <style>{`
        .hidden-mobile {
          display: none !important;
        }
        .hover-surface:hover {
          background: var(--surface-container);
        }
        @media (min-width: 1024px) {
          .hidden-mobile {
            display: flex !important;
          }
          .desktop-header-container {
            position: fixed;
            top: 0;
            width: 100%;
            height: 80px;
            background: var(--surface);
            z-index: 200;
            padding: 0 32px;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>
    </>
  );
}
