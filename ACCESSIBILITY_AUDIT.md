# Accessibility Status — California Latino Climate & Health Dashboard

**Last reviewed:** July 2026
**Standard:** WCAG 2.1 A/AA
---

## Where things stand

The site is in good shape for keyboard and screen-reader users. An automated axe-core scan (WCAG 2.1 A/AA rules) of all 23 routes in July 2026 found zero violations after fixing three issues: an unlabeled mobile back button, prohibited `aria-label`s on the FAQ anchor targets, and low-contrast category pill colors on Our Data. A 320px reflow check (equivalent to 400% zoom) and a text-spacing override check also passed on every route. What remains is a handful of smaller items (reduced motion, a color-only cue on the map), the manual screen-reader pass, and two bigger pieces: the PDF fact sheets (now confirmed non-conformant, see below) and replacing placeholder demographic data.

## What works today

- **Keyboard navigation.** Every interactive element shows a visible focus outline when tabbing (a 2px blue ring, keyboard-only so mouse clicks stay clean). A "Skip to main content" link is the first thing keyboard users reach on every page.
- **The county map.** Each county on the map can be reached with Tab, is announced by name along with its fact-sheet availability, and opens its tooltip with Enter or Space (Escape closes it). The searchable county list on the Our Data page shows the same information for anyone who prefers not to use the map.
- **Forms and search.** All search and filter inputs have proper labels for screen readers, not just placeholder text.
- **Images.** All images have alt text. Decorative icons (chevrons, dividers) are hidden from screen readers so they don't add noise.
- **Structure.** The page declares its language, uses semantic headings, and uses real `<button>` and `<a>` elements for interactive controls. The loading overlay announces itself politely to screen readers.
- **Language.** The site is English-only and declares itself as such. If Spanish translation is added later, it should ship with a language toggle and a dynamic `<html lang>` attribute.

## What still needs work

**Reduced motion (low priority).** The loading spinner and scroll animations don't respect the `prefers-reduced-motion` setting. Wrapping them in a media query is a small fix.

**Heading order (low priority, verify).** Each page should have exactly one `<h1>` with no skipped heading levels — worth a quick check per route.

**PDF fact sheets (separate effort, confirmed failing).** All 50 fact sheets under `/factsheets/` were checked in July 2026: none are tagged, none declare a document language, and titles are empty — they do not meet PDF/UA or WCAG. They are generated with wkhtmltopdf, which cannot produce tagged PDFs, so fixing this means changing the generation pipeline (e.g., headless Chrome print-to-PDF, Prince, or a remediation pass), not tweaking the current one.

**Manual screen-reader pass (outstanding).** A keyboard-only pass with NVDA (Windows) and VoiceOver (macOS) has not been done and cannot be automated. Automated checks confirm focus order, labels, and ARIA usage, but real screen-reader testing is still needed before any conformance claim.

**Contrast over images (verify).** axe could not conclusively judge text over image/gradient backgrounds on about half the routes ("incomplete" results) — these need a quick visual check.



---

*Standards referenced: WCAG 2.1 A/AA; Section 508; ADA Title II web rule (2024); California Gov. Code §7405, §11135; PDF/UA (ISO 14289) for the fact sheets.*
