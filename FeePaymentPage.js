import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './ModulePages.css';

const feeStructure = {
  "Learner's Licence (LL)": { fee: 200, test: 50, service: 30 },
  "Original Driving Licence (DL)": { fee: 400, test: 300, service: 50 },
  "DL Renewal": { fee: 350, test: 0, service: 50 },
  "International DL": { fee: 1000, test: 0, service: 100 },
};

const FeePaymentPage = () => {
  const { addNotification } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ licenceType: '', appId: '', payMethod: '', cardNo: '', cardName: '', expiry: '', cvv: '', upiId: '' });
  const [receipt, setReceipt] = useState(null);

  const selected = feeStructure[form.licenceType];
  const total = selected ? selected.fee + selected.test + selected.service : 0;

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = (e) => {
    e.preventDefault();
    if (!form.payMethod) { toast.error('Select a payment method.'); return; }
    if (form.payMethod === 'Card' && (!form.cardNo || !form.cardName || !form.expiry || !form.cvv)) {
      toast.error('Fill card details.'); return;
    }
    if (form.payMethod === 'UPI' && !form.upiId) { toast.error('Enter UPI ID.'); return; }

    const txnId = 'TXN' + Date.now();
    const rec = {
      txnId,
      licenceType: form.licenceType,
      appId: form.appId || 'N/A',
      amount: total,
      date: new Date().toLocaleString('en-IN'),
      method: form.payMethod,
      status: 'Success',
    };
    setReceipt(rec);
    addNotification({ type: 'success', message: `Payment of ₹${total} successful. TxnID: ${txnId}`, time: new Date().toISOString() });
    setStep(3);
    toast.success('Payment successful!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main className="module-main">
        <div className="container" style={{ maxWidth: 700 }}>
          <div className="module-header">
            <h1>💳 Fee Payment</h1>
            <p>Pay your DL application and test fees securely through our online payment gateway.</p>
          </div>

          {/* Step 1 - Select Type */}
          {step === 1 && (
            <div className="form-card fade-in">
              <h3>Select Licence Type & Application</h3>
              <div className="auth-form" style={{ marginTop: 20 }}>
                <div className="form-group">
                  <label>Licence Type *</label>
                  <select name="licenceType" className="form-control" value={form.licenceType} onChange={handleChange}>
                    <option value="">-- Select --</option>
                    {Object.keys(feeStructure).map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Application ID (optional)</label>
                  <input name="appId" className="form-control" placeholder="e.g. DL1234567890" value={form.appId} onChange={handleChange} />
                </div>

                {selected && (
                  <div className="fee-breakdown fade-in">
                    <h4>Fee Breakdown</h4>
                    <div className="fee-row"><span>Application Fee</span><strong>₹{selected.fee}</strong></div>
                    {selected.test > 0 && <div className="fee-row"><span>Test Fee</span><strong>₹{selected.test}</strong></div>}
                    <div className="fee-row"><span>Service Charge</span><strong>₹{selected.service}</strong></div>
                    <div className="fee-row total-row"><span>Total Payable</span><strong>₹{total}</strong></div>
                  </div>
                )}

                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14 }}
                  onClick={() => { if (!form.licenceType) { toast.error('Select licence type.'); return; } setStep(2); }}>
                  Proceed to Pay →
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <div className="form-card fade-in">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3>Payment Details</h3>
                <div className="fee-total-badge">₹{total}</div>
              </div>

              <div className="pay-method-tabs">
                {['UPI', 'Card', 'Net Banking', 'Wallet'].map(m => (
                  <button key={m} type="button"
                    className={`pay-tab ${form.payMethod === m ? 'active' : ''}`}
                    onClick={() => setForm(f => ({ ...f, payMethod: m }))}>
                    {m === 'UPI' ? '📱' : m === 'Card' ? '💳' : m === 'Net Banking' ? '🏦' : '👛'} {m}
                  </button>
                ))}
              </div>

              <form onSubmit={handlePay} className="auth-form" style={{ marginTop: 20 }}>
                {form.payMethod === 'UPI' && (
                  <div className="form-group fade-in">
                    <label>UPI ID *</label>
                    <input name="upiId" className="form-control" placeholder="yourname@upi" value={form.upiId} onChange={handleChange} />
                    <span className="field-hint">e.g. 9876543210@paytm or name@okaxis</span>
                  </div>
                )}
                {form.payMethod === 'Card' && (
                  <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label>Card Number *</label>
                      <input name="cardNo" className="form-control" placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNo} onChange={e => setForm(f => ({ ...f, cardNo: e.target.value.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim() }))} />
                    </div>
                    <div className="form-group">
                      <label>Cardholder Name *</label>
                      <input name="cardName" className="form-control" placeholder="Name on card" value={form.cardName} onChange={handleChange} />
                    </div>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Expiry (MM/YY) *</label>
                        <input name="expiry" className="form-control" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>CVV *</label>
                        <input name="cvv" type="password" className="form-control" placeholder="•••" maxLength={3} value={form.cvv} onChange={handleChange} />
                      </div>
                    </div>
                  </div>
                )}
                {form.payMethod === 'Net Banking' && (
                  <div className="form-group fade-in">
                    <label>Select Bank *</label>
                    <select className="form-control">
                      <option value="">-- Select Bank --</option>
                      {['SBI','HDFC Bank','ICICI Bank','Axis Bank','Bank of Baroda','Canara Bank','Union Bank'].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                )}
                {form.payMethod === 'Wallet' && (
                  <div className="form-group fade-in">
                    <label>Select Wallet *</label>
                    <select className="form-control">
                      <option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option><option>Mobikwik</option>
                    </select>
                  </div>
                )}

                {form.payMethod && (
                  <button type="submit" className="btn-saffron" style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
                    🔐 Pay ₹{total} Securely
                  </button>
                )}
              </form>
              <button className="btn-secondary" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => setStep(1)}>← Back</button>
            </div>
          )}

          {/* Step 3 - Receipt */}
          {step === 3 && receipt && (
            <div className="form-card fade-in" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
              <h2 style={{ color: 'var(--success)', marginBottom: 8 }}>Payment Successful!</h2>
              <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Your payment has been processed. Here is your receipt.</p>
              <div className="receipt-box">
                <div className="receipt-header">PAYMENT RECEIPT — MeeSeva DL Portal</div>
                {[
                  ['Transaction ID', receipt.txnId],
                  ['Application ID', receipt.appId],
                  ['Service', receipt.licenceType],
                  ['Amount Paid', `₹${receipt.amount}`],
                  ['Payment Method', receipt.method],
                  ['Date & Time', receipt.date],
                  ['Status', receipt.status],
                ].map(([k, v]) => (
                  <div key={k} className="receipt-row">
                    <span>{k}</span><strong>{v}</strong>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
                <button className="btn-primary" onClick={() => window.print()}>🖨️ Print Receipt</button>
                <button className="btn-secondary" onClick={() => { setStep(1); setForm(f => ({ ...f, licenceType: '', appId: '', payMethod: '' })); setReceipt(null); }}>New Payment</button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeePaymentPage;
