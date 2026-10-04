# Implementation prompt

Build **Recupera Claro**, a Spanish-language, responsive React + TypeScript + Vite prototype for Week 8 of Business Bending. Follow `docs/PACKET.md` as the authoritative product boundary.

## Features

1. Create an accessible landing/triage flow with four required enum controls: incident type, recency, current access, and money status.
2. Validate all selections in pure TypeScript. No open text, upload, password, code, account number, identity document, or personal-data field may exist.
3. Run a deterministic engine labeled **Evaluación de IA simulada**. Show priority, reasons, uncertainty, inputs used, limits, and a refusal/human-escalation state.
4. Match one of several invented indicators against a versioned, visibly simulated structured threat feed. Use the browser Web Crypto API to compute SHA-256 locally and never persist the raw indicator.
5. Produce an ordered recovery route with official bank/platform guidance and the Guardia Nacional 088 reporting page. Do not submit or automate any external action.
6. Add a visible anti-social-engineering rehearsal. Use browser speech synthesis only after a click; show the identical script in text and never request microphone access.
7. Add a simulated human-review capacity card: three daily places, 30-minute first-response target, named operator role, and a hard stop at zero.
8. Produce a privacy-minimized handoff summary containing categorical facts only and the statement that identity remains unverified.
9. Apply accessible focus states, semantic headings, live regions for validation, and responsive layouts at 390px and 1440px.
10. Add Vercel security headers including CSP, anti-framing, MIME sniffing protection, strict referrer policy, and a Permissions Policy denying microphone, camera, geolocation, and payment.

## Acceptance criteria

- `pnpm test` passes pure engine and built-page checks.
- `pnpm build` completes without TypeScript or Vite errors.
- Every simulated model, record, person, capacity, incident, and fingerprint is labeled simulated.
- A payment-loss case within 24 hours puts the bank first; an active takeover puts the platform first.
- Unknown enum values fail validation.
- No secret, real personal seed, raw leaked data, or sensitive-input field exists in source or built output.
- Voice has an equivalent visible script and never uses microphone input.
- Zero capacity blocks the handoff request and preserves official self-service steps.
- The app never claims verified identity, guaranteed recovery, transfer reversal, data deletion, or safety.

## Commit plan

1. `docs: add week 8 packet and generated mockup`
2. `feat: scaffold accessible incident intake`
3. `feat: add simulated triage and structured indicator check`
4. `feat: add human handoff boundary and voice rehearsal`
5. `test: fix mechanical pass defects and add security checks`
6. `docs: record persona fix and submission evidence`

Each work session ends with `DECISIONS.md` updated, tomorrow's first move recorded, a commit, and a push when remote access is available.
