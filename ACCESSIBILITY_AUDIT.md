# Accessibility Status — California Latino Climate & Health Dashboard

**Last reviewed:** July 2026
**Standard:** WCAG 2.1 A/AA
---

## Where things stand

The site is in good shape for keyboard and screen-reader users. An automated axe-core scan (WCAG 2.1 A/AA rules) of all 23 routes in July 2026 found zero violations after fixing three issues: an unlabeled mobile back button, prohibited `aria-label`s on the FAQ anchor targets, and low-contrast category pill colors on Our Data. A 320px reflow check (equivalent to 400% zoom) and a text-spacing override check also passed on every route. What remains is a handful of smaller items (reduced motion, a color-only cue on the map), the manual screen-reader pass, and two bigger pieces: the PDF fact sheets (now confirmed non-conformant, see below) and replacing placeholder demographic data.

## Accessibility features on this site

- ✅ **Full keyboard access.** Every link, button, filter, and map control is reachable and operable with Tab/Enter/Space/Escape alone — no mouse-only interactions anywhere on the site.
- ✅ **Visible focus indicator.** A 2px blue focus ring appears on the active element when navigating by keyboard, and stays hidden for mouse clicks so it doesn't clutter the visual design.
- ✅ **Skip-to-content link.** The first stop for keyboard users on every page is a link that jumps straight past the header/nav to the main content.
- ✅ **Accessible interactive map.** Each of the 58 counties on the California map is individually tabbable, announced by name plus whether it has a fact sheet available, and opens its info tooltip with Enter/Space and closes with Escape. Anyone who'd rather not use the map gets the same county-by-county data in a searchable list on the Our Data page.
- ✅ **Labeled forms.** All search and filter inputs have real `<label>` associations for screen readers, not placeholder text standing in for a label.
- ✅ **Alt text on every image.** Content images describe what they show; purely decorative graphics (chevrons, dividers, background icons) are marked `aria-hidden` so screen readers skip them instead of reading noise.
- ✅ **Live region announcements.** The loading overlay uses a polite ARIA live region, so screen reader users are told content is loading instead of hitting silence.
- ✅ **Semantic structure.** One `<html lang="en">` declaration, real `<button>`/`<a>` elements (not clickable `<div>`s) for every control, and a `<head>` that declares the page language for assistive tech and translation tools.
- ✅ **Color contrast on interactive elements.** An axe-core scan (WCAG 2.1 A/AA ruleset) across all 23 routes, done July 2026, confirms every button, pill, and link meets the 4.5:1 text-contrast minimum — including the footer, which measures 11.85:1 (comfortably past even the stricter AAA bar of 7:1).
- ✅ **Reflow and text resizing.** All 23 routes were checked at a 320px viewport (equivalent to 400% browser zoom) and with expanded line-height/letter-spacing/word-spacing (WCAG 1.4.10/1.4.12) — no content is clipped or requires horizontal scrolling.
- ⚠️ **English only, by design.** The site declares its language correctly for a single-language site. If Spanish content is added later, it should ship with a language toggle and a dynamic `<html lang>` attribute rather than a second static declaration.

These checks cover what automated tooling and code inspection can confirm. They are not a substitute for the manual screen-reader pass below, which tests things a scanner can't, like whether the reading order actually makes sense out loud.

## What still needs work

**Reduced motion (low priority).** The loading spinner and scroll animations don't respect the `prefers-reduced-motion` setting. Wrapping them in a media query is a small fix.

**Heading order (low priority, verify).** Each page should have exactly one `<h1>` with no skipped heading levels — worth a quick check per route.

**Manual screen-reader pass (outstanding).** A keyboard-only pass with NVDA (Windows) and VoiceOver (macOS) has not been done and cannot be automated. Automated checks confirm focus order, labels, and ARIA usage, but real screen-reader testing is still needed before any conformance claim.

**Contrast over images (verify).** axe could not conclusively judge text over image/gradient backgrounds on about half the routes ("incomplete" results) — these need a quick visual check.



---

*Standards referenced: WCAG 2.1 A/AA; Section 508; ADA Title II web rule (2024); California Gov. Code §7405, §11135;*
