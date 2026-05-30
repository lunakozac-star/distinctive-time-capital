# Distinctive Time Capital

Premium landing page / microsite for **Distinctive Time Capital** — a private luxury‑watch
capital & buyback service by [Distinctive Time](https://www.distinctivetime.com/).

Dark, cinematic, single‑page site for Rolex / Patek Philippe / Audemars Piguet owners to
**sell outright** or **request a private buyback option**. Intended domain:
**distinctivetime.capital**.

---

## Tech

Plain **static HTML / CSS / JS — no build step, no dependencies.** Open it, host it, done.

```
index.html      # all page markup + SEO meta + JSON-LD structured data
styles.css      # design system (dark luxury palette, Mulish type, responsive hero)
script.js       # mobile nav, FAQ accordion, form validation + mailto fallback
assets/         # hero watch imagery
  hero-daytona-dark.webp   # current hero image (used)
  hero-daytona.webp        # alt crop (unused)
  hero-daytona.png         # alt crop (unused)
```

> The brand typeface is **Mulish** (the Google Fonts release of "Muli", used on
> distinctivetime.com) and is loaded from Google Fonts in `index.html`.

---

## Local preview

It's static, so any static server works. From the project root:

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

(Or just open `index.html` directly in a browser.)

---

## Deploy

No build command and no output directory — **publish the repository root.**

| Host | Setup |
|------|-------|
| **Netlify** | Add new site → import repo → build command: *(none)* · publish dir: `/` |
| **Vercel** | New project → import repo → framework preset: **Other** · root output |
| **Cloudflare Pages** | Connect repo → framework: **None** · build output: `/` |
| **GitHub Pages** | Settings → Pages → deploy from `main` / root |

Every push to `main` auto‑deploys on Netlify/Vercel/Cloudflare.

### Custom domain
Add **distinctivetime.capital** in the host's dashboard and create the DNS record it gives you.
After the domain is live, the canonical URL / Open Graph URLs in `index.html` already point to
`https://distinctivetime.capital/`.

---

## Before launch — TODO

- [ ] **Wire the intake form to a real backend.** It currently validates and falls back to a
      pre‑filled email to `sales@distinctivetime.capital` (no server). Connect a form service
      (Formspree, Web3Forms, Basin) or an API route and replace the mailto handler in
      `script.js`. Note: photo uploads need a tier/endpoint that accepts files.
- [ ] **Add a social share image.** `index.html` has a `TODO` for a 1200×630 `og:image`; add the
      file and restore `twitter:card` to `summary_large_image`.
- [ ] **Privacy Policy / Terms pages.** The footer "Legal" links were removed for now; add real
      pages and re‑link before collecting personal data at scale.
- [ ] **Testimonials** are placeholders — replace with approved client quotes.

---

## Contact

- Email: **sales@distinctivetime.capital**
- Parent brand: [distinctivetime.com](https://www.distinctivetime.com/)

---

## Legal

Distinctive Time Capital is an independent business and is not affiliated with Rolex S.A.,
Patek Philippe, Audemars Piguet, or any other watch brand mentioned; brand names are used for
identification only. Offers and buyback options are subject to review, authentication, approval,
and written agreement.
