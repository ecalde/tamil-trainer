# Security

This project is a **static single-page application** with **no authenticated backend** in the MVP. Security goals are to avoid leaking secrets, avoid unsafe dynamic code, validate all bundled content, and minimize attack surface.

## Threat model (MVP)

- **Primary assets:** learner progress stored locally (IndexedDB), user trust, and supply-chain integrity of dependencies.
- **Non-goals:** server-side authorization, multi-user isolation, or transport security beyond what GitHub Pages / HTTPS provides for hosting.

## Rules enforced in code

- **No secrets in the repository:** no API keys, tokens, or private configuration in source. The MVP avoids environment-based secrets entirely.
- **No `eval`, `new Function`, or dynamic script injection.**
- **No `dangerouslySetInnerHTML`** in MVP UI; React text rendering escapes by default.
- **Zod validation** for curriculum payloads before use (`src/content/validate.ts`).
- **Sanitizer** for plain text (`src/lib/sanitize.ts`) as a defense-in-depth layer if strings ever cross boundaries.
- **Strict TypeScript** (`strict`, `noUncheckedIndexedAccess`) to reduce logic bugs that could become security bugs later.
- **Audio URLs** in content are constrained to local paths or `data:` audio URLs in the schema (`src/content/schema.ts`).
- **No unnecessary network calls** in the MVP; pronunciation uses the Web Speech API and optional static assets only.

## Dependency hygiene

- Run `npm run audit` regularly and upgrade patch/minor versions deliberately.
- Keep dependencies minimal and reputable; avoid pulling in large unrelated stacks for small features.

## Future APIs (not in MVP)

If the product later adds sync, analytics, or AI features:

- **Never** ship service credentials in the browser bundle.
- Route privileged operations through a **server you control**, with authentication and rate limiting.
- Treat all client input and imported content as untrusted until validated.

## Reporting

If you discover a security issue in this repository’s code or dependencies, please open a private maintainer channel (or GitHub Security Advisories if enabled) with reproduction steps.
