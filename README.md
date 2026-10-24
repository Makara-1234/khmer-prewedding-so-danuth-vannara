<<<<<<< HEAD
# Khmer Pre-Wedding Website 🇰🇭💍

A responsive Khmer-inspired wedding invitation and pre-wedding gallery built with **React + Vite + Tailwind CSS v4**.

## Included features

- Khmer + English invitation page with a warm wine, gold, and cream visual theme.
- Responsive navigation and mobile-friendly layouts.
- Enhanced Khmer ornamental details: traditional-inspired corner filigree, lotus crest, gold section dividers, wax-seal lotus, and subtle programme-card watermarks.
- Love story, pre-wedding image gallery, and photo lightbox.
- Live wedding countdown.
- Background music button (bring your own MP3).
- Wedding date, venue, and Google Maps directions/embed. Includes a two-day Khmer wedding program (18–19 November 2026) with each ceremony time.
- RSVP form with attendance choice and guest count.
- Digital wedding-gift section for displaying a **real KHQR/bank QR image provided by the couple**.
- Download/zoom payment QR on the guest page.
- Invitation QR code that can be scanned by a phone to open the website.
- Demo Admin Dashboard to edit couple names, dates, venue, story, gallery URLs, payment information/QR image, and RSVP responses.
- Export RSVP responses as CSV.

## Requirements

- Node.js 20.19+ or 22.12+ recommended.
- npm.

## Install and run

Open a terminal in this project folder:

```bash
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`. Open it in a browser.

Build for production:

```bash
npm run build
npm run preview
```

The production-ready website files are written to `dist/`. Deploy that folder to a static hosting service such as Netlify, Vercel, or GitHub Pages (configure the service for a Vite SPA if needed).

## First-time setup

1. Open the website and scroll to the footer. Select **Admin Dashboard**.
2. Demo admin password: `admin123`.
3. In **ព័ត៌មាន / Details**, change the bride and groom names, wedding date/time, venue/address, love story, and gallery image URLs. Press **Save**.
4. In **QR & ចងដៃ**, upload a clear PNG/JPG image of your real KHQR/payment code exported from your banking app. Fill in the correct payment label and account name, then press **Save**.
5. Test the payment QR with your bank app before sharing the public link. Verify the displayed recipient name carefully.
6. In **RSVP**, review replies and choose **Export CSV** to download a spreadsheet-friendly file.
7. To enable music, put a licensed/owned MP3 at `public/music/wedding.mp3`, then rebuild/redeploy.

## Important limitations before public launch

- **Admin security:** `admin123` is a demo-only client-side gate. It is not secure authentication; anyone who can inspect the site code can discover it. For production, replace this with a real server-side authentication solution.
- **Storage:** wedding settings and RSVP replies are stored in this browser's `localStorage`. They do not automatically sync to another phone/computer, and clearing browser data may delete them. To collect guests from different devices, connect a backend/database (for example, Supabase or Firebase) and secure the Admin API.
- **Payment QR:** the app does not generate fake banking credentials or process payments. The couple must upload an actual KHQR/bank QR supplied by their bank. On phones, guests can open/save the QR and use their banking app to scan it; use a second device if their banking app cannot scan an image saved on the same phone.
- **Invitation QR:** it encodes the current page URL. Use the deployed public HTTPS URL to make a QR guests can scan outside your local network. A localhost URL only works on the development machine.
- **Photos:** initial Gallery URLs are example remote image URLs. Replace them with photos you own or are licensed to use. Internet access is needed for Google Fonts, external photos, and map embeds.
- **Maps:** the map embed and directions search are generated from the venue and address fields. Enter the exact venue/address to improve results.
- **Audio:** browsers generally block auto-play until the visitor clicks the music button; this is intentional.

## Project structure

```text
khmer-prewedding/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   ├── elements/
│   │   ├── corner.svg
│   │   ├── crest.svg
│   │   ├── divider.svg
│   │   ├── kbach-repeat.svg
│   │   ├── lotus.svg
│   │   └── ... (wax seal and butterfly)
│   ├── textures/
│   │   ├── paper-cream.webp
│   │   ├── paper-olive.webp
│   │   └── paper-lining.webp
│   └── music/
│       └── README.txt
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── data/
    │   └── defaultWedding.js
    └── components/
        ├── EnvelopeIntro.jsx
        ├── AdminPanel.jsx
        ├── Countdown.jsx
        ├── Gallery.jsx
        ├── GiftSection.jsx
        ├── MusicButton.jsx
        └── RSVPForm.jsx
```

