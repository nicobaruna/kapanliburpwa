import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--surface)', color: 'var(--on-surface)' }}>
      {/* Navigation */}
      <nav className="lp-nav">
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-1px' }}>KapanLibur</div>
        <div className="lp-nav-links">
          <a href="#" className="lp-nav-link active">Calendar</a>
          <a href="#" className="lp-nav-link">Budget</a>
          <a href="#" className="lp-nav-link">Destinations</a>
          <a href="#" className="lp-nav-link">Promos</a>
          <a href="#" className="lp-nav-link">Masuk</a>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 24, opacity: 0.6, cursor: 'pointer' }}>notifications</span>
          <span className="material-symbols-outlined" style={{ fontSize: 28, opacity: 0.6, cursor: 'pointer' }}>account_circle</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="lp-hero">
        <div style={{ animation: 'fadeIn 0.8s ease' }}>
          <span className="lp-badge">⚡ YOUR JOURNEY, MASTERED</span>
          <h1 className="lp-h1">
            Libur Lebih <br />
            <span>Maksimal.</span>
          </h1>
          <p className="lp-hero-p">
            Transformasikan jatah cuti Anda menjadi memori tak terlupakan. 
            Kelola finansial dan jadwal liburan dalam satu aplikasi pintar.
          </p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }} className="lp-hero-btns">
            <button className="btn btn-primary" onClick={() => navigate('/onboarding')} style={{ padding: '18px 40px' }}>Mulai Planning</button>
            <button className="btn btn-secondary" style={{ padding: '18px 40px' }}>Cek Kalender</button>
          </div>
          <button className="lp-btn-google">
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" /> 
            Masuk dengan Google
          </button>
        </div>

        <div style={{ position: 'relative', animation: 'slideUp 1s ease' }}>
          <img 
            src="/hero_mountain_lake.png" 
            alt="Liburan" 
            style={{ 
              width: '100%', 
              borderRadius: 'var(--radius-xl)', 
              boxShadow: '0 40px 100px rgba(0,0,0,0.1)',
              display: 'block'
            }} 
          />
          {/* Recommendation Float Card */}
          <div style={{ 
            position: 'absolute', 
            bottom: -30, 
            left: -30, 
            background: '#fff', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)', 
            boxShadow: '0 20px 50px rgba(158,0,31,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            minWidth: 260,
            zIndex: 10
          }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 28, background: 'var(--surface)', padding: 8, borderRadius: 12 }}>🏖️</div>
                <div>
                   <p style={{ fontWeight: 800, fontSize: 13, marginBottom: 2 }}>Rekomendasi Cuti</p>
                   <p style={{ fontSize: 11, opacity: 0.6 }}>Libur 5 Hari di Mei</p>
                </div>
             </div>
             <div style={{
                background: 'var(--secondary-container)',
                padding: '8px 16px',
                borderRadius: 100,
                color: 'var(--on-secondary-container)',
                fontSize: 10,
                fontWeight: 900,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                width: 'fit-content'
             }}>
                <span style={{ fontSize: 14 }}>🟢</span> AMAN UNTUK DOMPET
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '40px 5% 120px', maxWidth: 1440, margin: '0 auto' }}>
         <h2 className="lp-section-title">Fitur Unggulan</h2>
         <p className="lp-section-desc">
            Kami membantu Anda merencanakan segalanya dari A sampai Z, sehingga Anda hanya perlu fokus menikmati momen.
         </p>

         <div className="lp-grid">
            {/* 1. Auto-Cuti Optimizer */}
            <div className="lp-card">
                <div className="lp-icon-box" style={{ background: 'rgba(158,0,31,0.08)' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 28 }}>calendar_month</span>
                </div>
                <h3 className="lp-card-h3">Auto-Cuti Optimizer</h3>
                <p className="lp-card-p" style={{ maxWidth: 360 }}>
                    Algoritma kami mencari 'Hari Kejepit' dan menggabungkan jatah cuti Anda untuk durasi liburan maksimal.
                </p>
                <a href="#" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 15 }}>
                    Pelajari Lebih Lanjut <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward_ios</span>
                </a>

                {/* Calendar Visual */}
                <div style={{ 
                    position: 'absolute',
                    bottom: 40,
                    right: 40,
                    background: 'var(--surface-container-high)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    width: 260,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12
                }}>
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)', marginBottom: 8, letterSpacing: 1 }}>MEI 2026</p>
                        <p style={{ fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Libur Waisak + 1 Hari Cuti</p>
                        <p style={{ fontSize: 12, opacity: 0.6 }}>4 Hari Libur Berturut-turut</p>
                    </div>
                    <div style={{ height: 8 }} />
                    <div>
                        <p style={{ fontSize: 11, fontWeight: 800, opacity: 0.4, marginBottom: 4 }}>JUNI 2026</p>
                        <p style={{ fontSize: 14, fontWeight: 800, opacity: 0.4 }}>Idul Adha</p>
                    </div>
                </div>
            </div>

            {/* 2. Financial Health */}
            <div className="lp-card" style={{ background: 'var(--primary)', color: '#fff', border: 'none' }}>
                <div className="lp-icon-box" style={{ background: 'rgba(255,255,255,0.2)' }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 28 }}>account_balance_wallet</span>
                </div>
                <h3 className="lp-card-h3" style={{ color: '#fff' }}>Financial Health</h3>
                <p className="lp-card-p" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 60 }}>
                    Tabungan khusus liburan yang terintegrasi dengan rencana perjalanan Anda.
                </p>
                <div style={{ marginTop: 'auto' }}>
                    <p style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, opacity: 0.8 }}>TARGET CAPAIAN</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 16 }}>
                        <span style={{ fontSize: 40, fontWeight: 900 }}>85%</span>
                    </div>
                    <div style={{ height: 8, width: '100%', background: 'rgba(255,255,255,0.15)', borderRadius: 100, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '85%', background: '#fff', borderRadius: 100, boxShadow: '0 0 20px rgba(255,255,255,0.4)' }} />
                    </div>
                </div>
            </div>

            {/* 3. Destinasi Pintar */}
            <div className="lp-card" style={{ background: 'var(--surface-container-high)' }}>
                <div className="lp-icon-box" style={{ background: '#fff' }}>
                    <span className="material-symbols-outlined" style={{ color: 'var(--on-surface)', fontSize: 28 }}>explore</span>
                </div>
                <h3 className="lp-card-h3">Destinasi Pintar</h3>
                <p className="lp-card-p">
                    Rekomendasi tempat berdasarkan budget dan preferensi keramaian Anda.
                </p>
                <div style={{ display: 'flex', marginTop: 20 }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ 
                            width: 44, 
                            height: 44, 
                            borderRadius: '50%', 
                            background: '#fff', 
                            border: '3px solid #EAEAEA', 
                            overflow: 'hidden', 
                            marginLeft: i > 1 ? -15 : 0,
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                        }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=dest${i}`} alt="user" />
                        </div>
                    ))}
                    <div style={{ 
                        width: 44, 
                        height: 44, 
                        borderRadius: '50%', 
                        background: 'var(--primary)', 
                        border: '3px solid #EAEAEA', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginLeft: -15,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 800
                    }}>+12</div>
                </div>
            </div>

            {/* 4. Community Card */}
            <div className="lp-card" style={{ background: 'var(--tertiary-container)', display: 'flex', gap: 40, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h3 className="lp-card-h3">KapanLibur Community</h3>
                    <p className="lp-card-p" style={{ color: 'rgba(0,0,0,0.6)', marginBottom: 0 }}>
                        Dapatkan tips 'local secret' dari ribuan wisatawan KapanLibur lainnya di seluruh Indonesia.
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                     <div style={{ background: '#fff', padding: '14px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', maxWidth: 220 }}>
                        Bali Tips ⚠️ <br /> 
                        <span style={{ fontWeight: 500, opacity: 0.5, fontSize: 11 }}>Avoid Ubud during weekends.</span>
                     </div>
                     <div style={{ background: '#fff', padding: '14px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', marginLeft: 30, maxWidth: 220 }}>
                        Jogja Tips ✅ <br /> 
                        <span style={{ fontWeight: 500, opacity: 0.5, fontSize: 11 }}>Gudeg Yu Djum pusat lebih sepi pagi hari.</span>
                     </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '40px 0' }}>
         <div className="lp-cta-banner">
             <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.03em' }}>Siap untuk liburan berikutnya?</h2>
             <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, maxWidth: 640, margin: '0 auto 56px', lineHeight: 1.6 }}>
                Bergabunglah dengan 50,000+ wisatawan cerdas lainnya yang sudah memaksimalkan jatah cuti mereka.
             </p>
             <button className="lp-btn-google" style={{ padding: '18px 48px', fontSize: 16, margin: '0 auto' }}>
                <img src="https://www.google.com/favicon.ico" width="22" height="22" alt="Google" /> 
                Sign up with Google
             </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
          <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--primary)', letterSpacing: '-1.5px' }}>KapanLibur.</div>
          <div style={{ display: 'flex', gap: 32, fontSize: 12, fontWeight: 700, opacity: 0.5 }}>
              <span style={{ cursor: 'pointer' }}>PRIVACY POLICY</span>
              <span style={{ cursor: 'pointer' }}>TERMS OF SERVICE</span>
              <span style={{ cursor: 'pointer' }}>HELP CENTER</span>
              <span style={{ cursor: 'pointer' }}>CONTACT US</span>
          </div>
          <div style={{ fontSize: 11, opacity: 0.3, letterSpacing: 0.5 }}>© 2026 KAPANLIBUR INDONESIA. THE DIGITAL CONCIERGE.</div>
      </footer>
    </div>
  );
}
