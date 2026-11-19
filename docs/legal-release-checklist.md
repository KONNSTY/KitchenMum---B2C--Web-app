# KitchenMum legal release checklist

This is an implementation handoff for the prototype. It is not a legal sign-off.

## Confirm operator details

- Recheck the business name, legal form, service address, email and phone against the current Regler Productions imprint.
- Confirm whether a commercial register entry, VAT ID, tax ID or competent supervisory authority must be listed for KitchenMum.
- Confirm whether a data protection officer is required and who handles consumer requests.

## Confirm processing before enabling production services

- VPS: hosting company, country/region, access controls, backups, log fields and retention, deletion and incident process.
- Firebase Authentication: actual account region, contracting entity, subprocessors, DPA and transfer safeguards.
- Stripe: contracting Stripe entity, data roles, payment methods, billing period, VAT-inclusive price, renewal, confirmation email, customer portal and a working cancellation path.
- Azure AI Foundry: selected model/deployment and region, retention/logging settings, training use, subprocessors, DPA, transfer safeguards and deletion behavior for screenshots, recipe text and model output.
- User uploads: file size/type limits, malware checks, storage location, retention, deletion and whether screenshots are retained after extraction.
- Cookies: inventory actual cookies/local storage and SDKs, classify each purpose, implement consent-gated loading, and verify reject/withdraw behavior before activating any optional service.

## Current prototype facts

- Firebase Auth, the Python API, and VPS PostgreSQL now process account and recipe data. Confirm disclosures, hosting location, legal bases, and retention before public account registration.
- The import and AI extraction flow is simulated locally and does not send recipe text or screenshots to a model provider.
- Stripe checkout and the billing portal are mocks; they do not accept payment or create a subscription.
- Supabase is not connected; PostgreSQL and the API run on the VPS. Object storage and offsite backups are not configured.
- No analytics or marketing service is currently connected. The preference interface records a local UI choice only.
- Agrave Pro is self-hosted under the SIL Open Font License; this avoids a Google Fonts request from the user's browser.
- The Figma capture helper is development-only. Production builds do not load its external script.

## Sources reviewed for the prototype

- German Digital Services Act (DDG), § 5: provider information.
- TDDDG, § 25: storage/access on end-user devices.
- German Civil Code (BGB), §§ 312j and 312k: online ordering and cancellation interface.
- GDPR, Articles 6, 13, 28 and 44: lawful basis, transparency, processors and international transfers.

## Product launch gate

Do not activate account sync, payment collection, AI image/text processing, analytics or advertising until the corresponding provider contract, data flow, retention, user notice and required consent/order/cancellation flows are configured and reviewed.
