# Lanes: tie-breakers

Read this only when hesitating between two lanes.

## QUICK vs STANDARD

Go STANDARD if any of these is true:
- the bug has no obvious cause after reading the error and the code it points to;
- more than 3 files must change;
- a test needs to be written to prove the fix, and none exists nearby.

Otherwise QUICK. A typo, a label, a color, a spacing, a config value, a log line, a dependency bump with no breaking change: QUICK.

## STANDARD vs DEEP

Go DEEP if any of these is true:
- the change creates a new user-facing capability spanning several modules;
- it touches a schema, a migration, a public API contract, auth, payment, security or data deletion;
- it cannot be reverted with a simple revert (data written, external calls made, contract published);
- the user explicitly asks for a spec, a design or a plan.

## Anything vs CLARIFY

Go CLARIFY when you cannot state the expected result in one sentence. Size does not matter: a vague one-liner is CLARIFY, not QUICK.

## Examples

| Request | Lane |
|---|---|
| "Make the submit button blue" | QUICK |
| "Fix the typo in the onboarding email" | QUICK |
| "The date shows in UTC instead of local time on the invoice page" | QUICK if the formatter is obvious, STANDARD otherwise |
| "Users sometimes get logged out randomly" | STANDARD (unknown root cause), DEEP if the fix touches session or token handling |
| "Add CSV export to the reports page" | STANDARD |
| "Add multi-currency support" | DEEP |
| "Rename the `customer_id` column" | DEEP (migration) |
| "Clean up the dashboard" | CLARIFY |
