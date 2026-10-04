# Deployment record

## Deployment 1 - first public build

- Deployment: https://week-8-recupera-claro-hffjg7wdp-davidbuzali.vercel.app
- Vercel deployment ID: `dpl_JDNPH11EAFgYyJBcvRXUNCczRaLQ`
- Result: ready; first deployment assigned to production and aliased to the stable URL.
- Live smoke: completed the mixed-incident flow, confirmed the bank-first result, and verified the security headers.
- Findings: Vercel warned that `node >=22` could cross a major version; the live CSP unnecessarily allowed inline styles.

## Deployment 2 - hardened production redeploy

- Deployment: https://week-8-recupera-claro-kakrrcfuu-davidbuzali.vercel.app
- Vercel deployment ID: `dpl_2nsKZKudKWTpEQB8MMuNFyvgX9Nb`
- Stable alias: https://week-8-recupera-claro.vercel.app
- Result: ready; Node 22.x build completed successfully.
- Verified live CSP: `style-src 'self'` with no `'unsafe-inline'` allowance.
- Verified live protections: HSTS, anti-framing, MIME sniffing protection, no-referrer, same-origin opener, and denied camera, microphone, geolocation, payment, and USB permissions.

## Source connection

The Vercel project is connected to https://github.com/davidbuzali/week-8-recupera-claro for future deployments from the repository.
