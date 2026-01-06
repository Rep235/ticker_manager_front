# UI Design Contract (Vite + React)

This document defines the mandatory UI and architectural rules
for this Vite + React + TypeScript frontend repository.

All AI agents and developers MUST follow these rules.

---

## 1. Application Context

- This is a Vite-powered Single Page Application (SPA)
- Routing is explicit and client-side
- No framework-level abstractions (Next.js, Remix, etc.)
- No server components

Assume a classic React application lifecycle.

---

## 2. Technology Stack

- Vite
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- lucide-react

DO NOT introduce:
- Next.js / Remix / Astro
- CSS-in-JS libraries
- Class-based React components

---

## 3. Component Model

- Functional components only
- Hooks-based logic
- One responsibility per component
- Explicit props typing (no implicit `any`)

Components must be deterministic and side-effect free when possible.

---

## 4. Layout Rules

- Mobile-first design
- Use `flex` or `grid` only
- Avoid absolute positioning
- Pages MUST be wrapped in a container:
  - `max-w-7xl`
  - `mx-auto`
  - `px-4 md:px-6 lg:px-8`

Each route represents a page-level component.

---

## 5. Spacing System

- Vertical spacing: `space-y-*`
- Horizontal spacing: `gap-*`
- Padding for internal spacing
- Margin ONLY for outer separation when unavoidable

No arbitrary spacing values.

---

## 6. Typography Rules

- Use Tailwind typography scale only
- No inline font sizes
- Semantic HTML is mandatory:
  - `h1` per page
  - Proper heading order

Typography communicates hierarchy, not decoration.

---

## 7. State & Side Effects

- Side effects MUST be inside `useEffect`
- Async logic must be isolated (hooks or services)
- UI components must not fetch data directly

Separate:
- UI
- State
- Data access

---

## 8. Responsiveness

- Mobile-first
- Explicit breakpoints required
- No assumptions based on screen size

---

## 9. Accessibility

All interactive UI must:
- Be keyboard accessible
- Have visible focus styles
- Include `aria-label` where text is not explicit

Accessibility is mandatory, not optional.

---

## 10. Forbidden Practices

- Inline styles
- Custom CSS files
- Direct DOM manipulation
- Hardcoded colors
- Uncontrolled side effects

If unsure, stop and propose an alternative.
