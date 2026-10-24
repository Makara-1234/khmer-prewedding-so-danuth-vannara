import { useEffect, useState } from 'react';

function getRemaining(target) {
  const diff = new Date(target).getTime() - Date.now();
  if (!Number.isFinite(diff) || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    passed: false,
  };
}

export default function Countdown({ date }) {
  const [time, setTime] = useState(() => getRemaining(date));
  useEffect(() => {
    setTime(getRemaining(date));
    const timer = window.setInterval(() => setTime(getRemaining(date)), 1000);
    return () => window.clearInterval(timer);
  }, [date]);
  const items = [
    ['ថ្ងៃ', time.days], ['ម៉ោង', time.hours], ['នាទី', time.minutes], ['វិនាទី', time.seconds],
  ];
  return (
    <div className="countdown-grid" aria-live="polite">
      {items.map(([label, value]) => (
        <div className="countdown-tile" key={label}>
          <strong>{String(value).padStart(2, '0')}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
