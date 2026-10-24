import { useState } from 'react';
import { HeartHandshake, Download, Maximize2, X, Copy, Check } from 'lucide-react';

export default function GiftSection({ wedding }) {
  const [zoom, setZoom] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyAccount = async () => {
    if (!wedding.paymentName) return;
    try {
      await navigator.clipboard.writeText(wedding.paymentName);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  const downloadQr = () => {
    if (!wedding.paymentQr) return;
    const link = document.createElement('a');
    link.href = wedding.paymentQr;
    link.download = 'wedding-gift-khqr.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  return (
    <>
      <div className="gift-layout">
        <div className="gift-copy">
          <span className="section-ornament">❧</span>
          <div className="gift-icon"><HeartHandshake size={29} /></div>
          <h3>ពាក្យជូនពរ និងចងដៃ</h3>
          <p className="english-subtitle">A little gift, a lot of love</p>
          <p>វត្តមានរបស់អ្នក គឺជាកាដូដ៏មានតម្លៃបំផុតសម្រាប់យើង។ ប្រសិនបើលោកអ្នកមានបំណងចងដៃ អាចស្កេន QR ខាងក្រោមតាមកម្មវិធីធនាគាររបស់លោកអ្នក។</p>
          <p className="gift-note">Your presence is our greatest gift. A digital gift is completely optional and deeply appreciated.</p>
          {wedding.paymentName && <div className="payment-name-row"><span>Account name</span><strong>{wedding.paymentName}</strong><button className="copy-button" type="button" onClick={copyAccount}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy'}</button></div>}
          <span className="payment-label">{wedding.paymentLabel || 'KHQR / BANK QR'}</span>
          <p className="gift-hint">{wedding.paymentHint}</p>
        </div>
        <div className="gift-qr-card">
          {wedding.paymentQr ? (
            <>
              <button type="button" className="qr-image-button" onClick={() => setZoom(true)} aria-label="View payment QR larger"><img className="payment-qr-image" src={wedding.paymentQr} alt="Wedding gift payment QR code" /><span><Maximize2 size={15} /> View QR</span></button>
              <p className="qr-under-label">SCAN TO SEND A WEDDING GIFT</p>
              <button className="button button-outline qr-download" type="button" onClick={downloadQr}><Download size={16} /> ទាញយក QR / Download</button>
            </>
          ) : (
            <div className="qr-placeholder"><div className="qr-placeholder-inner"><span className="qr-corner top-left"/><span className="qr-corner top-right"/><span className="qr-corner bottom-left"/><div className="qr-center-heart">♥</div></div><strong>YOUR KHQR GOES HERE</strong><p>Admin អាច Upload រូប KHQR ពិតនៅក្នុង Admin Dashboard</p></div>
          )}
          <p className="qr-safety-note">Please confirm the recipient and amount in your banking app before sending.</p>
        </div>
      </div>
      {zoom && wedding.paymentQr && <div className="qr-lightbox" role="dialog" aria-modal="true" aria-label="Payment QR enlarged" onClick={() => setZoom(false)}><button className="icon-button qr-close" onClick={() => setZoom(false)} aria-label="Close QR"><X /></button><div className="qr-lightbox-paper" onClick={(event) => event.stopPropagation()}><img src={wedding.paymentQr} alt="Large wedding gift payment QR" /><p>{wedding.paymentLabel}</p><small>{wedding.paymentName}</small></div></div>}
    </>
  );
}
