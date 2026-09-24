# CureCraft: Precision Meat Curing & Charcuterie Math Engine

[![Technical SEO Audit](https://img.shields.io/badge/SEO%20Audit-81%2F81%20Passed-brightgreen)](tests/site-audit.js)
[![Formula Audit](https://img.shields.io/badge/Formula%20Audit-38%2F38%20Passed-brightgreen)](tests/formulas.test.js)
[![Live Production](https://img.shields.io/badge/Live%20Production-GitHub%20Pages-blue)](https://mohd34.github.io/curecraft/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

**CureCraft** (`https://mohd34.github.io/curecraft/`) is an autonomous, open-access mathematical utility and food-safety engine engineered for artisan charcuterie, home bacon curing, and USDA FSIS regulatory compliance.

---

## 🎯 The Core Problem Solved

1. **Dead Heritage Tools:** The historic #1 equilibrium curing calculator (`diggingdogfarms.com`) has gone offline, leaving thousands of curing hobbyists without a reliable tool.
2. **The 93.75% Salt Trap:** Prague Powder #1 consists of 93.75% common table salt. Competing calculators fail to deduct this salt, resulting in over-salted, unpalatable meats. CureCraft automatically performs exact algebraic deduction.
3. **The Trans-Atlantic Nitrite Hazard:** US recipes use Prague Powder #1 (6.25% NaNO₂), European recipes use Peklosol (0.6% NaNO₂), and Australian recipes use Quick Cure (5.0% NaNO₂). CureCraft provides instant cross-standard conversions to prevent dangerous under-curing or toxic overdoses.
4. **Ad-Free, Mobile-First PWA:** Loads in <0.35s, works 100% offline via Service Worker, and has zero invasive ads.

---

## 🛠️ Built-In Calculation Utilities

| Tool | Route | Key Capabilities |
|---|---|---|
| **Universal Equilibrium Dry Cure** | `index.html` | Computes exact pure salt, Cure #1 / Cure #2, sugar, and USDA Nitrite PPM with automatic salt offset deduction. |
| **Equilibrium Wet Brine** | `wet-brine-calculator.html` | Total system mass math (Meat + Water) for hams, corned beef briskets, pastrami, and poultry. |
| **Drying & Weight Loss Tracker** | `charcuterie-drying-calculator.html` | Tracks moisture loss from green weight to target 35%–40% loss; models water activity ($a_w \le 0.88$). |
| **Curing Time Estimator** | `curing-time-calculator.html` | Fick's Second Law diffusion physics calculating minimum days based on cut thickness and geometry. |
| **International Nitrite Converter** | `nitrite-converter.html` | Converts between US 6.25%, EU 0.60%, and AU 5.00% curing salts with food safety warnings. |
| **Biltong Spice & Yield Scaler** | `biltong-calculator.html` | Traditional South African vinegar dip, toasted coriander, pepper, and dried yield prediction. |
| **Live SEO Telemetry Hub** | `seo-dashboard.html` | Empirical Search Console tracking, 32 keywords, and scientific A/B experiment logs. |

---

## 🔬 Mathematical & Food Safety Formulas

- **USDA Nitrite PPM:**
  $$\text{PPM} = \frac{\text{Weight of Cure \#1 (g)} \times 0.0625}{\text{Total Meat Weight (g)}} \times 1,000,000$$
- **Salt Offset Deduction:**
  $$\text{Pure Salt to Add (g)} = \left(\text{Meat Weight} \times \frac{\text{Target Salt \%}}{100}\right) - (\text{Cure \#1 Weight} \times 0.9375)$$
- **Target Finished Weight:**
  $$W_{\text{target}} = W_{\text{green}} \times \left(1 - \frac{\text{Target Loss \%}}{100}\right)$$
- **Fick's Diffusion Penetration Velocity:**
  $$\text{Minimum Days} = \frac{\text{Thickness (mm)}}{2 \times 6.35} + 2 \text{ Buffer Days}$$

---

## 🧪 Automated Test Verification

Run the comprehensive test suites locally:

```bash
# Verify all 38 mathematical formula assertions
node tests/formulas.test.js

# Verify technical SEO, schemas, and sitemap integrity (81 checks)
node tests/site-audit.js
```

---

## 📄 Documentation Links

- [Opportunity & 20-Niche Matrix Report (`SEO_CHALLENGE.md`)](SEO_CHALLENGE.md)
- [Keyword Database (`KEYWORD_DATABASE.md`)](KEYWORD_DATABASE.md)
- [Day 0 SEO Baseline Report (`SEO_BASELINE.md`)](SEO_BASELINE.md)
- [Controlled SEO Experiments (`SEO_EXPERIMENTS.md`)](SEO_EXPERIMENTS.md)
- [Week 0 SEO Report (`WEEKLY_SEO_REPORT.md`)](WEEKLY_SEO_REPORT.md)
- [Monetization Strategy (`MONETIZATION_PLAN.md`)](MONETIZATION_PLAN.md)
- [Project Roadmap (`ROADMAP.md`)](ROADMAP.md)
- [Changelog (`CHANGELOG.md`)](CHANGELOG.md)
