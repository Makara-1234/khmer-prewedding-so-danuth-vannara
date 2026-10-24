
import { useEffect, useMemo, useState } from 'react';
import {
  Heart, Menu, X, CalendarDays, MapPin, ArrowUpRight,
  Flower2, ChevronDown, Gift, QrCode, Settings2,
  ExternalLink, Sparkles, UsersRound, Scissors, Utensils, Gem
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  defaultWedding,
  weddingStorageKey,
  rsvpStorageKey
} from './data/defaultWedding.js';
import Countdown from './components/Countdown.jsx';
import Gallery from './components/Gallery.jsx';
import RSVPForm from './components/RSVPForm.jsx';
import GiftSection from './components/GiftSection.jsx';
import MusicButton from './components/MusicButton.jsx';
import AdminPanel from './components/AdminPanel.jsx';
import EnvelopeIntro from './components/EnvelopeIntro.jsx';

function loadStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function loadWeddingSettings() {
  const loaded = loadStored(weddingStorageKey, defaultWedding);

  // Update old starter data without removing custom photos.
  try {
    const migrationKey =
      'khmer-prewedding-so-danuth-vannara-migration-v1';

    if (!localStorage.getItem(migrationKey)) {
      const hasStarterNames =
        loaded.brideKh === 'សុភា' &&
        loaded.groomKh === 'ដារ៉ា' &&
        loaded.brideEn === 'Sophea' &&
        loaded.groomEn === 'Dara';

      if (hasStarterNames) {
        loaded.brideKh = defaultWedding.brideKh;
        loaded.groomKh = defaultWedding.groomKh;
        loaded.brideEn = defaultWedding.brideEn;
        loaded.groomEn = defaultWedding.groomEn;
      }

      const hasStarterSchedule = (loaded.schedule || []).some(
        (day) =>
          (day.items || []).some(
            (item) =>
              item.name === 'ពិធីសូត្រមន្តចម្រើនព្រះចត្រ័' ||
              item.name ===
                'ពិធីសំពះផ្ទឹម សែនចងដៃ និងបង្វិលពាលា' ||
              item.name === 'ពិធីកាត់ខានស្លា'
          )
      );

      if (hasStarterSchedule) {
        loaded.schedule = defaultWedding.schedule;
      }

      if (loaded.paymentName === 'Dara & Sophea') {
        loaded.paymentName = defaultWedding.paymentName;
      }

      if (
        typeof loaded.story === 'string' &&
        loaded.story.includes('សុភា')
      ) {
        loaded.story = defaultWedding.story;
      }

      localStorage.setItem(
        weddingStorageKey,
        JSON.stringify(loaded)
      );
      localStorage.setItem(migrationKey, '1');
    }
  } catch {
    // Local storage may be unavailable.
  }

  // Add the supplied couple photo to older galleries once.
  try {
    const photoMigrationKey =
      'khmer-prewedding-hero-memory-migrated-v1';

    if (!localStorage.getItem(photoMigrationKey)) {
      const suppliedPhoto = defaultWedding.gallery.find(
        (photo) => photo.id === 'hero-memory'
      );

      if (
        suppliedPhoto &&
        !(loaded.gallery || []).some(
          (photo) =>
            photo.id === suppliedPhoto.id ||
            photo.url === suppliedPhoto.url
        )
      ) {
        loaded.gallery = [
          suppliedPhoto,
          ...(loaded.gallery || [])
        ];
      }

      localStorage.setItem(photoMigrationKey, '1');
    }
  } catch {
    // Local storage may be unavailable.
  }

  return loaded;
}

function KhmerDivider({ light = false, className = '' }) {
  return (
    <div
      className={`khmer-divider ${light ? 'light' : ''} ${className}`}
      aria-hidden="true"
    >
      <img src="/elements/kbach-lotus-divider.png" alt="" />
    </div>
  );
}

