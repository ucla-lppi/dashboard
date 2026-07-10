# Accessibility Audit — California Latino Climate & Health Dashboard (UCLA LPPI)

**Application:** LPPI Dashboard (`lppi-dashboard`) — Next.js static export
**Repository:** `dashboard`
**Audit date:** 2026-06-26
**Standard assessed against:** WCAG 2.1 Levels A & AA (the level referenced by Section 508, ADA Title II, and California Gov. Code §7405 / §11135)
**Audit type:** Internal expert/code-based review (manual source inspection + heuristic evaluation). **This is not a formal third-party VPAT/ACR and has not been validated with full assistive-technology user testing.** See *Limitations* below.

---

## 1. Executive summary

The dashboard demonstrates several good baseline practices (a declared page language, alt attributes on all images, semantic headings, some ARIA usage, and an accessible loading status region). It previously did not meet WCAG 2.1 Level AA, primarily because of:

1. **Visible keyboard focus is suppressed site-wide** (`focus:outline-none` with no replacement) — a Level AA failure that affects every keyboard and switch-device user. ✅ **Remediated** — see §4.1.
2. **The interactive map is not keyboard accessible** — a Level A failure. ✅ **Remediated** — see §4.2.
3. **Form/search inputs rely on placeholder text instead of programmatic labels** — Level A failures. ✅ **Remediated** — see §4.3.
4. **A Spanish-language toggle is exposed but translation is not actually implemented, and the page language is never updated** — Level A failures and a potential misrepresentation risk. ✅ **Remediated** (toggle removed) — see §4.4.
5. **No "skip to content" bypass mechanism.** ✅ **Remediated** — see §4.5.

There is also a **non-accessibility data-integrity issue with legal exposure**: the Latino/White population percentages and the heat/pollution severity levels used elsewhere in the app are **randomly generated placeholder values**, not real data (see §6). This is unrelated to the map's fill color, which only ever indicates fact-sheet availability (see corrected §4.8).

**Overall current conformance claim:** With the High-severity items in §4 remediated, the dashboard is substantially closer to WCAG 2.1 AA conformance. The remaining Medium/Low items (§4.7–4.10) and the out-of-scope items (§5, §6) should still be addressed, and automated/AT validation (§7) performed, before making any formal "conformant" or "508-compliant" representation to outside parties.

---

## 2. Scope & methodology

**In scope (this repository / the web application):**
- React/Next.js components under `src/app/`
- Global layout, fonts, and color tokens
- The interactive California county map (D3 SVG + MapLibre components)
- Search/filter inputs, FAQ accordions, navigation, footer
- Localization (English/Spanish) plumbing

**Out of scope (flagged, not assessed in detail):**
- **PDF factsheets** served from `/factsheets/` — these are the project's primary substantive content and **must be separately audited for PDF accessibility (tagged structure, reading order, alt text); see §5.**
- The published Google Sheets data source.
- Third-party embeds (YouTube, social) beyond their link markup.

**Method:** Static source inspection of JSX/CSS, ARIA/role/alt inventory, focus-management review, color-token contrast estimation, and keyboard-operability reasoning. Automated DOM scans (axe-core/Lighthouse) and screen-reader sessions (NVDA/VoiceOver) are recommended as follow-up (§7).

---

## 3. What the site does well (current strengths)

| Area | Finding | Relevant SC |
|---|---|---|
| Page language | `<html lang="en">` is declared in `src/app/layout.js`. | 3.1.1 (A) |
| Images | All **80** `<img>` elements carry an `alt` attribute. | 1.1.1 (A) |
| Headings | Semantic `<h1>`–`<h4>`/`<h6>` are used for structure. | 1.3.1 (A) |
| ARIA | Meaningful use of `aria-label` (9), `aria-hidden` (13), `aria-expanded` (2), `aria-controls` (1), `aria-live` (1). | 4.1.2 (A) |
| Loading state | Loading overlay uses `role="status"` + `aria-live="polite"` (`src/app/loading.js`). | 4.1.3 (AA) |
| Interactive semantics | Interactive controls are real `<button>`/`<a>` elements; no click-handlers were found on bare `<div>`/`<span>`. | 4.1.2 (A) |
| Links | External links use `rel="noopener noreferrer"` and carry an "external link" affordance. | — |

