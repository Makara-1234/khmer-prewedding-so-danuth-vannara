
import { useEffect, useRef, useState } from "react";

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const playMusic = async () => {
      try {
        await audio.play();
      } catch (error) {
        console.log("Autoplay blocked:", error);
      }
    };

    playMusic();

    // បើ Browser រារាំង Auto-play
    // អាចចាប់ផ្ដើមក្រោយអ្នកប្រើប៉ះ ឬចុច Website
    const startMusic = () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      }
    };

    document.addEventListener("click", startMusic, { once: true });
    document.addEventListener("touchstart", startMusic, { once: true });

    return () => {
      document.removeEventListener("click", startMusic);
      document.removeEventListener("touchstart", startMusic);
      audio.pause();
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/wedding.mp3"
        autoPlay
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;

          if (audio.paused) {
            audio.play().catch(console.error);
          } else {
            audio.pause();
          }
        }}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 9999,
          borderRadius: "50%",
          width: 48,
          height: 48,
          border: "none",
          cursor: "pointer",
        }}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        {playing ? "🔊" : "🎵"}
      </button>
    </>
  );
}
