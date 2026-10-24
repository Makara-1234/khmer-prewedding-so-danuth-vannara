import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

export default function RSVPForm({ guests, setGuests, coupleNames }) {
  const [form, setForm] = useState({ name: '', phone: '', attendance: 'yes', people: '2', note: '' });
  const [sent, setSent] = useState(false);
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const guest = { ...form, id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), createdAt: new Date().toISOString() };
    const next = [guest, ...guests];
    setGuests(next);
    localStorage.setItem('khmer-prewedding-rsvps-v1', JSON.stringify(next));
    setSent(true);
    setForm({ name: '', phone: '', attendance: 'yes', people: '2', note: '' });
  };
  return (
    <div className="rsvp-card">
      <div className="rsvp-intro"><span className="eyebrow">KINDLY REPLY</span><h3>សូមបញ្ជាក់ការចូលរួម</h3><p>Please let {coupleNames} know if you can join us.</p></div>
      {sent ? (
        <div className="success-panel"><CheckCircle2 size={36} /><h4>អរគុណសម្រាប់ការឆ្លើយតប!</h4><p>Your RSVP has been saved on this device.</p><button className="button button-outline" type="button" onClick={() => setSent(false)}>Submit another response</button></div>
      ) : (
        <form className="rsvp-form" onSubmit={submit}>
          <label>ឈ្មោះពេញ / Full name<input name="name" value={form.name} onChange={update} placeholder="ឧ. សុខា / Sokha" required maxLength={100} /></label>
          <label>លេខទូរស័ព្ទ / Phone<input name="phone" value={form.phone} onChange={update} placeholder="012 345 678" inputMode="tel" maxLength={30} /></label>
          <fieldset><legend>តើអ្នកអាចចូលរួមបានទេ?</legend><label className="radio-label"><input type="radio" name="attendance" value="yes" checked={form.attendance === 'yes'} onChange={update} /> បានចូលរួម / Joyfully accepts</label><label className="radio-label"><input type="radio" name="attendance" value="no" checked={form.attendance === 'no'} onChange={update} /> មិនអាចចូលរួម / Regretfully declines</label></fieldset>
          <label>ចំនួនភ្ញៀវ / Guests<select name="people" value={form.people} onChange={update} disabled={form.attendance === 'no'}><option value="1">1 person</option><option value="2">2 people</option><option value="3">3 people</option><option value="4">4 people</option><option value="5">5 people</option><option value="6+">6+ people</option></select></label>
          <label>សារជូនពរ / Message<textarea name="note" value={form.note} onChange={update} placeholder="សូមជូនពរដល់គូស្វាមីភរិយា..." rows="3" maxLength={500} /></label>
          <button className="button button-primary submit-button" type="submit"><Send size={16} /> បញ្ជូនការឆ្លើយតប / Send RSVP</button>
          <p className="privacy-note">Demo version: responses are stored only in this browser until a backend is connected.</p>
        </form>
      )}
    </div>
  );
}