---

## 4. Findings requiring remediation

Severity key: **High** = blocks access for a user group / Level A or core AA failure · **Medium** = significant barrier · **Low** = polish / robustness.

### 4.1 Visible focus indicator removed site-wide — **High** — ✅ Remediated
- **WCAG:** 2.4.7 Focus Visible (AA); related 2.4.11 Focus Appearance (2.2, AA).
- **Evidence (prior state):** `focus:outline-none` was applied to links, buttons, search inputs, and the FAQ accordion toggles **without any replacement focus style** — e.g. `src/app/components/CaliforniaMap.js:38,42,51,55`, `src/app/components/SubcategoryPage.js:130,164`, `src/app/components/FAQsFromCSV.js:141`, `src/app/components/CaliforniaCountyProfiles.js:111,222`, `src/app/our-data/page.js:248`.
- **Impact:** Keyboard, switch, and low-vision users could not tell where focus is. This is one of the most common ADA web-complaint triggers.
- **Fix applied:** Every `focus:outline-none` instance is now paired with a minimal, keyboard-only ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005587]` (mouse clicks stay ring-free; keyboard/switch focus gets a visible 2px outline). A global `:focus-visible` fallback style was also added to the Tailwind base layer in `src/app/styles/globals.css` so any interactive element without an explicit utility still gets a visible ring.

### 4.2 Interactive map is not keyboard accessible — **High** — ✅ Remediated
- **WCAG:** 2.1.1 Keyboard (A), 4.1.2 Name/Role/Value (A), 1.4.13 Content on Hover/Focus (AA).
- **Evidence (prior state):** `src/app/components/CaliforniaMap.js` renders an SVG map. County paths responded only to mouse `mouseover`/`click`; there was no `tabindex`, no key handlers, and no `role`/accessible name on the regions.
- **Non-map data path:** The searchable county list/table (`CaliforniaCountyProfiles.js`, `our-data/page.js`) already renders the **same fact-sheet data as the map** (every county, both factsheet types, as real links) and is fully keyboard/screen-reader accessible, so a separate non-map equivalent was not needed — this closes the 1.1.1 Non-text Content concern raised in the original finding.
- **Fix applied to the map itself:** Each county `<path>` is now focusable (`tabindex="0"`) with `role="button"` and an `aria-label` announcing the county name and fact-sheet availability. Tab/Shift+Tab moves between counties; focusing a county shows the same tooltip as hovering; Enter/Space moves focus into the tooltip's fact-sheet links; Escape dismisses the tooltip. The map's own focus ring is covered by the global `:focus-visible` style from §4.1.

### 4.3 Search/filter inputs have no programmatic label — **High** — ✅ Remediated
- **WCAG:** 1.3.1 Info & Relationships (A), 3.3.2 Labels or Instructions (A), 4.1.2 (A).
- **Evidence (prior state):** Inputs used a `placeholder` only, no `<label>` or `aria-label` — e.g. `src/app/components/CaliforniaCountyProfiles.js:106-112`, `src/app/components/SubcategoryPage.js:125-131,159`, `src/app/components/ResearchSection.js:253`, `src/app/our-data/page.js:216,238`.
- **Impact:** Screen readers announced an unlabeled edit field; the placeholder also vanishes once typing begins (no persistent instruction).
- **Fix applied:** Added an `aria-label` matching each field's purpose (e.g. `aria-label="Search for a location"`, `aria-label="Search for title, tag, or keyword"`) to every affected input, while keeping the visible `placeholder` as a hint.

### 4.4 Spanish toggle exposed but not implemented; page language not updated — **High** — ✅ Remediated (option a)
- **WCAG:** 3.1.1 Language of Page (A), 3.1.2 Language of Parts (A); also a **content-accuracy concern**.
- **Evidence (prior state):** `LocaleToggleButton.js` + `context/LocaleContext.js` flipped a locale, but the only translated string was a demo "Hello"/"Hola" (`src/app/pages/index.js:19`); site content did not translate. `<html lang>` is hardcoded `"en"` in `layout.js` and was never updated to `"es"` when toggled.
- **Impact:** A user selecting Spanish got an English page still announced as English — a public-facing accuracy risk for an equity-focused product.
- **Fix applied:** Option (a) — the toggle is removed. `LocaleToggleButton.js` and `context/LocaleContext.js` were deleted (they had no other usages), and the import/usage was removed from `src/app/pages/index.js`. Revisit with option (b) — full translation plus dynamic `<html lang>` — if/when real localization is implemented.

### 4.5 No "skip to main content" bypass — **Medium** — ✅ Remediated
- **WCAG:** 2.4.1 Bypass Blocks (A).
- **Evidence (prior state):** No skip link found in `layout.js`/`ClientShell.js`; navigation/sidebar precede main content on every page.
- **Fix applied:** Added a visually-hidden-until-focused "Skip to main content" link as the first focusable element in `src/app/ClientShell.js`, targeting a `#main-content` landmark (the content wrapper that every route renders into, given `tabIndex={-1}` so the skip target is programmatically focusable).

