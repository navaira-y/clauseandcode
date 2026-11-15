# Ziina strategy booking — work in progress

The payment integration is not live. The files added so far are preparation only; they do not connect to Ziina, Supabase or Google Calendar, and they do not change the current booking flow. Do not apply the database migration or accept payments until the full flow has been reviewed and tested.

## Planned flow

1. The free 20-minute consultation stays as it is.
2. For the 90-minute strategy session, collect a WhatsApp number before redirecting to Ziina for the AED 1,200 payment. Explain how the number will be used and link to the privacy policy.
3. Save the attempt before the redirect. Only mark it paid after checking the payment directly with Ziina: the stored intent ID, account, completed status, amount, currency and test/live environment must match.
4. Show a booking reference and the paid calendar. The visitor enters the reference in a required question on Google's booking form; Google collects their name and email.
5. With permission to read the calendar, match the reference to the paid record. Flag missing or duplicate matches for review; do not automatically cancel bookings.
6. Keep a private list of paid customers who have not booked, so the team can help them through WhatsApp. Provide a recovery path if someone closes the page after paying.

A reference helps match bookings to payments, but it does not stop someone sharing the calendar link or reference. The existing paid calendar link has already appeared in the site's code; removing it from the current site does not revoke it.

## Files added so far

- `server/strategy-safety.cjs` — helpers for phone validation, random references, recovery-token hashes, webhook signature checks and payment verification. These are not connected to any routes.
- `supabase/migrations/20261106000000_strategy_bookings.sql` — proposed private table with row-level security and no public client access. It has not been applied.
- `tests/strategy-safety.test.cjs` — tests for the helpers. Run with `node --test tests/strategy-safety.test.cjs`.

## Still needed

- **Ziina:** API access for creating and checking payment intents. Ziina documents `test: true` for test payments. Confirm the account's access and test the flow before using live payments.
- **Supabase:** project access, a review of the table and permissions, and a plan for backups, retention and restricted access to customer details.
- **Google Calendar:** permission to read the paid appointment schedule. Add the reference question and test a booking to confirm that the Calendar API exposes the reference and booking email. Until then, matching must be checked manually.
- **Webhook:** verify Ziina's signature against the raw request body, handle duplicate events and reconcile payments even if the visitor does not return. Ziina documents one webhook URL per account; check for an existing integration before registering another.
- **Frontend and recovery:** build the payment and return flow, plus a private way for the team to find paid-but-unbooked customers.

## Before launch

Test successful, pending, failed and cancelled payments; invalid amounts, accounts, currencies and signatures; duplicate events; recovery after closing the page; booking mismatches; refunds; and service outages. Test with mock services first, then Ziina test mode and a real test booking. Confirm backups, privacy wording and access controls before switching to live mode.

The environment variables are not wired up yet. Keep all keys and authorization details server-side in Hostinger—never in `VITE_` variables, the repository, screenshots or chat. The exact variable names will be documented once the integration is built.

References: [Ziina payment intents](https://docs.ziina.com/api-reference/payment-intent/create) and [Ziina webhooks](https://docs.ziina.com/api-reference/webhook).
