# Gotchas — App Fichaje

Current, non-obvious facts that can cause wasted time or an incorrect change.

## ESLint has two configuration files

**Symptom / trap:** Editing `eslint.config.ts` appears to have no effect.  
**Reality:** The lint script explicitly loads `eslint.config.js`; the TypeScript
file is redundant scaffold configuration.  
**What to do:** Treat `eslint.config.js` as canonical. Do not try to keep both in
sync accidentally; removing the redundant file requires a deliberate cleanup.  
**Relevant area:** linting and repository configuration.

## Browser routing is temporary

**Symptom / trap:** Architecture calls for static Capacitor-compatible routing,
but `src/main.tsx` currently mounts `BrowserRouter`.  
**Reality:** Native packaging has not been implemented, and routing has not yet
been validated against packaged assets.  
**What to do:** Do not assume either router is final. Decide and test the router
before adding the Android project.  
**Relevant area:** application composition and Capacitor packaging.

## Local date keys are not UTC dates

**Symptom / trap:** `toISOString().slice(0, 10)` can assign a shift to the wrong
calendar date near a timezone boundary.  
**Reality:** Workdays belong to the user's local start date, while event
timestamps are ISO instants.  
**What to do:** Construct and test local `YYYY-MM-DD` keys explicitly; store the
key separately from timestamps.  
**Relevant area:** domain dates, persistence, and reports.

## IndexedDB completion is transactional

**Symptom / trap:** An individual request can succeed before its surrounding
transaction has committed.  
**Reality:** Persist-first UI guarantees and atomic restore depend on transaction
completion, not only request success.  
**What to do:** Keep raw IndexedDB inside the adapter and resolve mutations only
after the transaction completes.  
**Relevant area:** persistence, live commands, and backup restore.

## The React ESLint plugin has not declared ESLint 10 support

**Symptom / trap:** `pnpm peers check` reports an unmet `eslint` peer after an
otherwise successful install.

**Reality:** The warning comes from `eslint-plugin-react@7.37.5`, whose declared
peer range stops before the installed ESLint 10. The project lint command
currently passes.

**What to do:** Do not attribute this warning to i18next or Testing Library, and
do not silence it by editing the lockfile. Reassess the plugin when a compatible
release exists or lint behavior demonstrates a real failure.

**Relevant area:** dependency installation and lint tooling.