### 4.6 Decorative images announced; some non-descriptive alt — **Medium** — ✅ Remediated (live routes)
- **WCAG:** 1.1.1 Non-text Content (A).
- **Evidence (prior state):** Several alts were non-informative, redundant with adjacent visible text, or ambiguous: `"Toggle"`/`"Sort"` (chevron icons next to a visible "Category"/"Oldest"/"Newest" label), `"Divider"` (decorative footer separator), and `"X"` (ambiguous — reads as the letter "X" rather than the social platform).
- **Fix applied:** The `"Toggle"`/`"Sort"` chevron icons (`our-data/page.js`, `SubcategoryPage.js`) and the footer `"Divider"` image (`Footer.js`) are now `alt="" aria-hidden="true"` since adjacent visible text/labels already convey their purpose. The footer social icon is now `alt="X (formerly Twitter)"`. `"Group"`/`"Line"`/`"X"` alts in `src/app/page_old.js` were left as-is — that file is dead/unreachable code (not a valid Next.js App Router route) and out of scope for a live-site fix.

### 4.7 Color contrast needs verification (some likely failures) — **Medium**
- **WCAG:** 1.4.3 Contrast (Minimum) (AA), 1.4.11 Non-text Contrast (AA).
- **Estimated against white backgrounds (verify with tooling):**
  - `#005587` deep blue text/buttons — ~7:1, **passes**.
  - `#1B3F60` navy text — high contrast, **passes**.
  - `#2774AE` UCLA Blue — ~4.5:1, **borderline** for normal-size text; confirm.
  - `#FFD100` UCLA Gold — ~1.4:1 on white, **fails** for text; use only as a fill/large-graphic with a darker label.
  - Placeholder text at reduced opacity (`placeholder-[#1B3F60]/60`, `/80`) and `placeholder-gray-500` — **likely below 4.5:1**; verify and darken.
- **Fix:** Run automated contrast checks across themes; never place body text in gold; raise placeholder contrast.

### 4.8 Color as the sole indicator (fact-sheet availability on the map) — **Medium**
- **WCAG:** 1.4.1 Use of Color (A).
- **Correction:** The original wording referenced map "severity" — the map has no severity indicator. Its counties are only ever green (has fact sheets) or gray (no fact sheets); the randomly-generated heat/pollution/demographic values noted in §6 are not rendered on the map itself.
- **Evidence:** Fact-sheet availability is conveyed solely by green vs. gray county fill (`CaliforniaMap.js`). A legend exists (`CaliforniaMap.js:281`) explaining the icons for the two fact-sheet types, but it doesn't disambiguate which specific counties have fact sheets — that per-county state is color-only.
- **Fix:** Pair the fill color with a non-color cue on the county itself (e.g. a distinct fill pattern/icon or a border style for counties with fact sheets), or rely on the accessible county list/table (§4.2) as the non-color-dependent way to check availability.

