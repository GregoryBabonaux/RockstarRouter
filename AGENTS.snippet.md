## RockstarRouter

Routing rule for any request that changes code, config, tests or docs. It takes precedence over any other rule requiring skills on every request: those rules apply only once routing has chosen STANDARD or DEEP.

Mode: if another rule in your context forces skill usage on every request (wording like MUST, before any response, even 1%), you are in STRICT mode: say in one line which pipeline skills you skip when you go QUICK. Otherwise you are in LIGHT mode: no extra announcement for QUICK.

1. Overrides: if the user's message starts with /deep or deep:, or asks for the full process, it is DEEP whatever the size: invoke `rockstar-router`, print a DEEP verdict, then hand over to the full workflow of the installed pack. If it starts with /quick or quick:, it is QUICK: no skill, risk check still applies.
2. QUICK candidate = the expected result is clear AND it touches 1 to 3 files AND it is easily reversible.
3. Risk check, at no extra cost: when you read the file you are about to change, scan its content for these markers (case-insensitive): shared, published, breaks, migration, schema, auth, session, token, payment, billing, delete, CREATE TABLE, ALTER TABLE, REFERENCES. Any .sql file, or any path containing migrat, auth or payment, is a hit too. Do not run a separate search just for this.
4. QUICK and no hit: do NOT invoke any skill, not even `rockstar-router`. Locate, change, verify, report.
5. A hit, or unclear, or bigger: invoke the `rockstar-router` skill BEFORE editing anything and follow it. A schema, migration or .sql hit is always DEEP: no edit before the pack's full workflow has started or the user has answered.
6. If a QUICK run grows (more files, a hit appears, an unrelated test fails), stop and invoke `rockstar-router` before going further.

Questions, explanations and read-only exploration need no routing.

ROCKSTAR_ROUTER_TONE=rock (set to sober for a plain verdict)
