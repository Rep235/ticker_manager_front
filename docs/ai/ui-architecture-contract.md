# Architecture Contract – Vite + React + TypeScript

This document defines the mandatory frontend architecture for this repository.

All AI agents and developers MUST follow this contract.
Architecture decisions are not optional.

---

## 1. Application Type

- Single Page Application (SPA)
- Built with Vite
- Client-side routing
- No SSR
- No server components

Assume a classic React rendering and data-fetching lifecycle.

---

## 2. Architectural Principles

- Separation of concerns is mandatory
- UI is NOT business logic
- Business logic is NOT data access
- Data access is NOT UI

Each layer has a single responsibility.

---

## 3. Directory Structure (Mandatory)

The project MUST follow this structure:

src/
├── app/ # App bootstrap and global setup
│ ├── App.tsx
│ ├── router.tsx
│ └── providers.tsx
│
├── pages/ # Route-level components (screens)
│ └── *.tsx
│
├── components/ # Reusable UI components
│ ├── ui/ # Design-system level components
│ └── common/ # Shared composed components
│
├── features/ # Business logic by domain
│ └── <feature>/
│ ├── hooks/
│ ├── services/
│ ├── types.ts
│ └── index.ts
│
├── services/ # API / external integrations
│ └── http/
│
├── hooks/ # Generic reusable hooks
│
├── lib/ # Utilities, helpers, constants
│
├── types/ # Global TypeScript types
│
└── styles/ # Tailwind entry ONLY (no custom CSS)


Deviation from this structure requires explicit justification.

---

## 4. Layer Responsibilities

### `app/`
- Application bootstrap
- Router configuration
- Global providers (theme, query client, etc.)
- No UI logic
- No business logic

---

### `pages/`
- One file per route
- Page composition only
- Pages MAY:
  - Use hooks
  - Compose components
- Pages MUST NOT:
  - Contain business rules
  - Perform API calls directly

A page is a coordinator, not a worker.

---

### `components/`
- Stateless or UI-focused components
- No data fetching
- No domain knowledge
- No side effects

`components/ui`:
- Atomic, design-system level
- Buttons, inputs, cards, dialogs

`components/common`:
- Composed UI blocks
- Still UI-only

---

### `features/`
This is the core of the application.

Each feature represents a business capability.

A feature MAY contain:
- Hooks (state + logic)
- Feature-specific services
- Types
- Validation logic

A feature MUST NOT:
- Export UI components directly to pages
- Know about routing
- Know about other features

Cross-feature communication is forbidden.

---

### `services/`
- API clients
- HTTP logic
- External integrations

Services MUST:
- Be framework-agnostic
- Return typed data
- Contain no UI logic

---

### `hooks/`
- Reusable, generic hooks
- No domain coupling
- No API calls unless explicitly generic

---

### `lib/`
- Utility functions
- Helpers
- Constants

No React imports allowed here.

---

## 5. Dependency Rules (Critical)

Allowed dependency flow:

pages → features → services
pages → components
components → components/ui
features → services
features → lib



Forbidden dependencies:

- components → features
- services → React
- pages → services (direct)
- features → pages
- cross-feature imports

If a dependency violates this graph, STOP.

---

## 6. State Management Rules

- Local UI state: component state
- Feature state: feature hooks
- Global state ONLY if unavoidable

DO NOT:
- Store derived state
- Store UI-only state globally
- Share state between unrelated features

---

## 7. Data Fetching Rules

- Pages do NOT fetch data
- Components do NOT fetch data
- Features own data fetching
- Services perform HTTP only

Async flows must be explicit and traceable.

---

## 8. Error & Loading Strategy

- Every async feature MUST expose:
  - loading state
  - error state
  - data state

UI MUST explicitly render all three states.

---

## 9. TypeScript Rules

- No `any`
- No implicit types for public APIs
- Feature boundaries MUST be typed
- Prefer explicit return types

Types are part of the architecture.

---

## 10. Forbidden Architectural Anti-Patterns

- God components
- Smart UI components
- Pages with business logic
- Cross-feature imports
- Hidden side effects
- Tight coupling to API shapes

If an implementation leads to these, STOP and redesign.

---

## 11. Summary Rule

Architecture is a contract, not a suggestion.

If a request violates this contract:
- DO NOT implement it
- EXPLAIN the violation
- PROPOSE a compliant alternative