### 4.9 Reduced-motion not honored — **Low**
- **WCAG:** 2.3.3 Animation from Interactions (AAA) / best practice; relates to 2.2.2 (A) if any auto-animation persists.
- **Evidence:** Animated loading spinner (`loading.js`) and horizontal-scroll components; no `prefers-reduced-motion` guard observed.
- **Fix:** Wrap non-essential animation in `@media (prefers-reduced-motion: reduce)`.

### 4.10 Heading order / landmark completeness — **Low (verify)**
- **WCAG:** 1.3.1 (A), 2.4.6 Headings & Labels (AA).
- **Evidence:** Three `<h1>` instances exist across the app; per-page there should be exactly one `<h1>`, and levels should not skip. Confirm each route has a single logical `<h1>` and uses `<main>`/`<nav>`/`<footer>` landmarks.

---

## 5. PDF factsheets (must be separately audited)

The substantive county data lives in PDFs under `/factsheets/...` (linked from the map and county pages). PDF accessibility (tagged structure, logical reading order, table headers, alt text, document language, no scanned-image-only pages) is governed by the same WCAG/PDF-UA expectations. **These were not assessed here and should be audited and remediated before any compliance representation**, since for many users the PDFs *are* the product.

---

## 6. Data integrity note (not a WCAG item, but legally relevant)

The map popups present **"Latino Population %" and "White Population %"** and heat/pollution severity that are **randomly generated placeholder values**, not real data:
- `src/app/utils/indicatorSummary.js:17-18` assigns `latinoPopulation = Math.floor(Math.random() * 100)` and `whitePopulation = 100 - latinoPopulation` per render; `extremeHeat`/`pollutionBurden` are assigned by feature index.
- The county GeoJSON files (`public/data/ca_counties*.geojson`) contain **no demographic attributes** — only county identifiers.

For a public, equity-focused tool, displaying fabricated demographic/risk numbers as if real is a misrepresentation risk. **Either bind these fields to verified source data or remove the values from the UI until real data is wired in.**

---

## 7. Recommended remediation order

| Priority | Item | Effort | Status |
|---|---|---|---|
| P0 | 4.1 Restore visible focus indicators | Low | ✅ Done |
| P0 | 4.3 Label all inputs | Low | ✅ Done |
| P0 | 6. Replace/remove placeholder demographic data | Low–Med | Open |
| P0 | 4.4 Fix language handling / Spanish toggle | Med | ✅ Done (toggle removed) |
| P1 | 4.2 Keyboard-accessible map | Med–High | ✅ Done |
| P1 | 4.5 Skip link + landmarks | Low | ✅ Done |
| P1 | 4.7 Contrast fixes (esp. gold text, placeholders) | Low–Med | Open |
| P2 | 4.6 Decorative alt cleanup | Low | ✅ Done (live routes) |
| P2 | 4.8 Color-plus-indicator | Low | Open |
| P2 | 4.9 Reduced motion | Low | Open |
| P2 | 5. PDF factsheet audit | External | Open |

**Validation before any compliance claim:** run axe-core/Lighthouse on every route, perform NVDA + VoiceOver keyboard-only passes, and test 200% zoom / 400% reflow (1.4.10) and text spacing (1.4.12).

---

## 8. Limitations & disclaimer

This audit is a good-faith internal code review and heuristic evaluation as of the date above. It reflects the source state of the repository, not a deployed-environment scan, and did not include full assistive-technology user testing or a third-party certified VPAT/ACR. Findings should be confirmed with automated tooling and AT testing before representing the site's conformance status to any external party (including legal counsel, regulators, or complainants). Conformance status can change with any content or code update; re-audit after remediation.

---

### Appendix A — Standards referenced
- **WCAG 2.1 A/AA** — W3C Recommendation (basis for most U.S. legal obligations).
- **Section 508 (29 U.S.C. §794d)** — incorporates WCAG 2.0 AA; 2.1 AA recommended.
- **ADA Title II web rule (2024)** — WCAG 2.1 AA for state/public-entity web content.
- **California Gov. Code §7405, §11135; Unruh Civil Rights Act** — state accessibility obligations relevant to a UC/UCLA property.
- **PDF/UA (ISO 14289)** — for the factsheet documents (§5).
