# Recupera Claro

Recupera Claro is David Buzali's Week 8 individual build for Business Bending: a Mexico-localized recovery guide after account takeover, identity theft, or payment fraud.

The prototype uses invented data and a deterministic **simulated-AI** triage. It stores no personal data, accepts no sensitive narrative or credentials, and does not verify identity, contact institutions, or guarantee recovery.

- Live app: https://week-8-recupera-claro.vercel.app
- GitHub: https://github.com/davidbuzali/week-8-recupera-claro

See `docs/PACKET.md` for the packet-before-code evidence and `docs/IMPLEMENTATION_PROMPT.md` for the acceptance criteria and commit plan.

## Stack

- React, TypeScript, and Vite
- deterministic simulated-AI triage
- browser Web Crypto API for a local fingerprint of an invented indicator
- versioned, simulated structured threat-pattern data
- browser speech synthesis for an anti-social-engineering rehearsal
- session-only state and no database, authentication, or API secret

## Local checks

```bash
pnpm test
pnpm build
```

## Submission artifacts

- `output/pdf/PACKET_davidbuzali.pdf`
- `output/pdf/PERSONA_davidbuzali.pdf`
- `output/pdf/BUILDCHAT_davidbuzali.pdf`

See `docs/TESTING.md` for the mechanical bug-fix-retest evidence and `DECISIONS.md` for session closes.
