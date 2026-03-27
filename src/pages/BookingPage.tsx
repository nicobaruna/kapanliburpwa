export default function BookingPage() {
  return (
    <div className="page">
      <header className="page-header">
        <h1 className="headline">Booking & Reservasi</h1>
        <p>Kelola tiket liburanmu</p>
      </header>
      
      <div className="card">
        <h3 className="headline">Pesanan Aktif</h3>
        <p>Belum ada tiket yang dipesan.</p>
        <button className="btn btn-primary" style={{ marginTop: '16px' }}>Cari Tiket Sekarang</button>
      </div>
    </div>
  );
}
