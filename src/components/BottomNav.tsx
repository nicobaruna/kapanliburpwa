import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { to: '/calendar', label: 'Kalender', emoji: '📅' },
  { to: '/inspiration', label: 'Inspirasi', emoji: '🏝️' },
  { to: '/profile', label: 'Profil', emoji: '👤' },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '0',
      width: '100%',
      background: 'rgba(253, 249, 245, 0.9)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      borderTop: 'none',
      display: 'flex',
      zIndex: 100,
      boxShadow: 'var(--shadow-ambient)',
      paddingBottom: 'env(safe-area-inset-bottom, 16px)'
    }} className="bottom-nav-container">
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 4px 8px',
            textDecoration: 'none',
            color: isActive ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontWeight: isActive ? 700 : 500,
            fontSize: 12,
            fontFamily: 'Manrope, sans-serif',
            gap: 4,
            position: 'relative',
            transition: 'color 0.2s',
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ 
                fontSize: isActive ? 24 : 20, 
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'translateY(-2px)' : 'none',
                transition: 'transform 0.2s, opacity 0.2s'
              }}>
                {tab.emoji}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 2,
                  width: 24,
                  height: 3,
                  borderRadius: '3px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
                }} />
              )}
            </>
          )}
        </NavLink>
      ))}
      <style>{`
        @media (min-width: 1024px) {
          .bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
