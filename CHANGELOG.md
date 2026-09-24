# CureCraft Changelog

All notable changes to the CureCraft precision charcuterie engine are documented here.

---

## [1.0.0] - 2026-09-24 — Initial Production Launch

### Added
- **Core Calculation Engine (`assets/js/calculators.js`):**
  - Universal Equilibrium Dry Cure with automatic Prague Powder salt offset deduction and USDA Nitrite PPM compliance badge.
  - Equilibrium Wet Brine immersion calculator based on total system weight (Meat + Water).
  - Charcuterie Drying & Weight Loss Tracker with estimated water activity ($a_w$) curve.
  - Fick's Law Cure Penetration & Thickness Time Estimator.
  - International Curing Salt & Nitrite PPM Safety Converter (US 6.25% vs EU 0.6% vs AU 5.0%).
  - South African Biltong & Jerky Yield Scaler with authentic spiced vinegar dip ratio.
- **Design System & Interface (`assets/css/style.css`, `assets/js/app.js`):**
  - Bespoke artisan smoke & salt palette with dark/light mode support.
  - Responsive grid layouts, range sliders, quick-fill preset chips, formula copier, and print stylesheets.
  - Custom SVG butcher cleaver favicon (`assets/img/favicon.svg`).
- **Comprehensive Educational Guides:**
  - `guides/equilibrium-curing-guide.html` (The Science of Equilibrium Curing vs Salt Box).
  - `guides/prague-powder-guide.html` (Prague Powder #1 vs #2 Science, Nitrite PPM & Safety).
  - `guides/charcuterie-weight-loss-guide.html` (Moisture Loss, Water Activity & Case Hardening).
- **SEO & Compliance:**
  - `sitemap.xml` listing 12 production URLs.
  - `robots.txt` directing crawlers to the sitemap.
  - `site.webmanifest` and `sw.js` for full offline PWA capability.
  - `.nojekyll` for GitHub Pages static asset routing.
  - JSON-LD structured data (`WebApplication`, `HowTo`, `FAQPage`, `Article`).
  - `legal/privacy.html` and `legal/terms.html`.
  - `404.html` custom error page.
- **Testing & Verification Suites:**
  - `tests/formulas.test.js`: 38/38 mathematical formula assertions passed (100%).
  - `tests/site-audit.js`: 81/81 technical SEO and structural checks passed (100%).
- **Documentation Suite:**
  - `SEO_CHALLENGE.md` (20-Niche Matrix & SERP Validation).
  - `KEYWORD_DATABASE.md` & `data/keywords.json` (32 tracked search queries).
  - `SEO_BASELINE.md` (Day 0 Pre-Index Baseline Zero).
  - `SEO_EXPERIMENTS.md` (4 controlled SEO experiments).
  - `WEEKLY_SEO_REPORT.md` (Week 0 Baseline Report).
  - `MONETIZATION_PLAN.md` (Four-pillar non-intrusive commercial strategy).
  - `README.md` and `ROADMAP.md`.
