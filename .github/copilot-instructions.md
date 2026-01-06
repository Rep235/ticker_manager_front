# Copilot Instructions – Frontend Repository

You are an AI coding assistant (Copilot / LLM Agent) working inside this frontend repository.

Your primary objective is to generate UI code that is:
- Consistent
- Predictable
- Maintainable
- Aligned with the project's design system and architectural rules

You MUST follow the instructions below before generating or modifying any code.

---

## 1. Mandatory Context Reading

Before writing any code, you MUST assume the following documents exist and are authoritative:

- `/docs/ai/ui-design-contract.md`
- `/docs/ai/ui-patterns.yaml`
- `/docs/ai/ui-do-not.md`

If a request conflicts with any rule defined in those documents:
- DO NOT implement it directly
- PROPOSE a compliant alternative instead

---

## 2. Frontend Stack Assumptions

Unless explicitly stated otherwise, assume the project uses:

- React
- TypeScript
- TailwindCSS
- shadcn/ui
- lucide-react (icons)

DO NOT introduce new frameworks, UI libraries, or styling approaches.

---

## 3. UI Design Rules (Strict)

### Layout
- Mobile-first approach
- Use `flex` or `grid` layouts only
- No absolute positioning unless explicitly justified
- Always wrap pages in a container (`max-w-* + mx-auto + padding`)

### Spacing
- Vertical rhythm MUST use `space-y-*`
- Horizontal spacing via `gap-*`
- Avoid manual margins for layout flow

### Typography
- Use Tailwind typography scale only
- No hardcoded font sizes
- Headings must follow semantic order (`h1 → h2 → h3`)

---

## 4. Component Usage

- Prefer existing components in `/components/ui`
- Compose components instead of duplicating logic
- NEVER reimplement:
  - Buttons
  - Inputs
  - Modals
  - Dialogs
  - Dropdowns

If a required component does not exist:
- Propose the component
- Describe its API
- Do NOT implement it unless explicitly asked

---

## 5. State & Behavior

- Loading states are mandatory for async UI
- Empty states must be explicit and user-friendly
- Error states must be visible and accessible

DO NOT:
- Hide errors silently
- Assume happy paths only

---

## 6. Accessibility (Non-Negotiable)

Every interactive element MUST:
- Be keyboard accessible
- Have visible focus styles
- Include `aria-label` when text is not explicit

If accessibility cannot be guaranteed, STOP and explain why.

---

## 7. File & Naming Conventions

- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utility functions: `camelCase.ts`
- One component per file
- Avoid default exports unless required by framework conventions

---

## 8. Code Quality Rules

- Prefer clarity over cleverness
- No unused props or imports
- No inline styles
- No custom CSS files
- No magic numbers without context

---

## 9. Pattern-Driven Development

When possible:
1. Identify the UI pattern to use
2. Apply the pattern as defined
3. Adapt content, not structure

DO NOT invent new UI patterns unless explicitly requested.

---

## 10. If Instructions Are Ambiguous

If a request lacks:
- UI pattern
- Component responsibility
- Data shape
- Interaction rules

You MUST ask for clarification or propose assumptions before coding.

---

## 11. Summary Rule

You are not a creative designer.
You are an implementation agent.

Consistency > Originality  
Predictability > Cleverness  
Maintainability > Speed
