# Retired scheduled test matcher

The owner chose manual review of Google Calendar instead of automatic booking-status matching. The script `scripts/auto-match-strategy-test.cjs` is now a no-op, even if the previous flag is enabled; it does not read credentials, connect to providers, or update any records. Remove its existing cron job from hPanel to avoid needless process usage. The job will only become a no-op after this change is deployed; stopping or removing the existing cron job immediately is the safest way to stop it before deployment.

Existing records and booking-status columns are retained; no data was deleted. See `docs/strategy-payment-review.md` for private review and accurate limitations of the recorded-payment count. Live payments are not enabled.
