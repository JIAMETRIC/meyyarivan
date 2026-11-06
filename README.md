# MEYYARIVAN.COM — Website

Static, dependency-free website for **MEYYARIVAN — Intelligence. Privacy. Innovation.**
Plain HTML/CSS/JS: no build step, deploys to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3 + CloudFront, cPanel).

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage: hero, principles, solutions, privacy, approach, about, contact |
| `privacy.html`, `terms.html` | Legal pages — **draft templates, must be legally reviewed** |
| `assets/css/styles.css` | Design system and all page styles |
| `assets/js/main.js` | Mobile menu, scroll reveal, active nav, enquiry form validation/submission |
| `assets/img/logo-full.jpg` | Client-supplied logo (copy of `logo.jpeg`) — About section + social share image |
| `assets/img/logo-wordmark.png` | Wordmark cropped from the logo, navy background removed for header/footer |
| `favicon.png`, `apple-touch-icon.png`, `site.webmanifest` | Icons |
| `sitemap.xml`, `robots.txt` | SEO |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Before launch (checklist)

- [ ] **Enquiry form (Formspree)** — create a form at formspree.io (verify the receiving email), then paste its endpoint into the `action` of `<form id="enquiry-form">` in `index.html`, e.g. `action="https://formspree.io/f/abcdwxyz"`. In Formspree settings, restrict the form to the `meyyarivan.com` domain. Fields sent: `name`, `email` (used as reply-to), `company`, `interest`, `message`, `consent`, `_subject`; `_gotcha` is the spam honeypot.
- [ ] **Legal pages** — complete all `[PLACEHOLDERS]` and have both pages reviewed for the actual entity, jurisdiction and data practices.
- [x] **Footer** — entity name MEYYARIVAN and © 2026 confirmed.
- [ ] **Domain** — `https://meyyarivan.com/` is used in canonical, Open Graph, sitemap and robots. Change everywhere if the final domain uses `www.`.
- [ ] **Services** — confirm each listed service is actually offered before publishing.
- [ ] **Analytics** — none installed. Add only after the provider and privacy approach are approved, and update the Privacy Policy.
- [x] **Logo** — header/footer cut-out approved by the client.
- [ ] DNS, HTTPS/SSL, backups and deployment access confirmed.

## Design tokens

Defined in `:root` in `styles.css`: background `#050814` / `#0A1024`, text `#EEF2FF`, accent cyan `#3EE6FF`, blue `#3B82F6`. Fonts: Inter Tight (headings), Inter (body) via Google Fonts.
