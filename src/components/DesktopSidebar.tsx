import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SIDEBAR_TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/calendar', label: 'Kalender Libur', icon: 'event_available' },
  { to: '/financial-planner', label: 'Perencana', icon: 'account_balance_wallet' },
  { to: '/inspiration', label: 'Inspirasi', icon: 'explore' },
  { to: '/profile', label: 'Profil & Setting', icon: 'settings' },
];

export default function DesktopSidebar() {
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <aside className="desktop-sidebar-container hidden-mobile">
        <div style={{ padding: '0 32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: 800, color: '#fff',
            }}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="headline" style={{ fontSize: '14px', fontWeight: 800 }}>Halo, {user?.name || 'Wisatawan'}</p>
              <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>Siap untuk pergi?</p>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 16px' }}>
          {SIDEBAR_TABS.map(tab => (
            <NavLink
              key={tab.to}
              to={tab.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                borderRadius: '999px',
                textDecoration: 'none',
                color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)',
                background: isActive ? 'var(--surface-container-lowest)' : 'transparent',
                fontWeight: isActive ? 800 : 700,
                fontSize: '14px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'all 0.2s',
                transform: isActive ? 'translateX(4px)' : 'none',
                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
              })}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined" style={{ 
                    fontSize: '20px', 
                    color: isActive ? 'var(--primary-container)' : 'var(--on-surface-variant)' 
                  }}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 24px' }}>
          <button 
            onClick={() => navigate('/financial-planner')}
            className="btn btn-primary btn-full shadow-lg" 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', cursor: 'pointer' }}
          >
            Mulai Rencana <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </button>
        </div>
      </aside>

      <style>{`
        .hidden-mobile {
          display: none !important;
        }
        @media (min-width: 1024px) {
          .hidden-mobile {
            display: flex !important;
          }
          .desktop-sidebar-container {
            width: 240px;
            height: calc(100vh - 80px);
            position: fixed;
            left: 0;
            top: 80px;
            background: var(--surface-container-low);
            flex-direction: column;
            padding: 32px 0;
            box-shadow: 10px 0px 30px rgba(158,0,31,0.03);
            z-index: 100;
          }
        }
      `}</style>
    </>
  );
}
