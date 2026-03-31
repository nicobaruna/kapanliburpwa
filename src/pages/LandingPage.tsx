import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100dvh', 
      background: '#F9F8F6', 
      color: '#1a1a1a', 
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* --- HEADER --- */}
      <header style={{ 
        padding: '24px 4% 16px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'transparent',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#000', letterSpacing: '-0.03em' }}>Kapanlibur</span>
        </div>
        
        <nav className="hidden-mobile" style={{ display: 'flex', gap: '32px' }}>
          {['Calendar', 'Budget', 'Destinations', 'Promos'].map(item => (
            <span key={item} style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: item === 'Calendar' ? '#C8102E' : '#666',
              cursor: 'pointer',
              borderBottom: item === 'Calendar' ? '2px solid #C8102E' : 'none',
              paddingBottom: '4px'
            }}>
              {item}
            </span>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="material-symbols-outlined" style={{ color: '#000', cursor: 'pointer' }}>notifications</span>
          <div style={{ width: 32, height: 32, borderRadius: 16, background: '#D9D9D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section style={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: '60px 4% 80px',
        gap: '40px',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1 1 500px', maxWidth: '600px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '6px 12px', 
            background: '#FDE49B', 
            borderRadius: '100px',
            marginBottom: '24px'
          }}>
            <span style={{ fontSize: '10px', color: '#6A4D00', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✦ YOUR JOURNEY MASTERED
            </span>
          </div>
          
          <h1 style={{ 
            fontSize: 'max(48px, 6vw)', 
            fontWeight: 900, 
            lineHeight: 1, 
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            color: '#1a1a1a'
          }}>
            Libur Lebih<br />
            <span style={{ color: '#C8102E', fontStyle: 'italic' }}>Maksimal.</span>
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#666', 
            lineHeight: 1.6, 
            marginBottom: '40px',
            maxWidth: '480px'
          }}>
            Transformasikan jatah cuti Anda menjadi memori tak terlupakan. 
            Kelola finansial dan jadwal liburan dalam satu aplikasi pintar.
          </p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => navigate('/onboarding')}
              style={{ 
                background: '#C8102E', 
                color: '#fff', 
                padding: '16px 32px', 
                borderRadius: '100px', 
                fontWeight: 700, 
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Mulai Planning
            </button>
            <button 
              onClick={() => navigate('/onboarding')}
              style={{ 
                background: '#EDEDED', 
                color: '#1a1a1a', 
                padding: '16px 32px', 
                borderRadius: '100px', 
                fontWeight: 700, 
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Cek Kalender
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 400px', position: 'relative' }}>
          <div style={{ 
            width: '100%', 
            paddingTop: '125%', // 4:5 aspect ratio
            background: 'url(/hero_image.png) center/cover no-repeat',
            borderRadius: '24px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.1)'
          }} />
          
          {/* Floating Recommendation Card */}
          <div style={{ 
            position: 'absolute',
            bottom: '-30px',
            left: '-20px',
            background: '#fff',
            padding: '16px 20px',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '220px'
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: '#EAF8ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '20px' }}>🏞️</span>
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 800, marginBottom: '2px' }}>Rekomendasi Cuti</p>
              <p style={{ fontSize: '10px', color: '#666' }}>Libur 5 Hari di Mei</p>
              <div style={{ marginTop: '6px', fontSize: '8px', padding: '2px 6px', background: '#97E4A8', color: '#0F5120', borderRadius: '4px', display: 'inline-block', fontWeight: 900 }}>@MAKSIMALKAN-CUTI</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section style={{ padding: '80px 4% 100px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '8px' }}>Fitur Unggulan</h2>
        <p style={{ color: '#666', marginBottom: '48px', maxWidth: '500px' }}>
          Kami membantu Anda merencanakan segalanya dari A sampai Z, sehingga Anda hanya perlu fokus menikmati momen.
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Auto-Cuti Optimizer */}
          <div style={{ background: '#fff', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFE8EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span className="material-symbols-outlined" style={{ color: '#C8102E' }}>calendar_today</span>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>Auto-Cuti Optimizer</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
                Algoritma kami mencari "Hari Kejepit" dan menggabungkannya dengan jatah cuti Anda untuk durasi libur maksimal.
              </p>
              
              <div style={{ 
                background: '#F9F8F6', 
                padding: '16px', 
                borderRadius: '16px',
                border: '1px solid #EEE'
              }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: '#C8102E', marginBottom: '4px' }}>MEI 2026</p>
                <p style={{ fontSize: '13px', fontWeight: 700 }}>Libur Waisak + 1 Hari Cuti</p>
                <p style={{ fontSize: '11px', color: '#666' }}>4 Hari Libur Berturut-turut</p>
              </div>
            </div>
            <a href="#" style={{ color: '#C8102E', fontSize: '14px', fontWeight: 800, textDecoration: 'none', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Pelajari Lebih Lanjut <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
            </a>
          </div>

          {/* Financial Health */}
          <div style={{ background: '#C8102E', padding: '32px', borderRadius: '24px', color: '#fff', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span className="material-symbols-outlined" style={{ color: '#fff' }}>payments</span>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>Financial Health</h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '32px' }}>
                Tabungan khusus liburan yang terintegrasi dengan rencana perjalanan Anda.
              </p>
              
              <div>
                <p style={{ fontSize: '11px', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>Target Capaian</p>
                <div style={{ fontSize: '24px', fontWeight: 900, marginBottom: '12px' }}>85%</div>
                <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                  <div style={{ width: '85%', height: '100%', background: '#fff', borderRadius: 2 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Destinasi Pintar */}
          <div style={{ background: '#EAEAEA', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span className="material-symbols-outlined" style={{ color: '#1a1a1a' }}>explore</span>
            </div>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>Destinasi Pintar</h3>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '24px' }}>
                Rekomendasi tempat berdasarkan budget dan preferensi keramaian Anda.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/avatars_row.png" alt="Users" style={{ height: 32, borderRadius: 16 }} />
              </div>
            </div>
          </div>

          {/* Kapanlibur Community */}
          <div style={{ background: '#FDE49B', padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '12px' }}>Kapanlibur Community</h3>
              <p style={{ fontSize: '14px', color: '#6A4D00', lineHeight: 1.6, marginBottom: '32px' }}>
                Dapatkan tips "local secret" dari ribuan wisatawan Kapanlibur lainnya di seluruh Indonesia.
              </p>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', padding: '6px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  Bali Tips ⚠️
                </div>
                <div style={{ background: '#fff', padding: '6px 12px', borderRadius: '100px', fontSize: '10px', fontWeight: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                  Jogja Tips 🟢
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{ padding: '0 4% 80px' }}>
        <div style={{ 
          background: '#242424', 
          borderRadius: '32px', 
          padding: '60px 24px', 
          textAlign: 'center', 
          color: '#fff' 
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '16px' }}>Siap untuk liburan berikutnya?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
            Bergabunglah dengan 50,000+ wisatawan cerdas lainnya yang sudah memaksimalkan jatah cuti mereka.
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            style={{ 
              background: '#C8102E', 
              color: '#fff', 
              padding: '16px 40px', 
              borderRadius: '100px', 
              fontWeight: 700, 
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Daftar Gratis Sekarang
          </button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer style={{ 
        padding: '60px 4%', 
        borderTop: '1px solid #EEE', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 900, color: '#C8102E' }}>Kapanlibur.</div>
        
        <div className="hidden-mobile" style={{ display: 'flex', gap: '32px', fontSize: '10px', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Help Center</span>
          <span>Contact Us</span>
        </div>
        
        <div style={{ fontSize: '10px', color: '#999', fontWeight: 600 }}>
          © 2024 KAPANLIBUR INDONESIA. THE DIGITAL CONCIERGE.
        </div>
      </footer>

      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
