import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './HomePage.css';

const services = [
  { icon: '📋', title: "Learner's Licence",  desc: "Apply for a fresh learner licence online. Complete form submission and schedule your test.", link: '/apply',          color: '#003087' },
  { icon: '🪪', title: 'Original DL',         desc: "Convert your learner licence to an original Driving Licence after clearing tests.",          link: '/apply',          color: '#0047bb' },
  { icon: '🔄', title: 'DL Renewal',          desc: 'Renew your expired or expiring Driving Licence hassle-free from your home.',                 link: '/apply',          color: '#FF6700' },
  { icon: '📅', title: 'Test Scheduling',     desc: 'Book your driving test or written test at a convenient RTO slot near you.',                  link: '/test-scheduler', color: '#18A558' },
  { icon: '💳', title: 'Fee Payment',         desc: 'Securely pay application and test fees online with instant confirmation receipt.',            link: '/fee-payment',    color: '#D4A017' },
  { icon: '📍', title: 'Slot Booking',        desc: 'Reserve your preferred time slot at your nearest RTO office for verification.',              link: '/slot-booking',   color: '#7B1FA2' },
  { icon: '🔍', title: 'Track Status',        desc: 'Track real-time status of your DL application from submission to delivery.',                 link: '/status',         color: '#1565C0' },
  { icon: '📜', title: 'Download Certificate',desc: 'Download and print your digitally signed DL certificate instantly.',                         link: '/certificate',    color: '#00695C' },
];

const stats = [
  { num: '12L+', label: 'Applications Processed' },
  { num: '98%',  label: 'Digital Success Rate'    },
  { num: '33',   label: 'RTOs Connected'           },
  { num: '24/7', label: 'Portal Availability'      },
];

const steps = [
  { num: '01', title: 'Register & Login',    desc: 'Create your MeeSeva account or log in with existing credentials.'                       },
  { num: '02', title: 'Check Eligibility',   desc: 'Verify age, documents, and other eligibility criteria before applying.'                 },
  { num: '03', title: 'Fill Application',    desc: 'Complete the online application form with personal and vehicle details.'                 },
  { num: '04', title: 'Pay Fees',            desc: 'Pay the required fees through secure online payment gateway.'                           },
  { num: '05', title: 'Book Slot & Test',    desc: 'Schedule your test date and book your preferred RTO slot.'                              },
  { num: '06', title: 'Get Your DL',         desc: 'Clear your test, track status, and download your digital DL certificate.'               },
];

const notices = [
  'From Jan 1 2025: Digilocker-based DL verification is now mandatory at checkpoints.',
  'New: DL Smart Card delivery upgraded — now dispatched via Speed Post within 7 working days.',
  'Online LL test now available in Telugu, Hindi, and English.',
  'Revised fee structure effective from March 2025 — check the fee payment page for details.',
];

const HomePage = () => {
  const [noticeIdx, setNoticeIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNoticeIdx(i => (i + 1) % notices.length), 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">
      <Navbar />

      {/* Notice Ticker */}
      <div className="notice-ticker">
        <div className="container ticker-inner">
          <span className="ticker-label">NOTICE</span>
          <div className="ticker-text">📢 {notices[noticeIdx]}</div>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>

        <div className="container hero-content">
          <div className="hero-text fade-up">
            <div className="hero-badge">🏛️ Official MeeSeva Portal</div>
            <h1 className="hero-title">
              Driving Licence
              <span className="hero-accent"> Made Simple</span>
            </h1>
            <p className="hero-subtitle">
              Apply for a Learner Licence, schedule tests, pay fees, and manage
              your Driving Licence — all from one place. No queues, no hassle.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn-primary"  style={{ padding: '14px 36px', fontSize: '1.05rem' }}>Apply Now →</Link>
              <Link to="/status" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1.05rem' }}>Track Status</Link>
            </div>
            <div className="hero-note">
              ✅ Aadhaar-based eKYC &nbsp;|&nbsp; 🔒 Secure Payments &nbsp;|&nbsp; ⚡ Instant Processing
            </div>
          </div>

          {/* Mock DL Card */}
          <div className="hero-visual fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="dl-card-mock">
              <div className="dl-card-header">
                <span className="dl-card-logo">🇮🇳</span>
                <div>
                  <div className="dl-card-country">INDIA</div>
                  <div className="dl-card-type">DRIVING LICENCE</div>
                </div>
                <div className="dl-card-chip">💳</div>
              </div>
              <div className="dl-card-photo">
                <div className="dl-photo-placeholder">👤</div>
              </div>
              <div className="dl-card-body">
                <div className="dl-field"><span>Name</span>     <strong>RAVI KUMAR P.</strong></div>
                <div className="dl-field"><span>DL No.</span>   <strong>TS-10-2024-0054321</strong></div>
                <div className="dl-field"><span>DOB</span>      <strong>15/07/1995</strong></div>
                <div className="dl-field"><span>Valid Till</span><strong>14/07/2044</strong></div>
                <div className="dl-field"><span>Classes</span>  <strong>LMV, MCWG</strong></div>
              </div>
              <div className="dl-card-footer">
                <div className="dl-barcode">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="barcode-line" style={{ height: `${10 + (i % 3) * 6}px` }} />
                  ))}
                </div>
                <span className="dl-card-ts">Government of Telangana</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map((s, i) => (
            <div key={i} className="stat-item fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ── */}
      <section className="services-section section-pad">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Our Services</div>
            <h2>Everything You Need, Online</h2>
            <p>From application to delivery — manage your entire DL journey digitally.</p>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <Link to={s.link} key={i} className="service-card fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-icon" style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-arrow" style={{ color: s.color }}>Apply →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section section-pad">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Process</div>
            <h2>How It Works</h2>
            <p>Get your Driving Licence in 6 easy steps</p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="step-num">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Ready to Apply for Your DL?</h2>
            <p>Join 12 lakh+ citizens who have applied online. Quick, secure, and paperless.</p>
          </div>
          <div className="cta-actions">
            <Link to="/signup"      className="btn-saffron"  style={{ padding: '16px 40px', fontSize: '1.1rem' }}>Start Application</Link>
            <Link to="/eligibility" className="btn-secondary" style={{ padding: '15px 40px', fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.5)', color: 'var(--white)' }}>Check Eligibility</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;