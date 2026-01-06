# UI Anti-Patterns (React + Vite)

The following practices are explicitly forbidden.

---

## React

- Do NOT use class components
- Do NOT manipulate the DOM directly
- Do NOT use `useEffect` for derived state
- Do NOT store UI-only state globally

---

## Styling

- Do NOT use inline styles
- Do NOT create CSS files
- Do NOT hardcode colors or spacing
- Do NOT mix styling systems

---

## Components

- Do NOT fetch data directly inside UI components
- Do NOT create large god-components
- Do NOT duplicate similar components

---

## Layout

- Do NOT rely on margins for vertical rhythm
- Do NOT create layouts without containers
- Do NOT mix layout strategies arbitrarily

---

## Behavior

- Do NOT omit loading states
- Do NOT hide errors
- Do NOT assume synchronous behavior

If a solution violates any rule above, STOP and propose an alternative.

## Visual Anti-Patterns

- Do NOT use high-contrast color palettes
- Do NOT use sharp corners
- Do NOT use heavy shadows
- Do NOT stack multiple borders
- Do NOT use aggressive hover animations
- Do NOT overuse icons

## Licensing Anti-Patterns

- Do NOT suggest proprietary fonts
- Do NOT suggest paid UI kits
- Do NOT use assets with unclear licenses
- Do NOT reference brand-specific design systems
