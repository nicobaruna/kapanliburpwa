import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const navigate = useNavigate();

  return (
    <div className="page page-container" style={{ paddingBottom: '120px', background: 'var(--surface)' }}>
      <header style={{ padding: 'var(--spacing-16) 0 var(--spacing-6)', textAlign: 'center' }}>
         <h1 className="headline" style={{ fontSize: 44, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
            Reservasi
         </h1>
         <p style={{ fontSize: 17, color: 'var(--on-surface-variant)', marginTop: 12, opacity: 0.8, fontWeight: 600 }}>Kelola tiket dan reservasi liburanmu dalam satu tempat.</p>
      </header>
      
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
        {/* Empty State - Tonal Layering (No-Line) */}
        <div style={{ 
          background: 'var(--surface-container-low)', borderRadius: 'var(--radius-xl)', padding: 64,
          textAlign: 'center', boxShadow: 'none'
        }}>
          <div style={{ fontSize: 80, marginBottom: 32, opacity: 0.2 }}>🎫</div>
          <h3 className="headline" style={{ fontSize: 24, fontWeight: 900, marginBottom: 16 }}>Belum Ada Pesanan</h3>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', maxWidth: 360, margin: '0 auto', lineHeight: 1.6, fontWeight: 600 }}>
             Semua tiket pesawat, hotel, dan aktivitas yang kamu pesan akan muncul di sini.
          </p>
          <button 
            className="btn btn-primary shadow-lg hover-scale" 
            onClick={() => navigate('/budget')}
            style={{ marginTop: 40, padding: '20px 48px', fontSize: 16, fontWeight: 900, letterSpacing: 0.5 }}
          >
             CARI TIKET SEKARANG ➔
          </button>
        </div>

        {/* Suggestion Section - No Divider Logic */}
        <div style={{ marginTop: 32 }}>
           <h3 className="headline" style={{ fontSize: 20, fontWeight: 900, marginBottom: 24, letterSpacing: -0.5 }}>Rekomendasi Terpopuler</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { title: 'Garuda Indonesia GA-120', type: 'Plane', price: 'Rp 1.250.000', icon: '🛫' },
                { title: 'The Kayon Jungle Resort', type: 'Hotel', price: 'Rp 4.500.000', icon: '🏨' },
              ].map((rec, i) => (
                <div key={i} style={{ 
                  background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)', padding: 24,
                  display: 'flex', alignItems: 'center', gap: 24
                }} className="hover-scale">
                  <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-default)', background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                    {rec.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: 1 }}>{rec.type}</p>
                    <p className="headline" style={{ fontSize: 18, fontWeight: 900, marginTop: 4 }}>{rec.title}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 900 }}>{rec.price}</p>
                    <p style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 800, marginTop: 4 }}>CEK HARGA ➔</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      <style>{`
        .hover-scale { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .hover-scale:hover { transform: translateY(-4px); }
        .hover-scale:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}
