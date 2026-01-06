# Licensing & Open-Use Contract

This repository is intended for commercial use.

ALL resources used in this project MUST be:
- Free for commercial use
- Redistributable
- Non-proprietary

This rule is NON-NEGOTIABLE.

---

## 1. Fonts (Critical)

ONLY the following font sources are allowed:

- System fonts (`system-ui`, `ui-sans-serif`)
- Google Fonts with SIL Open Font License (OFL)
- Fonts explicitly marked as:
  - Free for commercial use
  - Redistributable

FORBIDDEN font sources:
- Proprietary system fonts
- Paid fonts
- Trial fonts
- Fonts with unclear licensing

If the license is not explicit, the font is considered FORBIDDEN.

---

## 2. UI Component Libraries

Allowed:
- shadcn/ui (MIT)
- Headless UI libraries with permissive licenses
- Custom components built in-repo

Forbidden:
- Proprietary UI kits
- Paid component libraries
- Trial / freemium UI kits
- Closed-source UI components

---

## 3. Icons & Visual Assets

Allowed:
- lucide-react (ISC)
- Heroicons (MIT)
- Icons with MIT / Apache-2.0 / ISC licenses

Forbidden:
- Brand icon packs
- Icon sets with unclear licensing
- Assets copied from proprietary software

---

## 4. Colors, Layouts & Inspiration

- Abstract visual inspiration is allowed
- Direct imitation of branded or proprietary UIs is forbidden
- No copying of exact layouts, components, or behaviors

Design must be original and license-safe.

---

## 5. Third-Party Code & Snippets

- Only MIT, Apache-2.0, BSD licenses are allowed
- GPL or AGPL code is forbidden unless explicitly approved
- Copy-pasting from unknown sources is forbidden

If the license cannot be verified, the code MUST NOT be used.

---

## 6. Validation Requirement

Before introducing ANY new external resource, the agent MUST:

1. Identify the license
2. Confirm commercial usage rights
3. Confirm redistribution is allowed

If any of these cannot be confirmed, STOP.

---

## 7. Default Safe Choices

When in doubt, ALWAYS default to:

- System fonts
- Tailwind utilities
- In-house components
- Existing repository assets

---

## 8. Violation Handling

If a requested solution requires a forbidden resource:

- DO NOT implement it
- EXPLAIN the licensing issue
- PROPOSE a compliant alternative

Silence or assumption is not allowed.
