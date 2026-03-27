import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUpcomingHolidays, getNextLongWeekend } from '../utils/dateUtils';
import type { Holiday, LongWeekend } from '../data/holidays2026';

export default function CalendarPage() {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState<Holiday[]>([]);
  const [nearestLW, setNearestLW] = useState<LongWeekend | null>(null);

  useEffect(() => {
    setUpcoming(getUpcomingHolidays(3));
    setNearestLW(getNextLongWeekend());
  }, []);
  // We use static mock data matching the "Maret 2026" screenshot for 100% fidelity
  
  // Generating a simple 5-week grid for the month of March 2026.
  // March 1, 2026 is a Sunday. 31 days.
  const daysInMonth = 31;
  const firstDayIndex = 0; // 0 = Sunday
  
  const cells = [];
  // previous month filler
  for (let i = 0; i < firstDayIndex; i++) {
    cells.push({ day: '', type: 'empty' });
  }
  // current month
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, type: 'normal' });
  }
  // next month filler (to complete 35 cells)
  while (cells.length < 35) {
    cells.push({ day: '', type: 'empty' });
  }

  return (
    <div className="page" style={{ padding: '0 32px 100px', maxWidth: '1440px', margin: '0 auto' }}>
      
      {/* Header section (Mockup showed Dashboard header with Calendar tab active) */}
      <header style={{ padding: '24px 0 32px', display: 'none' }}>
         <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
           <h1 className="headline" style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)' }}>Dashboard</h1>
           <div className="hidden-mobile" style={{ display: 'flex', gap: 24, paddingLeft: 16 }}>
             <span style={{ color: 'var(--primary-container)', fontWeight: 700, borderBottom: '2px solid', paddingBottom: 4, cursor: 'pointer' }}>Calendar</span>
             <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Budget</span>
             <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Destinations</span>
             <span style={{ color: 'var(--on-surface-variant)', fontWeight: 600, cursor: 'pointer' }}>Promos</span>
           </div>
         </div>
      </header>

      {/* Title Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, marginTop: 24 }}>
        <div>
          <h1 className="headline" style={{ fontSize: 48, fontWeight: 900, color: 'var(--on-surface)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Maret<span style={{ color: 'var(--on-surface-variant)' }}>2026</span></h1>
          <p style={{ fontSize: 16, color: 'var(--on-surface-variant)', marginTop: 8 }}>Strategic planning for your next Indonesian escape.</p>
        </div>
        <div style={{ display: 'flex', background: 'var(--surface-container-low)', borderRadius: 'var(--radius-full)', padding: 4, border: '1px solid var(--outline-variant)' }}>
          <button style={{ background: '#fff', border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-full)', padding: '8px 24px', fontSize: 13, fontWeight: 800, color: 'var(--primary-container)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }}>Monthly</button>
          <button style={{ background: 'transparent', border: 'none', padding: '8px 24px', fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)', cursor: 'pointer' }}>Yearly</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 32, alignItems: 'start' }}>
        
        {/* === LEFT COLUMN: CALENDAR GRID === */}
        <div style={{ background: 'var(--surface-container-lowest)', borderRadius: 32, padding: '32px 32px 40px', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', border: '1px solid #EAE5E0' }}>
          
          {/* Days Header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: 16 }}>
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} style={{ fontSize: 11, fontWeight: 800, color: 'var(--on-surface-variant)', letterSpacing: 1.5 }}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid Constraints */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid var(--outline-variant)', borderLeft: '1px solid var(--outline-variant)', borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
            {cells.map((cell, idx) => {
              const isSunday = idx % 7 === 0;
              const isWeekend = idx % 7 === 0 || idx % 7 === 6;
              const isEmpty = cell.type === 'empty';
              
              // Custom Cell Highlights from mockup
              const isCell1 = cell.day === 1;
              const isCell13 = cell.day === 13; // Friday Getaway 
              const isCell20 = cell.day === 20; // Nyepi
              const isCell30 = cell.day === 30; // Idul Fitri
              const isCell31 = cell.day === 31; // Idul Fitri
              
              const isHighlighted = isCell13 || isCell20 || isCell30 || isCell31;

              return (
                <div key={idx} style={{ 
                  height: 90, 
                  borderRight: '1px solid var(--outline-variant)', 
                  borderBottom: '1px solid var(--outline-variant)', 
                  padding: 12, 
                  background: isEmpty ? 'var(--surface-container-low)' : (isHighlighted ? 'rgba(255,255,255,0.5)' : '#fff'),
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                  {/* Day Number */}
                  {!isEmpty && (
                    <span style={{ 
                      fontSize: 14, fontWeight: 800, 
                      color: isSunday ? 'var(--primary-container)' : 'var(--on-surface)',
                      alignSelf: 'flex-start'
                    }}>{cell.day}</span>
                  )}

                  {/* Mockup specific pills */}
                  {isCell1 && (
                    <div style={{ marginTop: 'auto', background: 'var(--secondary-container)', color: 'var(--primary-container)', fontSize: 8, fontWeight: 800, padding: '4px 20px', borderRadius: 12, border: '1px solid rgba(158,0,31,0.1)', letterSpacing: 0.5 }}>
                      MINGGU
                    </div>
                  )}
                  {isCell13 && (
                    <div style={{ marginTop: 'auto', width: '100%', height: 4, background: '#97E4A8', borderRadius: 2 }} />
                  )}
                  {isCell20 && (
                     <div style={{ marginTop: 'auto', width: '100%', height: 4, background: 'var(--primary)', borderRadius: 2 }} />
                  )}
                  {(isCell30 || isCell31) && (
                     <div style={{ marginTop: 'auto', width: '100%', height: 4, background: 'var(--primary)', borderRadius: 2 }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Cards inside Gray Container */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
            
            {/* Leave Balance Card */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-ambient)', border: '1px solid var(--outline-variant)' }}>
              <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: 'var(--on-surface-variant)', marginBottom: 8 }}>LEAVE BALANCE</p>
              <h2 className="headline" style={{ fontSize: 36, fontWeight: 900, color: 'var(--on-surface)', lineHeight: 1, marginBottom: 24 }}>
                14 Days <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--on-surface-variant)' }}>Remaining</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <div style={{ width: '100%', height: 6, background: 'var(--surface-container-high)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
                    <div style={{ width: '66%', height: '100%', background: 'var(--primary-container)' }} />
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)' }}>PAID LEAVE (8/12)</p>
                </div>
                <div>
                  <div style={{ width: '100%', height: 6, background: 'var(--surface-container-high)', borderRadius: 3, marginBottom: 8, overflow: 'hidden' }}>
                    <div style={{ width: '20%', height: '100%', background: '#4CAF50' }} />
                  </div>
                  <p style={{ fontSize: 9, fontWeight: 800, color: 'var(--on-surface-variant)' }}>SICK LEAVE (2/10)</p>
                </div>
              </div>
            </div>

            {/* Recommended Trip Card */}
            <div style={{ background: '#fff', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-ambient)', border: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.5, color: 'var(--primary-container)', marginBottom: 4 }}>RECOMMENDED TRIP</p>
                  <h2 className="headline" style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)' }}>Ubud, Bali</h2>
                </div>
                <span style={{ fontSize: 28 }}>🌴</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5, marginBottom: 20 }}>
                Experience the spiritual silence of Nyepi in the heart of Bali. Peaceful retreat with early bird advantages.
              </p>
              <button 
                onClick={() => navigate('/inspiration')}
                style={{ marginTop: 'auto', alignSelf: 'flex-start', background: 'transparent', color: 'var(--primary-container)', fontSize: 13, fontWeight: 800, border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                View Detailed Itinerary ➔
              </button>
            </div>

          </div>
        </div>


        {/* === RIGHT COLUMN: DETAILED DATES & ALERTS === */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          
          {/* Detailed Dates */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 20 }}>table_rows</span> Detailed Dates
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {upcoming.map(h => {
                const dateObj = new Date(h.date);
                const dayStr = dateObj.getDate();
                const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                
                const isPaidLeave = h.type.includes('cuti_bersama');
                const badgeText = isPaidLeave ? 'PAID LEAVE' : 'NATIONAL';
                const badgeStyle = isPaidLeave ? { background: '#EAF8ED', color: '#0F5120' } : { background: 'var(--primary)', color: '#fff' };
                const borderStyle = isPaidLeave ? '1px solid #C4F1CF' : '1px solid var(--outline-variant)';

                return (
                  <div key={h.id} style={{ background: '#fff', border: borderStyle, borderRadius: 20, padding: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <span style={{ ...badgeStyle, fontSize: 9, fontWeight: 800, padding: '4px 10px', borderRadius: 8, letterSpacing: 1 }}>{badgeText}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--on-surface)' }}>{dayStr} {monthStr}</span>
                    </div>
                    <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{h.name} {h.emoji}</h4>
                    <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                      Sistem mendeteksi ini sebagai {isPaidLeave ? 'Cuti Bersama' : 'Libur Nasional'}.
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Long Weekend Alerts */}
          {nearestLW && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary-container)', fontSize: 20 }}>flash_on</span> Long Weekend Alert
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Rich Alert Card */}
              <div 
                onClick={() => navigate('/inspiration')}
                style={{ position: 'relative', height: 180, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600&q=80" alt="Destination" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)' }} />
                
                <div style={{ position: 'absolute', inset: 0, padding: 24, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#FADB5F', fontSize: 9, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    🔥 HIGH IMPACT PLAN
                  </span>
                  <h4 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{nearestLW.label}</h4>
                  <p style={{ fontSize: 12, color: '#ddd', lineHeight: 1.5 }}>
                    Nikmati {nearestLW.totalDays} hari libur berturut-turut! Siapkan tiket Anda dari sekarang.
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
                    {Array.from({ length: Math.min(nearestLW.totalDays, 5) }).map((_, i) => {
                       const d = new Date(nearestLW.startDate);
                       d.setDate(d.getDate() + i);
                       const dayName = d.toLocaleString('en-US', { weekday: 'short' });
                       // Warnai merah if explicit holiday or Sunday
                       const isExplicitHoliday = nearestLW.holidays.some(h => h.date === d.toISOString().split('T')[0]);
                       const isSunday = d.getDay() === 0;
                       const isRed = isExplicitHoliday || isSunday;
                       
                       return (
                        <span key={i} style={{ background: isRed ? 'var(--primary-container)' : '#fff', color: isRed ? '#fff' : 'var(--on-surface)', fontSize: 10, fontWeight: 800, width: 28, height: 28, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {dayName}
                        </span>
                       )
                    })}
                  </div>
                </div>
              </div>

              {/* Warning Alert */}
              <div style={{ background: '#FDE49B', borderRadius: 20, padding: 20, display: 'flex', gap: 16 }}>
                <span className="material-symbols-outlined" style={{ color: '#6A4D00' }}>warning</span>
                <div>
                  <h4 style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#6A4D00', marginBottom: 4 }}>Booking Alert</h4>
                  <p style={{ fontSize: 13, color: '#4F3906', lineHeight: 1.5 }}>
                    Harga tiket untuk keberangkatan {new Date(nearestLW.startDate).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} diprediksi naik. Booking sekarang!
                  </p>
                </div>
              </div>

            </div>
          </div>
          )}

        </div>

      </div>

    </div>
  );
}