## Quick customize tips

- To change defaults in source, edit `src/data/defaultWedding.js`.
- Tailwind CSS is configured through `@tailwindcss/vite`; the page also uses `src/index.css` for its custom Khmer wedding design system and responsive rules.
- To reset locally saved demo data, open browser DevTools → Application/Storage → Local Storage and delete `khmer-prewedding-settings-v1` and `khmer-prewedding-rsvps-v1`.

## អេក្រង់បើកស្រោមសំបុត្រមុនចូល Website

នៅពេលភ្ញៀវបើក Website នឹងឃើញស្រោមសំបុត្រអញ្ជើញបែបខ្មែរ ជាមួយឈ្មោះគូស្នេហ៍ និងថ្ងៃមង្គលការ។ ចុចប៊ូតុង **ចុចបើកស្រោមសំបុត្រ** ដើម្បីឱ្យស្រោមបើកជាមួយ animation ហើយចូលទៅទំព័រ Website ពេញលេញ។ វាដំណើរការលើទូរស័ព្ទ និងកុំព្យូទ័រ។ ព័ត៌មានឈ្មោះនិងថ្ងៃនៅលើស្រោមនឹងយកពី Wedding Settings ក្នុង Admin ដោយស្វ័យប្រវត្តិ។


## កម្មវិធីមង្គលការ ២ ថ្ងៃ

ទំព័រអញ្ជើញមានអេក្រង់បើកស្រោមសំបុត្រមុនចូល Website និងផ្នែកកម្មវិធីមង្គលការពីរថ្ងៃ៖ ថ្ងៃពុធ ទី១៨ និងថ្ងៃព្រហស្បតិ៍ ទី១៩ ខែវិច្ឆិកា ឆ្នាំ២០២៦។ ម៉ោង និងឈ្មោះពិធីត្រូវបានកំណត់ក្នុង `src/data/defaultWedding.js`។

## Khmer decorative artwork credit

The enhanced invitation uses decorative SVG artwork and paper textures from the **Khmer E-Invitation Starter Kit by Someth Phay (somethphay.me)**. The starter kit's README asks users to retain the credit; this attribution is kept here. A small repeating kbach-inspired SVG divider pattern was added for this website.

## Upload gallery photos in Admin
1. Open Admin Dashboard and sign in with the demo password `admin123`.
2. Under **Wedding details → Gallery photos**, click **Upload photos**.
3. Select one or more JPG, PNG, or WebP images. Images are resized/compressed in your browser.
4. Add labels if desired, then click **Save**. Remove unwanted photos with the trash icon.
5. You can still use **Add photo URL** for public image URLs.

Note: Gallery photos are stored in this browser's local storage in this demo. Upload a few optimized images at a time; browser storage is limited and data is not synchronized to other devices. For a public site with many photos, connect a backend and image storage service.

## Hero photo, Moul typeface, and Memories refresh
- The supplied portrait `public/images/couple-hero.jpg` is used as the default home/hero background and is also included as the first item in **អនុស្សាវរីយ៍របស់យើង (Our Memories)**.
- The hero title is left-aligned over a dark gradient, leaving the couple visible on the right. On small screens the background crop and text sizing adjust responsively.
- In Admin Dashboard → **ព័ត៌មាន (Wedding details)**, use **Hero photo · រូបថតផ្ទៃខាងក្រោយ** to upload a different image, preview it, or restore the supplied portrait. Press **Save** to apply it in this browser.
- Khmer display headings use the **Moul** Google Font. Body copy continues to use Kantumruy Pro/Battambang for readability. The font loads from Google Fonts, so internet access is required.
- The Memories gallery now uses a decorative masonry-style layout with cream paper texture, fine gold frames, and a more consistent hover/lightbox treatment.

## Updated luxury Khmer Kbach artwork

The latest design adds ornament assets derived from the supplied deep-green and gold Khmer artwork. The original green background is keyed transparent so only the gold frame and carvings overlay the wedding photography. The art is used for the desktop hero frame, mobile corner ornaments, envelope emblem, paper/letter ornament, and decorative section divider. The page title and Khmer display headings load the Google Font **Moul**; the remaining body copy keeps the more readable Kantumruy Pro/Battambang fonts.

New assets in `public/elements/` include `kbach-frame-overlay.png`, `kbach-corner-flourish.png`, `kbach-angkor-emblem.png`, `kbach-lotus-crown.png`, `kbach-lotus-divider.png`, and `kbach-butterfly.png`.
=======
# khmer-prewedding-so-danuth-vannara
>>>>>>> origin/main
