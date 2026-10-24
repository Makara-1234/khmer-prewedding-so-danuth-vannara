import { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, LockKeyhole, Settings2, QrCode, Users, Download, Save, Upload, Trash2, ExternalLink, ImagePlus } from 'lucide-react';

const ADMIN_PASSWORD = 'admin123'; // Demo only. Replace before deployment; client-side password is not secure.

function compressImage(file, maxSize = 1200) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Cannot read image file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Unsupported image file.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function compressGalleryImage(file, maxSize = 1100, quality = 0.76) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Cannot read image file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Unsupported image file.'));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        // JPEG compression keeps browser storage small enough for a few gallery photos.
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function downloadCsv(guests) {
  const columns = ['name', 'phone', 'attendance', 'people', 'note', 'createdAt'];
  const csvCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [columns.join(','), ...guests.map((guest) => columns.map((key) => csvCell(guest[key])).join(','))].join('\r\n');
  const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'wedding-rsvp.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AdminPanel({ wedding, setWedding, guests, setGuests, onClose }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('settings');
  const [draft, setDraft] = useState(() => structuredClone(wedding));
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [loginShow, setLoginShow] = useState(false);
  const inviteUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : '';
  const yesCount = useMemo(() => guests.filter((guest) => guest.attendance === 'yes').length, [guests]);
  const update = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };
  const save = () => {
    try {
      const serialized = JSON.stringify(draft);
      if (serialized.length > 4_000_000) {
        setError('ទិន្នន័យរូបភាពធំពេកសម្រាប់ Browser។ សូមលុបរូបខ្លះ ឬប្រើរូបទំហំតូចជាងនេះ។');
        return;
      }
      localStorage.setItem('khmer-prewedding-settings-v1', serialized);
      setWedding(draft);
      setSaved(true);
      setError('');
    } catch {
      setError('រក្សាទុកមិនបានទេ។ សូមបន្ថយចំនួន ឬទំហំរូបភាព រួចសាកល្បងម្ដងទៀត។');
    }
  };
  const onQrUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('សូមជ្រើសរើសឯកសាររូបភាព PNG ឬ JPG។');
      return;
    }
    setUploading(true);
    setError('');
    try {
      const dataUrl = await compressImage(file);
      update('paymentQr', dataUrl);
    } catch {
      setError('មិនអាចអានរូបភាពនេះបានទេ។ សូមសាកល្បងរូបភាពផ្សេង។');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  const removeGuest = (id) => {
    const next = guests.filter((guest) => guest.id !== id);
    setGuests(next);
    localStorage.setItem('khmer-prewedding-rsvps-v1', JSON.stringify(next));
  };
  const updatePhoto = (id, key, value) => update('gallery', draft.gallery.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const addPhoto = () => update('gallery', [...draft.gallery, { id: `photo-${Date.now()}`, label: 'New photo', url: '' }]);
  const onHeroUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('សូមជ្រើសរើសឯកសាររូបភាព PNG, JPG ឬ WebP។');
      event.target.value = '';
      return;
    }
    setUploadingHero(true);
    setError('');
    try {
      const dataUrl = await compressGalleryImage(file, 1800, 0.84);
      update('heroImage', dataUrl);
    } catch {
      setError('មិនអាចបញ្ចូលរូបផ្ទៃខាងក្រោយបានទេ។ សូមសាកល្បង JPG ឬ PNG ផ្សេង។');
    } finally {
      setUploadingHero(false);
      event.target.value = '';
    }
  };

  const onGalleryUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const invalid = files.find((file) => !file.type.startsWith('image/'));
    if (invalid) {
      setError('សូមជ្រើសរើសតែឯកសាររូបភាពប៉ុណ្ណោះ (JPG, PNG ឬ WebP)។');
      event.target.value = '';
      return;
    }
    setUploadingGallery(true);
    setError('');
    try {
      const photos = [];
      for (const file of files) {
        const url = await compressGalleryImage(file);
        photos.push({
          id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          label: file.name.replace(/\.[^.]+$/, '').slice(0, 80) || 'Pre-wedding photo',
          url,
        });
      }
      update('gallery', [...draft.gallery, ...photos]);
      setSaved(false);
    } catch {
      setError('មិនអាចបញ្ចូលរូបភាពបានទេ។ សូមសាកល្បង JPG ឬ PNG ទំហំតូចជាងនេះ។');
    } finally {
      setUploadingGallery(false);
      event.target.value = '';
    }
  };

  return (
    <div className="admin-backdrop" role="dialog" aria-modal="true" aria-label="Wedding administration" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin-window">
        <header className="admin-header"><div><span className="eyebrow">PRIVATE AREA</span><h2><Settings2 size={21} /> Wedding Admin</h2></div><button className="icon-button admin-close" type="button" onClick={onClose} aria-label="Close admin"><X /></button></header>
        {!authenticated ? (
          <div className="admin-login"><div className="admin-lock"><LockKeyhole size={31} /></div><h3>ចូលប្រើ Admin Dashboard</h3><p>Enter the demo password to manage your wedding page.</p><form onSubmit={(event) => { event.preventDefault(); if (password === ADMIN_PASSWORD) { setAuthenticated(true); setError(''); } else setError('ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។'); }}><label htmlFor="admin-password">Password</label><input id="admin-password" autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter admin password" required /><button className="button button-primary" type="submit">Sign in</button></form><p className="admin-demo-hint">Demo password: <code>admin123</code>. Do not use this client-side login for real security.</p>{error && <p className="form-error">{error}</p>}</div>
        ) : (
          <>
            <nav className="admin-tabs" aria-label="Admin sections"><button className={tab === 'settings' ? 'active' : ''} onClick={() => setTab('settings')}><Settings2 size={16} /> ព័ត៌មាន</button><button className={tab === 'qr' ? 'active' : ''} onClick={() => setTab('qr')}><QrCode size={16} /> QR & ចងដៃ</button><button className={tab === 'guests' ? 'active' : ''} onClick={() => setTab('guests')}><Users size={16} /> RSVP ({guests.length})</button></nav>
            <div className="admin-content">
              {tab === 'settings' && <>
                <div className="admin-section-heading"><h3>Wedding details</h3><p>កែប្រែព័ត៌មានដែលបង្ហាញនៅលើទំព័រមង្គលការ</p></div>
                <div className="admin-fields two-col">
                  <label>ឈ្មោះកូនក្រមុំ<input value={draft.brideKh} onChange={(e) => update('brideKh', e.target.value)} /></label>
                  <label>ឈ្មោះកូនកំលោះ<input value={draft.groomKh} onChange={(e) => update('groomKh', e.target.value)} /></label>
                  <label>Bride name (English)<input value={draft.brideEn} onChange={(e) => update('brideEn', e.target.value)} /></label>
                  <label>Groom name (English)<input value={draft.groomEn} onChange={(e) => update('groomEn', e.target.value)} /></label>
                  <label>ថ្ងៃ និងម៉ោងរៀបការ<input type="datetime-local" value={draft.date?.slice(0, 16) || ''} onChange={(e) => update('date', e.target.value)} /></label>
                  <label>ឃ្លាស្នេហា / Tagline<input value={draft.tagline} onChange={(e) => update('tagline', e.target.value)} /></label>
                  <label>ម៉ោងពិធីព្រឹក<input value={draft.ceremonyTime} onChange={(e) => update('ceremonyTime', e.target.value)} /></label>
                  <label>ម៉ោងពិធីល្ងាច<input value={draft.receptionTime} onChange={(e) => update('receptionTime', e.target.value)} /></label>
                  <label className="span-two">ទីតាំងពិធី / Venue<input value={draft.venue} onChange={(e) => update('venue', e.target.value)} /></label>
                  <label className="span-two">អាសយដ្ឋាន / Address<input value={draft.address} onChange={(e) => update('address', e.target.value)} /></label>
                  <label className="span-two">រឿងរ៉ាវស្នេហា / Our story<textarea rows="4" value={draft.story} onChange={(e) => update('story', e.target.value)} /></label>
                </div>
                <section className="hero-photo-admin">
                  <div className="admin-section-heading hero-photo-admin-heading"><div><h3>Hero photo · រូបថតផ្ទៃខាងក្រោយ</h3><p>រូបនេះបង្ហាញនៅទំព័រដើម ហើយអក្សរនឹងស្ថិតនៅខាងឆ្វេង។</p></div></div>
                  <div className="hero-photo-admin-grid">
                    <div className="hero-photo-admin-preview"><img src={draft.heroImage || '/images/couple-hero.jpg'} alt="Hero photo preview" /><span>Text on the left · រូបភាពនៅខាងស្តាំ</span></div>
                    <div className="hero-photo-admin-controls"><label className="button button-primary gallery-upload-button"><ImagePlus size={16} /> {uploadingHero ? 'កំពុងបញ្ចូលរូប...' : 'Upload hero photo'}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={onHeroUpload} disabled={uploadingHero} /></label><button type="button" className="button button-outline small" onClick={() => update('heroImage', '/images/couple-hero.jpg')}><Upload size={14} /> Use supplied photo</button><p className="admin-help">រូបត្រូវបានបង្រួមដោយស្វ័យប្រវត្តិ។ ចុច Save ដើម្បីបង្ហោះទៅផ្នែកទំព័រដើមក្នុង Browser នេះ។</p></div>
                  </div>
                </section>
                <div className="admin-section-heading photo-admin-heading"><div><h3>Gallery photos</h3><p>Upload រូបថតពីកុំព្យូទ័រ ឬទូរស័ព្ទ ឬបញ្ចូល URL។</p></div><div className="photo-admin-actions"><label className="button button-primary small gallery-upload-button"><ImagePlus size={15} /> {uploadingGallery ? 'កំពុងបញ្ចូល...' : 'Upload photos'}<input type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={onGalleryUpload} disabled={uploadingGallery} /></label><button type="button" className="button button-outline small" onClick={addPhoto}>+ Add photo URL</button></div></div>
                <p className="admin-help">រូបថតនឹងបង្រួមទំហំដោយស្វ័យប្រវត្តិ និងបង្ហាញក្នុង Gallery បន្ទាប់ពីចុច Save។ សូមប្រើរូបភាពផ្ទាល់ខ្លួនដែលមានសិទ្ធិប្រើប្រាស់។</p>
                <div className="admin-photo-list">{draft.gallery.map((photo) => <div className="admin-photo-row" key={photo.id}><img src={photo.url || 'https://placehold.co/80x80?text=Photo'} alt="Gallery thumbnail" onError={(e) => { e.currentTarget.src = 'https://placehold.co/80x80?text=Photo'; }} /><div className="admin-photo-inputs"><input aria-label="Photo label" value={photo.label} onChange={(e) => updatePhoto(photo.id, 'label', e.target.value)} placeholder="Photo label" /><input aria-label="Photo URL" value={photo.url} onChange={(e) => updatePhoto(photo.id, 'url', e.target.value)} placeholder="https://..." /></div><button className="icon-button delete-button" type="button" aria-label="Remove photo" onClick={() => update('gallery', draft.gallery.filter((item) => item.id !== photo.id))}><Trash2 size={17} /></button></div>)}</div>
                <div className="admin-savebar"><span className={saved ? 'save-success' : 'admin-help'}>{saved ? 'Saved successfully ✓' : 'Changes take effect after saving.'}</span><button className="button button-primary" onClick={save}><Save size={16} /> រក្សាទុក / Save</button></div>
              </>}
              {tab === 'qr' && <>
                <div className="admin-section-heading"><h3>Digital wedding gift</h3><p>បញ្ចូល QR ទូទាត់ពិតពីកម្មវិធីធនាគាររបស់អ្នក</p></div>
                <div className="admin-gift-grid"><div className="admin-fields">
                  <label>ប្រភេទ QR / Payment label<input value={draft.paymentLabel || ''} onChange={(e) => update('paymentLabel', e.target.value)} placeholder="KHQR / ABA PAY" /></label>
                  <label>ឈ្មោះគណនី / Account name<input value={draft.paymentName || ''} onChange={(e) => update('paymentName', e.target.value)} placeholder="Account holder name" /></label>
                  <label>សេចក្តីណែនាំ<input value={draft.paymentHint || ''} onChange={(e) => update('paymentHint', e.target.value)} placeholder="How to send a gift" /></label>
                  <label className="upload-drop"><Upload size={20} /><strong>{uploading ? 'កំពុងបញ្ចូល...' : 'Upload bank QR image'}</strong><span>PNG or JPG · QR from your actual banking app</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={onQrUpload} disabled={uploading} /></label>
                  {draft.paymentQr && <button className="button button-outline danger-outline" type="button" onClick={() => update('paymentQr', '')}><Trash2 size={15} /> Remove payment QR</button>}
                </div><div className="admin-qr-preview">{draft.paymentQr ? <img src={draft.paymentQr} alt="Payment QR preview" /> : <div className="empty-qr"><QrCode size={48} /><span>No bank QR uploaded</span></div>}<strong>{draft.paymentLabel || 'KHQR / BANK QR'}</strong><small>{draft.paymentName || 'Account name appears here'}</small><p>សាកល្បងស្កេនរូប QR នេះដោយកម្មវិធីធនាគារមុន Publish។</p></div></div>
                <div className="admin-warning"><strong>សុវត្ថិភាព៖</strong> QR នេះត្រូវមកពីធនាគាររបស់បងផ្ទាល់។ កុំប្រើ QR សាកល្បងសម្រាប់ការទូទាត់ពិត។ អ្នកភ្ញៀវត្រូវពិនិត្យឈ្មោះអ្នកទទួល និងចំនួនទឹកប្រាក់ក្នុងកម្មវិធីធនាគារ។</div>
                <div className="admin-section-heading invite-heading"><h3>QR លិខិតអញ្ជើញ</h3><p>Scan ពីទូរស័ព្ទដើម្បីបើក Website នេះ</p></div>
                <div className="invite-qr-row"><QRCodeCanvas value={inviteUrl} size={148} level="H" includeMargin /><div><strong>Wedding website QR</strong><p>URL: {inviteUrl}</p><p>បន្ទាប់ពី Publish Website ទៅអ៊ីនធឺណិត QR នឹងប្រើ URL បច្ចុប្បន្នរបស់ Website។</p><button className="button button-outline small" onClick={() => { const canvas = document.querySelector('.invite-qr-row canvas'); if (!canvas) return; const anchor = document.createElement('a'); anchor.download = 'wedding-invitation-qr.png'; anchor.href = canvas.toDataURL('image/png'); anchor.click(); }}><Download size={15} /> Download invitation QR</button></div></div>
                <div className="admin-savebar"><span className={saved ? 'save-success' : 'admin-help'}>{saved ? 'Saved successfully ✓' : 'Save to publish these changes in this browser.'}</span><button className="button button-primary" onClick={save}><Save size={16} /> រក្សាទុក / Save</button></div>
              </>}
              {tab === 'guests' && <>
                <div className="guest-stats"><div><strong>{guests.length}</strong><span>Total replies</span></div><div><strong>{yesCount}</strong><span>Accepts</span></div><div><strong>{guests.length - yesCount}</strong><span>Declines</span></div></div>
                <div className="guest-table-header"><div><h3>RSVP responses</h3><p>Responses saved in this browser only.</p></div><button className="button button-outline small" onClick={() => downloadCsv(guests)} disabled={!guests.length}><Download size={15} /> Export CSV</button></div>
                {!guests.length ? <div className="empty-guests"><Users size={36} /><h4>No RSVP responses yet</h4><p>Guest replies will appear here after someone submits the form on this device.</p></div> : <div className="guest-list">{guests.map((guest) => <article className="guest-item" key={guest.id}><div className="guest-avatar">{guest.name?.trim()?.[0] || '?'}</div><div className="guest-details"><strong>{guest.name}</strong><span>{guest.phone || 'No phone'} · {guest.people || 1} guest(s)</span>{guest.note && <p>{guest.note}</p>}</div><span className={`attendance-badge ${guest.attendance === 'yes' ? 'accepted' : 'declined'}`}>{guest.attendance === 'yes' ? 'Accepts' : 'Declines'}</span><button className="icon-button delete-button" onClick={() => removeGuest(guest.id)} aria-label={`Delete response from ${guest.name}`}><Trash2 size={16} /></button></article>)}</div>}
              </>}
              {error && <p className="form-error admin-error">{error}</p>}
            </div>
            <footer className="admin-footer"><span><LockKeyhole size={13} /> Demo admin · local browser storage</span><a href="#home" onClick={onClose}>View website <ExternalLink size={13} /></a></footer>
          </>
        )}
      </section>
    </div>
  );
}
