import { ArrowDown, Heart, MailOpen } from 'lucide-react';

function formatInvitationDate(date) {
  try {
    return new Intl.DateTimeFormat('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

export default function EnvelopeIntro({ wedding, isOpening, isDismissed, onOpen }) {
  const coupleKh = `${wedding.brideKh} និង ${wedding.groomKh}`;
  const coupleEn = `${wedding.brideEn} & ${wedding.groomEn}`;

  return (
    <section
      className={`envelope-screen${isOpening ? ' is-opening' : ''}${isDismissed ? ' is-dismissed' : ''}`}
      aria-label="Wedding invitation envelope"
      aria-hidden={isDismissed}
    >
      <div className="envelope-glow envelope-glow-one" />
      <div className="envelope-glow envelope-glow-two" />
      <div className="envelope-background-ornament ornament-top" aria-hidden="true">❧</div>
      <div className="envelope-background-ornament ornament-bottom" aria-hidden="true">❧</div>
      <div className="intro-kbach-border intro-kbach-border-top" aria-hidden="true" />
      <div className="intro-kbach-border intro-kbach-border-bottom" aria-hidden="true" />
      <img className="intro-kbach-corner intro-kbach-corner-tl" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" />
      <img className="intro-kbach-corner intro-kbach-corner-tr" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" />
      <img className="intro-kbach-corner intro-kbach-corner-bl" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" />
      <img className="intro-kbach-corner intro-kbach-corner-br" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" />

      <div className="envelope-intro-content">
        <div className="envelope-brand-mark"><img src="/elements/kbach-angkor-emblem.png" alt="" aria-hidden="true" /></div>
        <p className="envelope-eyebrow">YOU ARE CORDIALLY INVITED</p>
        <h1 className="envelope-heading">លិខិតអញ្ជើញ</h1>
        <p className="envelope-subheading">WEDDING INVITATION</p>
        <div className="envelope-couple-names">
          <span>{wedding.brideKh}</span>
          <Heart size={17} fill="currentColor" strokeWidth={1.4} />
          <span>{wedding.groomKh}</span>
        </div>
        <p className="envelope-couple-english">{coupleEn}</p>

        <button
          className="envelope-open-control"
          type="button"
          onClick={onOpen}
          disabled={isOpening || isDismissed}
          aria-label={`Open wedding invitation for ${coupleEn}`}
        >
          <span className="envelope-illustration" aria-hidden="true">
            <span className="envelope-back" />
            <span className="envelope-letter">
              <img className="letter-lotus" src="/elements/kbach-lotus-crown.png" alt="" aria-hidden="true" />
              <span className="letter-flower">WEDDING INVITATION</span>
              <span className="letter-couple">{coupleEn}</span>
              <span className="letter-line letter-line-short" />
              <span className="letter-line" />
              <span className="letter-heart"><Heart size={15} fill="currentColor" /></span>
            </span>
            <span className="envelope-side-fold envelope-side-left" />
            <span className="envelope-side-fold envelope-side-right" />
            <span className="envelope-pocket"><img className="envelope-pocket-ornament" src="/elements/kbach-lotus-divider.png" alt="" aria-hidden="true" /><img className="envelope-pocket-kbach pocket-kbach-left" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" /><img className="envelope-pocket-kbach pocket-kbach-right" src="/elements/kbach-corner-flourish.png" alt="" aria-hidden="true" /></span>
            <span className="envelope-flap"><img className="flap-ornament" src="/elements/kbach-lotus-crown.png" alt="" aria-hidden="true" /></span>
            <span className="envelope-seal"><span className="seal-ring"><img src="/elements/lotus.svg" alt="" aria-hidden="true" /></span></span>
            <span className="envelope-corner corner-one">✧</span>
            <span className="envelope-corner corner-two">✧</span>
            <span className="envelope-sparkle sparkle-one">✦</span>
            <span className="envelope-sparkle sparkle-two">✧</span>
          </span>
          <span className="envelope-tap-label">
            {isOpening ? <><MailOpen size={17} /> កំពុងបើកលិខិត…</> : <><MailOpen size={17} /> ចុចបើកស្រោមសំបុត្រ</>}
          </span>
        </button>

        <p className="envelope-date-label"><span />{formatInvitationDate(wedding.date)}<span /></p>
        <p className="envelope-hint">Tap to open your invitation <ArrowDown size={13} /></p>
        <p className="envelope-wish">ដោយក្តីស្រឡាញ់ និងក្តីគោរព</p>
      </div>
    </section>
  );
}
