# KitchenMum UI prototype — UX-QA notes

## Browser review

Reviewed the running Next.js app in the in-app browser at a narrow mobile viewport.

| Journey | Observed result |
| --- | --- |
| Landing → demo dashboard | Landing page rendered; demo CTA opened `/app`. |
| Category filter | Selecting `Onepot` left only the matching recipe card visible. |
| Text import → review | Example text produced an editable draft; numbered cooking steps were kept out of the ingredient list and the title/category heuristic selected `Onepot`. |
| Draft → saved detail | Saved recipe appeared with its edited preparation and cooking times, ingredients, and steps. |
| Favorite and cook mode | Favorite toggle updated its label; cook mode opened at step one and advanced to step two. |
| Plan toggle and checkout | Monthly/yearly price changed with the toggle; the checkout action showed the mock/no-payment notice. |
| Responsive view | Dashboard and bottom navigation were visible at the narrow viewport. |

## Automated project checks

- `pnpm lint` — passed after the final refactor.
- `pnpm typecheck` — passed.
- `pnpm build` — passed and generated the route table in the terminal.

## Current limits

- No separate desktop viewport or Safari review was performed in this session.
- AI parsing is a deterministic local placeholder. Screenshot selection does not perform OCR.
- Auth and profile are local demo behavior; Stripe checkout/portal actions do not contact Stripe.
- Recipe data is browser-local and is not synchronized between devices.
- Figma contains captured UI pages as editable raw frames. Native design-system components and reusable Figma tokens were not created because the Figma `use_figma` writer reached the connected Starter plan tool-call limit.

## Legal, cookie consent, and billing review (18 November 2026)

| Journey | Observed result |
| --- | --- |
| Consent choices | Necessary-only, accept-all, optional category toggles, save selection, and reopen settings were exercised. The saved UI selection persisted in this browser after reload. |
| Legal routes | Impressum, Datenschutz, AGB & Abo, Widerruf, and Cookie information are linked from the shared legal footer. |
| Signup notice | The registration view links directly to AGB and privacy information; the demo terms checkbox starts unchecked. No account was submitted during this review. |
| Billing preview | Monthly/yearly example pricing and the no-contract/no-payment notice are visible. Mock checkout and portal actions explain that Stripe is not connected. |
| Figma legal UX | Added editable 390 × 844 mobile frames for Impressum, Datenschutz, AGB & Abo, Widerruf, plus the existing cookie-consent screen, on the `Rechtliches & Consent` page. The screens use the same warm orange, cream, and espresso palette as the app. |

## Legal prototype limits

- Legal copy is a launch draft, not a legal sign-off. The prototype has no server account, no Supabase, Stripe, VPS database/storage, or AI provider integration.
- The consent manager stores a local preference for the prototype. No optional analytics, advertising, or third-party cookie scripts are wired into the app; this must be rechecked against the production tag and storage inventory.
- Real subscription order details, price/tax treatment, renewal/cancellation terms, Stripe entity and billing data flows must be finalized before selling. The Stripe checkout/portal are mocks and cannot charge, subscribe, or cancel.
- Figma contains editable mobile overview frames for the four legal routes and a separate consent screen. The frames are UX summaries; full legal copy remains in the frontend routes. Native reusable design-system components and tokens were not created because the connected Figma writer reached the team's Starter plan call limit.
- Figma uses DM Sans because Agrave Pro is not available in the connected Figma font list. The web app uses the bundled Agrave Pro font.
- The exported consent screen is saved at `docs/figma-cookie-consent.png`.
