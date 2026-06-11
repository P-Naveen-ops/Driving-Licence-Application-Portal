import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const rtos = [
  { id: 'TS09', name: 'Hyderabad Central (TS-09)', address: 'Khairatabad, Hyderabad', slots: 12 },
  { id: 'TS10', name: 'Hyderabad East (TS-10)',    address: 'Uppal, Hyderabad',        slots: 8  },
  { id: 'TS11', name: 'Hyderabad West (TS-11)',    address: 'Kukatpally, Hyderabad',   slots: 10 },
  { id: 'TS12', name: 'Secunderabad (TS-12)',      address: 'Tarnaka, Secunderabad',   slots: 5  },
  { id: 'TS05', name: 'Warangal (TS-05)',          address: 'Hanamkonda, Warangal',    slots: 15 },
];

const timeSlots = ['09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM'];

const SlotBookingPage = () => {
  const { addNotification } = useAuth();
  const [selectedRTO, setSelectedRTO] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [booked, setBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [bookedSlots] = useState(['09:00 AM', '10:00 AM', '02:00 PM']); // mock booked

  const minDate = () => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const handleBook = () => {
    if (!selectedRTO || !selectedDate || !selectedSlot) { toast.error('Please select RTO, date, and time slot.'); return; }
    const ref = 'SLOT' + Date.now();
    setBookingRef(ref);
    setBooked(true);
    addNotification({ type: 'info', message: `Slot booked at ${selectedRTO} on ${selectedDate} at ${selectedSlot}`, time: new Date().toISOString() });
    toast.success('Slot booked successfully!');
  };

  if (booked) return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 540, textAlign: 'center', paddingTop: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📍</div>
          <h2 style={{ color: 'var(--navy)', marginBottom: 12 }}>Slot Booked!</h2>
          <div className="receipt-box" style={{ textAlign: 'left' }}>
            {[
              ['Booking Reference', bookingRef],
              ['RTO', selectedRTO],
              ['Date', selectedDate],
              ['Time Slot', selectedSlot],
              ['Status', 'Confirmed'],
            ].map(([k, v]) => (
              <div key={k} className="receipt-row">
                <span>{k}</span><strong>{v}</strong>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: '0.87rem', color: 'var(--text-light)' }}>Please arrive 15 minutes before your slot. Carry Aadhaar and application copy.</p>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => { setBooked(false); setSelectedSlot(''); setSelectedDate(''); setSelectedRTO(''); }}>
            Book Another Slot
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="module-header">
            <h1>📍 Slot Booking</h1>
            <p>Reserve your preferred time slot at your nearest RTO for document verification or test.</p>
          </div>

          <div className="slot-layout">
            {/* RTO Selection */}
            <div className="form-card">
              <h3 style={{ marginBottom: 16 }}>Select RTO</h3>
              <div className="rto-list">
                {rtos.map(r => (
                  <div key={r.id}
                    className={`rto-card ${selectedRTO === r.name ? 'selected' : ''}`}
                    onClick={() => setSelectedRTO(r.name)}>
                    <div className="rto-card-top">
                      <strong>{r.name}</strong>
                      <span className={`slots-badge ${r.slots <= 5 ? 'low' : ''}`}>
                        {r.slots} slots
                      </span>
                    </div>
                    <span className="rto-addr">📍 {r.address}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <div className="form-card" style={{ marginBottom: 20 }}>
                <h3 style={{ marginBottom: 14 }}>Select Date</h3>
                <input
                  type="date"
                  className="form-control"
                  min={minDate()}
                  value={selectedDate}
                  onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                />
              </div>

              {selectedDate && (
                <div className="form-card fade-in">
                  <h3 style={{ marginBottom: 14 }}>Available Time Slots</h3>
                  <div className="slots-grid">
                    {timeSlots.map(slot => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button key={slot}
                          className={`slot-btn ${isBooked ? 'booked' : ''} ${selectedSlot === slot ? 'selected' : ''}`}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}>
                          {slot}
                          {isBooked && <span className="slot-tag">Booked</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div className="slot-legend">
                    <span className="legend-item"><span className="legend-dot available" />Available</span>
                    <span className="legend-item"><span className="legend-dot selected-dot" />Selected</span>
                    <span className="legend-item"><span className="legend-dot booked-dot" />Booked</span>
                  </div>
                </div>
              )}

              {selectedSlot && (
                <div className="form-card fade-in" style={{ marginTop: 20 }}>
                  <h4 style={{ marginBottom: 12, color: 'var(--navy)' }}>Booking Summary</h4>
                  <div className="booking-summary">
                    <div className="bs-item"><span>RTO</span><strong>{selectedRTO}</strong></div>
                    <div className="bs-item"><span>Date</span><strong>{selectedDate}</strong></div>
                    <div className="bs-item"><span>Time</span><strong>{selectedSlot}</strong></div>
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 16, padding: 14 }} onClick={handleBook}>
                    ✅ Confirm Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SlotBookingPage;
