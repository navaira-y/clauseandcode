# Private strategy payment review — test only

The owner chose to review bookings manually in Google Calendar, rather than automatically update `booking_status`. The payment record's `booking_reference` is generated and saved before checkout; after Ziina is independently verified, the same reference is shown on the protected test page. The customer should put it in the Google booking form and keep it for support. It is a correlation value, not proof of identity or a security barrier.

In the private Supabase SQL editor, count **recorded completed test payments** without counting pending attempts:

```sql
SELECT COUNT(*) AS recorded_completed_test_payments
FROM public.strategy_bookings
WHERE payment_environment = 'test'
  AND payment_status = 'completed';
```

To review the corresponding records privately:

```sql
SELECT customer_name, whatsapp_e164, booking_reference, created_at
FROM public.strategy_bookings
WHERE payment_environment = 'test'
  AND payment_status = 'completed'
ORDER BY created_at DESC;
```

This is a count of records, not necessarily unique people. `completed` means the application previously verified that payment; the count is not a live query to Ziina and may miss completed payments when the visitor loses the session or the webhook isn't configured. Refunded or reversed payments, webhook retries, outages, and reconciliation still require a reliable operational workflow. Do not use this as proof of a complete financial report. No actual live payments are enabled. Neither a payment record nor `not_booked` proves whether an appointment exists. Check Google Calendar privately, use the booking reference to correlate, and verify uncertain cases without assuming the reference proves the attendee's identity. Do not send unsolicited outreach.

The existing booking-status columns and historical records are intentionally left untouched; there is no destructive migration or data cleanup. The web-mounted matcher is disabled and the already-deployed scheduled job becomes a no-op after this change is deployed. Remove the existing `auto-match-strategy-test.cjs` cron job in hPanel so it stops using account resources. The Google read-only calendar diagnostic is still available for private review, but it does not run automatically.

Before any live use, finish and test payment recovery/reconciliation, refunds, appropriate team access, webhook security and operations. Do not make live payment promises based only on the test flow.
