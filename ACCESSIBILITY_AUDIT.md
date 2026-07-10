# Accessibility Status — California Latino Climate & Health Dashboard

**Last reviewed:** June 2026
**Standard:** WCAG 2.1 A/AA (the level referenced by Section 508, ADA Title II, and California Gov. Code §7405/§11135)

This is an internal code review, not a formal third-party audit. It hasn't been validated with screen-reader user testing yet — see [Before making any compliance claim](#before-making-any-compliance-claim).

---

## Where things stand

The site is in good shape for keyboard and screen-reader users. The biggest barriers found in the initial review — no visible keyboard focus, a mouse-only map, unlabeled search fields, and a Spanish toggle that didn't actually translate anything — have all been fixed. What's left is a handful of smaller items (color contrast checks, reduced motion, a color-only cue on the map) plus two bigger pieces that live outside this codebase: auditing the PDF fact sheets and replacing placeholder demographic data.

## What works today

- **Keyboard navigation.** Every interactive element shows a visible focus outline when tabbing (a 2px blue ring, keyboard-only so mouse clicks stay clean). A "Skip to main content" link is the first thing keyboard users reach on every page.
- **The county map.** Each county on the map can be reached with Tab, is announced by name along with its fact-sheet availability, and opens its tooltip with Enter or Space (Escape closes it). The searchable county list on the Our Data page shows the same information for anyone who prefers not to use the map.
- **Forms and search.** All search and filter inputs have proper labels for screen readers, not just placeholder text.
- **Images.** All images have alt text. Decorative icons (chevrons, dividers) are hidden from screen readers so they don't add noise.
- **Structure.** The page declares its language, uses semantic headings, and uses real `<button>` and `<a>` elements for interactive controls. The loading overlay announces itself politely to screen readers.
- **Language toggle.** The Spanish toggle that didn't do anything has been removed. If real translation is added later, it should come back along with a dynamic `<html lang>` attribute.

## What still needs work

**Color contrast (medium priority).** A few colors need checking with a contrast tool:
- UCLA Gold (`#FFD100`) on white fails for text — only use it as a fill or for large graphics with a darker label.
- UCLA Blue (`#2774AE`) is borderline for normal-size text.
- Placeholder text in search fields is shown at reduced opacity and is probably too light.

**Map color cue (medium priority).** Whether a county has fact sheets is shown only by fill color (green vs. gray). The county list is a solid non-color alternative, but ideally the map itself would add a pattern or border difference too.

**Reduced motion (low priority).** The loading spinner and scroll animations don't respect the `prefers-reduced-motion` setting. Wrapping them in a media query is a small fix.

**Heading order (low priority, verify).** Each page should have exactly one `<h1>` with no skipped heading levels — worth a quick check per route.

**PDF fact sheets (separate effort).** The county fact sheets under `/factsheets/` are the core content for many users, and PDF accessibility (tagged structure, reading order, table headers, alt text) hasn't been assessed. This needs its own audit before any compliance claim.

## Data note (not accessibility, but important)

The map popups show Latino/White population percentages and heat/pollution severity that are **randomly generated placeholder values**, not real data (`src/app/utils/indicatorSummary.js`). The county GeoJSON files contain no demographic attributes. For a public equity-focused tool, these should be wired to real source data or removed from the UI until they can be.

## Before making any compliance claim

Run these validation steps first:
- axe-core or Lighthouse scans on every route
- A keyboard-only pass with NVDA and VoiceOver
- 200% zoom and 400% reflow, plus text-spacing checks
- The PDF audit above

Conformance can change with any code or content update, so re-check after significant changes.

---

*Standards referenced: WCAG 2.1 A/AA; Section 508; ADA Title II web rule (2024); California Gov. Code §7405, §11135; PDF/UA (ISO 14289) for the fact sheets.*
