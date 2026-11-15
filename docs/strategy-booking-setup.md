# Ziina strategy booking — test backend in progress

The checkout is **not live**. The backend accepts only explicitly enabled test-mode requests; live payments are blocked in code. The booking popup is not connected to it: the free call still opens its calendar, while the strategy option shows a coming-soon message. Do not enable the backend on the live site or apply the migrations until the remaining work below is reviewed and tested.

## Work completed

- `POST /api/strategy/checkout`: validates an international WhatsApp number, records a test attempt in Supabase and creates a Ziina **test** payment intent. The session token is stored in a Secure, HttpOnly, SameSite cookie; only its hash is stored in the database.
- `GET /api/strategy/status`: looks up that session and checks the intent directly with Ziina. It returns the reference and calendar only after the stored intent ID, Ziina account, completed status, AED 1,200 amount and currency match. A return URL alone is not proof of payment.
- `POST /api/ziina/webhook`: verifies the HMAC against the raw request bytes and looks up the payment independently. Repeated completed events do not create additional records. Unknown or refund events return an error for review; refunds are **not automated**.
- A read-only Google Calendar adapter is prepared, but it is not wired to a scheduler or public endpoint. Event/reference matching remains unimplemented until the real booking form and API representation can be tested.
- Private table migrations and mock-based tests are included. They have not been applied or connected to a real Supabase project.

Run `node --test tests/strategy-*.test.cjs` to exercise the mock backend and safety tests. These tests use fake credentials and providers; they do not prove the real services work.

## Test-only environment settings

The settings are listed with blank values in `.env.example`. Do not enter `...` as a value. Never put secrets in a `VITE_` variable, browser code, Git, screenshots or chat.

- `STRATEGY_EXPERIMENTAL`: must be `true` to enable this prototype. Default is `false`.
- `STRATEGY_MODE`: must be `test`. Any other value, including `live`, disables checkout.
- `STRATEGY_ORIGIN`: exact HTTPS site origin, without a trailing slash (for example `https://example.com`). Used for redirects and origin checks.
- `ZIINA_API_KEY`: server-only API key with the required payment intent permissions.
- `ZIINA_ACCOUNT_ID`: Ziina account expected to receive the payment.
- `ZIINA_WEBHOOK_SECRET`: privately generated signing secret, at least 32 characters. It must also be registered with Ziina when the webhook is deliberately configured.
- `SUPABASE_URL`: HTTPS project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: private server-only key with access to the table. It bypasses row-level security and must never reach the browser.
- `BOOKING_STRATEGY_EMBED`: private Google Calendar appointment-schedule embed URL. Once shown to a paid visitor, the URL can still be shared; it is not a secure lock.

These settings must not be enabled until access, migrations, webhook configuration and real test-mode behavior have been reviewed. Google Calendar authorization settings are not wired yet; the required method and final variable names will be confirmed during setup.

## Remaining before launch

1. Add the WhatsApp input and payment/return/recovery UI to the current booking popup. The present backend only restores the session in the same browser; if a visitor loses it, the team must help manually. Duplicate checkout attempts and payment-provider timeouts need further work to avoid accidental repeat payments.
2. With the calendar owner's authorization, test a real Google appointment form with a required booking reference. Verify what the Calendar API actually returns, then implement and test matching, cancellation/rescheduling, duplicate references and a private review workflow. Do not automatically cancel unmatched bookings.
3. Add reliable operations for paid-but-unbooked customers, refunds, failed webhooks and reconciliation, plus private team access. Review retention, backups, access controls and consent. A database record alone is not an operational recovery system.
4. Review webhook network security at the hosting edge, including Ziina's documented sender IPs and the actual proxy configuration. Do not trust an unverified forwarded IP header. Ziina documents one webhook URL per account; check for an existing integration before registering another. Registration is not automatic.
5. Verify Ziina test intent behavior and test/live isolation with the real account. The documented payment-intent response does not provide a clearly documented test flag to independently confirm mode; this implementation sends `test: true` and stores the attempt as test, but real behavior still needs verification. Keep live payments blocked until that is resolved.
6. Review migrations, row-level security, service-role access and secrets; run test payments, failures, browser interruption, timeouts, refunds, duplicate and out-of-order events, and a real test booking. Obtain approval before any controlled live test.

References: [Ziina payment intents](https://docs.ziina.com/api-reference/payment-intent/create) and [Ziina webhooks](https://docs.ziina.com/api-reference/webhook).
