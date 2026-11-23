'use strict'

// Booking-status matching was retired in favour of private manual review.
// This no-op remains for already-installed cron jobs, which should be removed
// in hPanel. It never loads credentials, connects to providers, or changes rows.
async function run() {
  return { disabled: true }
}

if (require.main === module) {
  console.log('Automatic booking matching is disabled. Remove this cron job in hPanel.')
}
module.exports = { run }
