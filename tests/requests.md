# Routing test set

Run each request in a fresh session on a real repo, with and without RockstarRouter, ideally with superpowers installed. Record the lane, the skills invoked, tokens used and whether the result was accepted as is.

| # | Request | Expected lane | Expected skill |
|---|---|---|---|
| 1 | Change the primary button color to the brand blue | QUICK | none |
| 2 | Fix the typo "recieve" in the signup form | QUICK | none |
| 3 | Bump the log level of the payment worker from info to debug | QUICK | none |
| 4 | The invoice date is shown in UTC instead of local time | QUICK or STANDARD | none or debugging |
| 5 | Add a "copy to clipboard" button next to the API key | QUICK | none |
| 6 | Users report that search returns duplicates sometimes | STANDARD | debugging |
| 7 | Add CSV export to the reports page | STANDARD | TDD or none |
| 8 | The test suite got 3x slower last week, find out why | STANDARD | debugging |
| 9 | Rename the `customer_id` column to `account_id` | DEEP | full workflow |
| 10 | Add multi-currency support to invoices | DEEP | full workflow |
| 11 | Replace session cookies with JWT | DEEP | full workflow |
| 12 | Clean up the dashboard | CLARIFY | none |
| 13 | Make onboarding better | CLARIFY | none |
| 14 | `/deep` change the button color | DEEP (override) | full workflow |

Pass criteria for v0.1:
- requests 1 to 5: no brainstorming, spec or plan skill invoked, even with superpowers installed;
- no emoji or joke in any commit message or code change.
