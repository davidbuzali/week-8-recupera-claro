# Mechanical and security test log

## Pass 1 - 2026-10-04

The first automated run surfaced two test-harness defects before it could exercise the product: Node's native TypeScript runner required explicit `.ts` module extensions, and a URL pathname with encoded spaces was passed directly to `readFileSync`. Both were corrected so the tests could reach the product logic.

The completed first product run produced **7 passes and 1 failure**. The human-capacity guard accepted any positive integer, including `4`, even though the interface and operating rule publish a maximum daily capacity of three reviews. That could allow a future caller or corrupted state to bypass the declared capacity ceiling.

## Fix

`canRequestReview` now accepts only integer capacities from one through three. Zero, negative values, decimals, and values above the published ceiling stop intake. The visible demo still allows the user to switch between three available places and zero available places to inspect both states.

## Pass 2

The post-fix suite covers:

- incomplete and invalid enum input;
- recent payment loss prioritizing the bank;
- active account takeover prioritizing the platform;
- the three-place human-capacity ceiling and zero-capacity stop;
- categorical, privacy-minimized handoff structure;
- Spanish page metadata and a skip link;
- CSP, anti-framing, and denied microphone/camera/geolocation/payment permissions;
- required simulated-AI and no-send boundaries;
- a basic secret-pattern scan; and
- a clean TypeScript and Vite production build.

All automated tests pass after the capacity fix. The manual responsive and persona passes are recorded separately after screenshot review.