function ScheduleIcon({ name }) {
  let Icon = Sparkles;

  if (name.includes('សូត្រមន្ត')) Icon = Flower2;
  else if (
    name.includes('ខាន់ស្លា') ||
    name.includes('ខានស្លា')
  ) Icon = Gift;
  else if (name.includes('អាហារ')) Icon = Utensils;
  else if (name.includes('ជួបជុំ')) Icon = UsersRound;
  else if (name.includes('ជំនូន')) Icon = Gift;
  else if (
    name.includes('ផ្លែឈើ') ||
    name.includes('ចិញ្ចៀន')
  ) Icon = Gem;
  else if (name.includes('កាត់សក់')) Icon = Scissors;

  return (
    <Icon size={16} strokeWidth={1.65} aria-hidden="true" />
  );
}

function formatDate(date) {
  try {
    return new Intl.DateTimeFormat('km-KH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  } catch {
    return new Date(date).toLocaleDateString();
  }
}

export default function App() {
  const [wedding, setWedding] = useState(
    () => loadWeddingSettings()
  );

  const [guests, setGuests] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem(rsvpStorageKey) || '[]'
      );
    } catch {
      return [];
    }
  });

  const [inviteOpened, setInviteOpened] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showInviteQr, setShowInviteQr] = useState(false);
  const [toast, setToast] = useState('');

  const openEnvelope = () => {
    if (envelopeOpening || inviteOpened) return;

    setEnvelopeOpening(true);
    window.setTimeout(() => setInviteOpened(true), 1450);
  };

  const coupleKh = `${wedding.brideKh} និង ${wedding.groomKh}`;
  const coupleEn = `${wedding.brideEn} & ${wedding.groomEn}`;

  const dateLabel = useMemo(
    () => formatDate(wedding.date),
    [wedding.date]
  );

  
const directionsUrl =
  'https://maps.app.goo.gl/muS5y8NEv8K8yoE6A?g_st=ifm';

