import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Gallery({ photos = [] }) {
  const [active, setActive] = useState(-1);
  const current = active >= 0 ? photos[active] : null;
  const move = (direction) => setActive((index) => (index + direction + photos.length) % photos.length);
  return (
    <>
      <div className="gallery-grid">
        {photos.map((photo, index) => (
          <button className={`gallery-card gallery-card-${index % 3}`} key={photo.id || photo.url} onClick={() => setActive(index)} aria-label={`Open photo ${index + 1}`}>
            <img src={photo.url} alt={photo.label || `Pre-wedding photo ${index + 1}`} loading="lazy" />
            <span className="gallery-overlay"><ZoomIn size={18} /> {photo.label || 'View photo'}</span>
          </button>
        ))}
      </div>
      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setActive(-1)}>
          <button className="lightbox-close icon-button" aria-label="Close" onClick={() => setActive(-1)}><X /></button>
          <button className="lightbox-prev icon-button" aria-label="Previous" onClick={(event) => { event.stopPropagation(); move(-1); }}><ChevronLeft /></button>
          <img src={current.url} alt={current.label || 'Wedding photo'} onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-next icon-button" aria-label="Next" onClick={(event) => { event.stopPropagation(); move(1); }}><ChevronRight /></button>
          <p>{current.label}</p>
        </div>
      )}
    </>
  );
}
