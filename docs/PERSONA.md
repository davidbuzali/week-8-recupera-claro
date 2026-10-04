# Persona test log - Elena

## Synthetic user

**Elena** is an invented 46-year-old administrator at a 12-person food distributor in Mexico. She handles supplier payments, uses WhatsApp daily, reads more slowly when stressed, and distrusts unfamiliar forms. A work messaging account may have been taken over and a supplier-payment message may also have been falsified. She is afraid that one wrong click will make the loss worse.

This was a fresh-session synthetic walkthrough using the packet persona and screenshots of the clean desktop and 390 px mobile build. All events, people, capacities, indicators, and outputs were simulated; no real personal data was used.

## Task

Elena was asked to use the prototype to decide what to do first, understand what the system knows and does not know, practice resisting a fraudulent call, and decide whether to prepare a human handoff.

## Screen-by-screen observations

### 1. Entry and privacy boundary

**What Elena understood:** The phrase “Primero, recupera el control” reduced urgency without minimizing the incident. The yellow boundary made clear that the app would not recover the account or reverse money.

**Hesitation:** She reread the no-secrets notice because she expected a box where she would have to explain everything. The categorical controls reassured her once she saw there was no text field.

**Would she quit?** No. The absence of a login and the sentence “no las guardamos” made the first step feel low risk.

### 2. Incident choice

**Confusion:** Her scenario contains both an account takeover and a payment-fraud risk, but the original screen forced one radio choice. Elena said, “If I choose the wrong one, will it give me the wrong first step?” This was the highest-risk confusion because it could block the task or hide the recent-money signal.

**Fix implemented:** Added **“No estoy segura o pasaron varias cosas”** as a valid incident type. Mixed incidents still prioritize the bank when the user reports a recent movement and prioritize platform recovery when access is lost without a recent movement.

### 3. Simulated-AI result

**Confusion:** The original “78% consistency” looked like a probability that the real incident had been understood, even though the nearby sentence denied that interpretation.

**Fix implemented:** Removed the percentage from the interface. The product now says **“Coincidencia de reglas: alta/media”** and explicitly defines it as a categorical match, not a probability or certainty about the case.

**What Elena understood:** “Primero: canal oficial de tu banco” gave her one immediate action. Expanding “¿Por qué va aquí?” let her verify that only the bank can review, block, or dispute a movement.

### 4. Structured indicator and official route

**Hesitation:** The fingerprint looked technical and not directly useful to her. The labels “simulada,” “inventado,” and “no se envía ni guarda” prevented her from treating it as evidence about her actual message.

**Would she quit?** No, because the actionable route appeared directly below and the technical panel did not require interaction.

### 5. Voice rehearsal

**What Elena understood:** The visible script gave her exact words to end a high-pressure call. She appreciated that the app stated it would not use the microphone.

**Hesitation:** She wanted to know whether the bank would be offended if she hung up. The route's instruction to use the number on her card or known app resolved this.

<!-- pagebreak -->

### 6. Human handoff and capacity stop

**What Elena understood:** “No verificada” told her that a real human would still need to confirm identity. “No se envió nada” prevented the simulated button from being mistaken for a real request.

**Stop-state test:** At zero capacity, the button changed to “Intake detenido” and remained disabled while the official self-service route stayed visible. Elena could continue without being pushed to wait or surrender data.

## Confusion log

| Observation | Severity | Resolution |
|---|---:|---|
| Account takeover and payment fraud could not both be represented | High | Added a mixed/unsure incident choice and retained money/access priority rules |
| A numeric percentage looked like model certainty about the real incident | High | Replaced it with a categorical rule-match label and explicit non-probability language |
| The simulated fingerprint was technical | Medium | Kept it secondary and labeled invented/local/no-send |
| She expected an open narrative field | Low-positive | Preserved the no-text design and explained why at the top |
| She wondered whether the simulated handoff was sent | Medium | Kept the visible “No se envió nada” confirmation and identity-unverified status |

## Result

After the fixes, Elena could select a mixed incident, see the recent payment movement put the bank first, explain that the model output was only a simulated rules match, rehearse a refusal phrase, and prepare a categorical handoff without entering a name, account, password, code, document, or narrative. The prototype remained honest about what it could not verify or perform.

## Remaining risk

This pass does not establish that a real victim, bank, SME buyer, insurer, or trained responder accepts the flow. Before a real pilot, test the wording with at least one authorized bank-fraud or incident-response professional and one consented user; verify provider-specific official links; define reviewer training and supervision; and obtain an actual capacity and response-time measurement.