const mapEmbedUrl =
  'https://maps.google.com/maps?q=' +
  encodeURIComponent(wedding.venue + ' ' + wedding.address) +
  '&z=14&output=embed';


  useEffect(() => {
    document.title = `${coupleEn} | Khmer Wedding Invitation`;
  }, [coupleEn]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigateTo = (id) => {
    setMobileMenuOpen(false);

    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const shareInvitation = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${coupleEn} Wedding`,
          text: 'You are invited to our wedding!',
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setToast(
          'បានចម្លង Link លិខិតអញ្ជើញ / Invitation link copied'
        );
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        setToast('មិនអាចចែករំលែក Link បានទេ។');
      }
    }
  };

  const navItems = [
    ['home', 'ទំព័រដើម', 'Home'],
    ['story', 'រឿងរ៉ាវស្នេហា', 'Our story'],
    ['gallery', 'រូបថត', 'Gallery'],
    ['event', 'ព័ត៌មានកម្មវិធី', 'The day'],
    ['gift', 'ចងដៃ', 'Gift'],
    ['rsvp', 'RSVP', 'RSVP']
  ];

  return (
    <>
      <EnvelopeIntro
        wedding={wedding}
        isOpening={envelopeOpening}
        isDismissed={inviteOpened}
        onOpen={openEnvelope}
      />

      <div
        className={`site-shell${
          inviteOpened ? '' : ' site-shell--locked'
        }`}
        aria-hidden={!inviteOpened}
      >
        <div className="top-ribbon">
          <span>✦</span>
          ជាមួយក្តីស្រឡាញ់ និងការគោរព
          <span>✦</span>
        </div>

        <header className="site-header">
          <a
            href="#home"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            aria-label="Home"
          >
            <span className="brand-mark">
              <Flower2 size={22} />
            </span>

            <span>
              <strong>{coupleKh}</strong>
              <small>OUR WEDDING INVITATION</small>
            </span>
          </a>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenuOpen((open) => !open)
            }
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>

          <nav
            className={`main-nav ${
              mobileMenuOpen ? 'mobile-open' : ''
            }`}
            aria-label="Main navigation"
          >
            {navItems.map(([id, kh, en]) => (
              <button
                key={id}
                onClick={() => navigateTo(id)}
              >
                {kh}
                <span>{en}</span>
              </button>
            ))}

            <button
              className="nav-rsvp"
              onClick={() => navigateTo('rsvp')}
            >
              RSVP <ArrowUpRight size={14} />
            </button>
          </nav>
        </header>

        <main>
          {/* HOME / HERO */}
          <section className="hero" id="home">
            <div
              className="hero-photo"
              style={{
                backgroundImage: `url("${
                  wedding.heroImage || '/images/couple-hero.jpg'
                }")`
              }}
            />

            <div className="hero-shade" />

            <div className="hero-frame" aria-hidden="true">
              <img
                className="hero-kbach-frame"
                src="/elements/kbach-frame-overlay.png"
                alt=""
              />

              {['tl', 'tr', 'bl', 'br'].map((corner) => (
                <img
                  key={corner}
                  className={`hero-kbach-mobile-corner frame-${corner}`}
                  src="/elements/kbach-corner-flourish.png"
                  alt=""
                />
              ))}
            </div>

            <div className="hero-content">
              <span className="eyebrow hero-eyebrow">
                THE BEGINNING OF FOREVER
              </span>

              <p className="hero-small-kh">
                ពិធីមង្គលការរបស់យើងខ្ញុំ
              </p>

              <div className="hero-names">
                <h1>{wedding.brideKh}</h1>
                <span className="ampersand">&amp;</span>
                <h1>{wedding.groomKh}</h1>
              </div>

              <p className="hero-english-names">{coupleEn}</p>

              <KhmerDivider light className="hero-divider" />

              <p className="hero-quote">
                “{wedding.tagline || 'Two hearts, one beautiful journey'}”
              </p>

              <div className="hero-date">
                <CalendarDays size={17} />
                <span>{dateLabel}</span>
              </div>

              <button
                className="hero-scroll"
                onClick={() => navigateTo('story')}
              >
                <span>DISCOVER OUR STORY</span>
                <ChevronDown size={18} />
              </button>
            </div>

            <span className="hero-side-note">
              សេចក្តីស្រឡាញ់ · គ្រួសារ · អនាគត
            </span>

            <MusicButton
              enabled={wedding.musicEnabled !== false}
            />
          </section>

          {/* OUR STORY */}
          <section
            className="welcome-section section-pad"
            id="story"
          >
            <div className="section-heading">
              <span className="eyebrow">
                A JOURNEY CALLED LOVE
              </span>
              <h2>រឿងរ៉ាវស្នេហារបស់យើង</h2>
              <p>Our story, our promise, our forever.</p>
              <KhmerDivider />
            </div>

            <div className="story-layout">
              <div className="story-photo-wrap">
                <img
                  className="story-photo-kbach story-photo-kbach-tl"
                  src="/elements/kbach-corner-flourish.png"
                  alt=""
                  aria-hidden="true"
                />

                <img
                  className="story-photo-kbach story-photo-kbach-br"
                  src="/elements/kbach-corner-flourish.png"
                  alt=""
                  aria-hidden="true"
                />

                <div className="story-photo">
                  <img
                    src={
                      wedding.gallery?.[0]?.url ||
                      defaultWedding.gallery[0].url
                    }
                    alt={`${coupleEn} pre-wedding portrait`}
                    loading="lazy"
                  />
                </div>

                <div className="story-photo-stamp">
                  <Heart size={24} fill="currentColor" />
                  <span>
                    made
                    <br />
                    with love
                  </span>
                </div>

                <span className="story-corner-deco">❧</span>
              </div>

              <div className="story-copy">
                <img
                  className="story-butterfly"
                  src="/elements/kbach-butterfly.png"
                  alt=""
                  aria-hidden="true"
                />

                <span className="script-kh">
                  ជួបគ្នា ស្រឡាញ់គ្នា និងដើរទៅមុខជាមួយគ្នា
                </span>

                <h3>Two souls, one beautiful story</h3>
                <p>{wedding.story}</p>

                <p className="story-quote">
                  “នៅពេលដែលយើងនៅជាមួយគ្នា
                  ទីកន្លែងធម្មតាក៏ក្លាយជាទីកន្លែងពិសេស។”
                </p>

                <button
                  className="text-link"
                  onClick={() => navigateTo('gallery')}
                >
                  View our memories <ArrowUpRight size={16} />
                </button>
              </div>
            </div>

            <div className="countdown-panel">
              <div className="countdown-title">
                <span className="eyebrow">SAVE THE DATE</span>
                <h3>រាប់ថយក្រោយដល់ថ្ងៃពិសេស</h3>
                <p>Counting down to our forever</p>
              </div>

              <Countdown date={wedding.date} />

              <div className="countdown-footer">
                <span>♥</span> {dateLabel} <span>♥</span>
              </div>
            </div>
          </section>

          {/* GALLERY */}
          <section
            className="gallery-section section-pad"
            id="gallery"
          >
            <div className="section-heading">
              <span className="eyebrow">MOMENTS WE KEEP</span>
              <h2>អនុស្សាវរីយ៍របស់យើង</h2>
              <p>Love captured in every frame.</p>
              <KhmerDivider />
            </div>

            <Gallery photos={wedding.gallery || []} />

            <p className="gallery-caption">
              <span>✦</span>
              Every picture tells a little piece of our story
              <span>✦</span>
            </p>
          </section>

          {/* WEDDING INVITATION AND SCHEDULE */}
          <section
            className="event-section section-pad"
            id="event"
          >
            <div className="invitation-spread">
              <article className="invitation-paper invitation-cover-paper">
                <div
                  className="invitation-paper-frame"
                  aria-hidden="true"
                />

                {['tl', 'tr', 'bl', 'br'].map((corner) => (
                  <img
                    key={corner}
                    className={`invitation-paper-corner paper-corner-${corner}`}
                    src="/elements/kbach-corner-flourish.png"
                    alt=""
                    aria-hidden="true"
                  />
                ))}

                <div
                  className="invitation-curtain invitation-curtain-left"
                  aria-hidden="true"
                />
                <div
                  className="invitation-curtain invitation-curtain-right"
                  aria-hidden="true"
                />

                <div className="invitation-cover-content">
                  <p className="paper-eyebrow">
                    WEDDING INVITATION
                  </p>

                  <h3>សិរីមង្គលអាពាហ៍ពិពាហ៍</h3>

                  <img
                    className="paper-angkor-emblem"
                    src="/elements/kbach-angkor-emblem.png"
                    alt=""
                    aria-hidden="true"
                  />

                  <p className="paper-honour">
                    សូមគោរពអញ្ជើញ
                  </p>

                  <div className="paper-couple-kh">
                    <span>{wedding.brideKh}</span>
                    <span className="paper-ampersand">&amp;</span>
                    <span>{wedding.groomKh}</span>
                  </div>

                  <p className="paper-couple-en">{coupleEn}</p>

                  <img
                    className="paper-lotus-divider"
                    src="/elements/kbach-lotus-divider.png"
                    alt=""
                    aria-hidden="true"
                  />

                  <p className="paper-invitation-message">
                    យើងខ្ញុំមានកិត្តិយស សូមគោរពអញ្ជើញលោកអ្នក
                    និងក្រុមគ្រួសារ ចូលរួមជាអធិបតីក្នុងពិធីមង្គល
                    អាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ។
                  </p>

                  <div className="paper-date-block">
                    <CalendarDays size={17} />
                    <div>
                      <strong>១៨ – ១៩ ខែវិច្ឆិកា ឆ្នាំ២០២៦</strong>
                      <span>
                        Wednesday &amp; Thursday · November 18–19, 2026
                      </span>
                    </div>
                  </div>

                  <div className="paper-venue-block">
                    <MapPin size={17} />
                    <div>
                      <strong>{wedding.venue}</strong>
                      <span>{wedding.address}</span>
                    </div>
                  </div>

                  <p className="paper-blessing">
                    សូមអរគុណចំពោះកិត្តិយស និងវត្តមានដ៏មានតម្លៃរបស់លោកអ្នក
                  </p>
                </div>
              </article>

              <article className="invitation-paper invitation-program-paper">
                <div
                  className="program-paper-top-ornament"
                  aria-hidden="true"
                >
                  <img src="/elements/kbach-lotus-crown.png" alt="" />
                </div>

                <p className="paper-eyebrow">WEDDING CEREMONY</p>
                <h3>កម្មវិធីមង្គលអាពាហ៍ពិពាហ៍</h3>

                <p className="program-paper-subtitle">
                  កម្មវិធីទាំងពីរថ្ងៃ · ១៨–១៩ វិច្ឆិកា ២០២៦
                </p>

                <img
                  className="paper-program-divider"
                  src="/elements/kbach-lotus-divider.png"
                  alt=""
                  aria-hidden="true"
                />

                <div className="program-paper-days">
                  {(wedding.schedule || defaultWedding.schedule).map(
                    (day, dayIndex) => (
                      <section
                        className="program-paper-day"
                        key={day.title}
                      >
                        <header className="program-paper-day-heading">
                          <span className="program-paper-day-number">
                            ០{dayIndex + 1}
                          </span>
                          <div>
                            <h4>{day.title}</h4>
                            <p>{day.date}</p>
                          </div>
                        </header>

                        <div className="program-paper-timeline">
                          {day.items.map((item, itemIndex) => (
                            <div
                              className="program-paper-item"
                              key={`${item.time}-${itemIndex}`}
                            >
                              <div className="program-paper-time">
                                <strong>{item.time}</strong>
                                <span>{item.en}</span>
                              </div>

                              <span className="program-paper-icon">
                                <ScheduleIcon name={item.name} />
                              </span>

                              <p>{item.name}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )
                  )}
                </div>

                <p className="program-paper-footer">
                  សូមគោរពអញ្ជើញដោយក្តីស្រឡាញ់
                </p>
              </article>
            </div>

            <div className="map-card">
              <div className="map-heading">
                <div>
                  <span className="eyebrow">FIND YOUR WAY</span>
                  <h3>ផែនទីទៅកាន់កម្មវិធី</h3>
                  <p>
                    {wedding.venue} · {wedding.address}
                  </p>
                </div>

                <a
                  className="button button-light"
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapPin size={16} /> Open Google Maps
                </a>
              </div>

              <div className="map-frame">
                <iframe
                  title="Wedding venue map"
                  src={mapEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </section>

          {/* GIFT */}
          <section
            className="gift-section section-pad"
            id="gift"
          >
            <div className="section-heading">
              <span className="eyebrow">A TOKEN OF YOUR LOVE</span>
              <h2>ជូនពរ និងចងដៃ</h2>
              <p>With gratitude, from our hearts to yours.</p>
              <KhmerDivider />
            </div>

            <GiftSection wedding={wedding} />
          </section>

          {/* RSVP */}
          <section
            className="rsvp-section section-pad"
            id="rsvp"
          >
            <img
              className="rsvp-background-ornament ornament-left"
              src="/elements/kbach-butterfly.png"
              alt=""
              aria-hidden="true"
            />

            <img
              className="rsvp-background-ornament ornament-right"
              src="/elements/kbach-butterfly.png"
              alt=""
              aria-hidden="true"
            />

            <div className="section-heading light-heading">
              <span className="eyebrow">
                WE HOPE YOU CAN JOIN US
              </span>
              <h2>រង់ចាំជួបអ្នកនៅថ្ងៃពិសេស</h2>
              <p>Your presence would mean the world to us.</p>
              <KhmerDivider light />
            </div>

            <div className="rsvp-columns">
              <div className="rsvp-message">
                <span className="script-kh">
                  សូមអញ្ជើញក្រុមគ្រួសារ និងមិត្តភក្តិជាទីស្រឡាញ់
                </span>

                <h3>
                  Celebrate love
                  <br />
                  with us.
                </h3>

                <p>
                  យើងខ្ញុំសូមគោរពអញ្ជើញលោកអ្នកចូលរួមអបអរសាទរ
                  ថ្ងៃដ៏មានអត្ថន័យនេះ។ សូមបញ្ជាក់ការចូលរួម
                  ដើម្បីឱ្យយើងអាចរៀបចំទទួលស្វាគមន៍លោកអ្នក
                  បានយ៉ាងកក់ក្តៅ។
                </p>

                <div className="rsvp-date-note">
                  <CalendarDays size={19} />
                  <div>
                    <strong>{dateLabel}</strong>
                    <span>{wedding.venue}</span>
                  </div>
                </div>

                <button
                  className="rsvp-share-link"
                  onClick={shareInvitation}
                >
                  <ExternalLink size={15} />
                  Share invitation link
                </button>

                <button
                  className="rsvp-share-link"
                  onClick={() => setShowInviteQr(true)}
                >
                  <QrCode size={16} />
                  Show invitation QR
                </button>
              </div>

              <RSVPForm
                guests={guests}
                setGuests={setGuests}
                coupleNames={coupleEn}
              />
            </div>
          </section>
        </main>

        {/* FOOTER AND CREDIT */}
        <footer className="site-footer">
          <img
            className="footer-wax-seal"
            src="/elements/wax-seal.svg"
            alt=""
            aria-hidden="true"
          />

          <p className="footer-kh">
            សូមអរគុណដែលបានចូលរួមជាផ្នែកមួយនៃអនុស្សាវរីយ៍យើង
          </p>

          <h2>
            {wedding.brideKh} <span>&amp;</span> {wedding.groomKh}
          </h2>

          <p className="footer-date">
            {dateLabel} · {wedding.address}
          </p>

          <div className="footer-rule">
            <span />♥<span />
          </div>

          <p className="footer-credit footer-credit-label">
            DESIGNED &amp; DEVELOPED BY
          </p>

          <p className="footer-author">Vorn Norin Makara</p>

          <p className="footer-credit">
            MADE WITH LOVE · KHMER WEDDING INVITATION
          </p>

          <button
            className="admin-trigger"
            type="button"
            onClick={() => setAdminOpen(true)}
          >
            <Settings2 size={14} /> Admin Dashboard
          </button>

          <button
            className="footer-qr-trigger"
            type="button"
            onClick={() => setShowInviteQr(true)}
          >
            <QrCode size={14} /> Invitation QR
          </button>
        </footer>

        {/* INVITATION QR MODAL */}
        {showInviteQr && (
          <div
            className="invite-modal-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="Invitation QR code"
            onClick={() => setShowInviteQr(false)}
          >
            <div
              className="invite-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="icon-button invite-modal-close"
                onClick={() => setShowInviteQr(false)}
                aria-label="Close QR"
              >
                <X />
              </button>

              <span className="eyebrow">OUR WEDDING</span>
              <h3>ស្កេនដើម្បីបើកលិខិតអញ្ជើញ</h3>

              <QRCodeCanvas
                value={window.location.href.split('#')[0]}
                size={220}
                level="H"
                includeMargin
              />

              <p>{coupleEn}</p>
              <small>
                Use your phone camera to scan this invitation QR.
              </small>

              <button
                className="button button-primary"
                onClick={() => {
                  const canvas = document.querySelector(
                    '.invite-modal canvas'
                  );

                  if (!canvas) return;

                  const link = document.createElement('a');
                  link.href = canvas.toDataURL('image/png');
                  link.download = 'wedding-invitation-qr.png';
                  link.click();
                }}
              >
                <QrCode size={16} /> Download QR
              </button>
            </div>
          </div>
        )}

        {/* ADMIN DASHBOARD */}
        {adminOpen && (
          <AdminPanel
            wedding={wedding}
            setWedding={setWedding}
            guests={guests}
            setGuests={setGuests}
            onClose={() => setAdminOpen(false)}
          />
        )}

        {toast && (
          <div className="toast-message" role="status">
            {toast}
          </div>
        )}

        <button
          className="floating-gift"
          type="button"
          onClick={() => navigateTo('gift')}
          aria-label="Go to wedding gift"
        >
          <Gift size={19} />
          <span>Gift</span>
        </button>
      </div>
    </>
  );
}
