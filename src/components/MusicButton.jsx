import { useRef, useState } from 'react';
import { Music2, VolumeX } from 'lucide-react';

export default function MusicButton({ enabled = true }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState('');
  if (!enabled) return null;
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setMessage('');
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setMessage('');
    } catch {
      setMessage('សូមដាក់ឯកសារភ្លេងនៅ public/music/wedding.mp3 ជាមុន។');
      setPlaying(false);
    }
  };
  return (
    <div className="music-wrap">
      <audio ref={audioRef} src="/music/wedding.mp3" loop preload="none" onEnded={() => setPlaying(false)} />
      <button type="button" className={`music-button ${playing ? 'is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause wedding music' : 'Play wedding music'}>
        {playing ? <VolumeX size={17} /> : <Music2 size={17} />}
        <span>{playing ? 'Pause music' : 'Play our song'}</span>
      </button>
      {message && <span className="music-message">{message}</span>}
    </div>
  );
}
