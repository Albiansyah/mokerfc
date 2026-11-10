# Moker FC V2 Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the specified V2 redesign and Supabase-backed event registration system without retaining V1 JSON content paths or unsafe public access to registration data.

**Architecture:** Server Components read only public rows through a Supabase server client, and isolated Client Components own browser-only interactions such as forms, dialogs, theme, calendar downloads, and gallery lightbox. Administrative mutations run from server actions after an explicit `is_admin()` check; public registration uses only the atomic `register_for_event` RPC.

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 4, Supabase SSR/Postgres/Auth/Storage, Node test runner through `tsx`.

**Spec:** `D:\MY PROJECT\PERSONAL\Mokerfc\ini2.md`

## Global Constraints

- Use only `public/brand/logo-full.png` for the brand mark; never recreate a shield, temple, or logo illustration.
- Default to light mode and persist a user-selected mode with guarded localStorage access.
- Public components must never query, serialize, log, or expose `registrations` rows.
- Contacts and payment details come from `settings`, never component literals.
- Use Asia/Jakarta for event comparisons and ICS timestamps; format dates and Rupiah in Indonesian.
- No em dash, gradients, glow, glass, fabricated data, generic dead CTAs, or obsolete `/gabung` route/content files.
- Use chamfer, navy, red, paper, and gold tokens; honour reduced motion.

## Review Focus

- An unconfigured Supabase project must show honest empty states without falling back to invented event, gallery, payment, or contact data.
- Concurrent public registrations for the final available slot must admit only one registration.
- A non-admin authenticated user must be denied both server actions and admin pages.
- `closed`, `cancelled`, past, total-full, and GK-full events must render consistent public controls and RPC errors.
- Mobile 360px, keyboard navigation, focus return, Escape, and reduced motion must remain usable in header drawer, lightbox, tabs, and dialogs.

---

### Task 1: Establish a reliable baseline and test harness

**Files:**
- Modify: `package.json`, `package-lock.json`, `scripts/check.mjs`
- Create: `tests/money.test.ts`, `tests/whatsapp.test.ts`, `tests/dates.test.ts`

**Interfaces:**
- Consumes: `formatRupiah`, WhatsApp helpers, and date helpers.
- Produces: `npm test` executes TypeScript tests without Node ESM resolution errors.

- [ ] Write failing tests for Rupiah formatting, phone-message output, and Asia/Jakarta upcoming-event checks.
- [ ] Run `npm test` and verify failure is from the missing TypeScript-aware runner or the new expected assertions.
- [ ] Add `tsx` as a development dependency and replace the ad-hoc direct TS import script with Node tests that run under `tsx --test`.
- [ ] Run `npm test`; expected: all tests pass without Node's extensionless-import error.
- [ ] Run `npm run lint`; record and then fix the existing `Reveal` state-in-effect violation with a tested observable/reveal implementation.

### Task 2: Remove V1 content and make public data access Supabase-only

**Files:**
- Delete: `content/club.json`, `src/lib/content.ts`, obsolete V1-only section files once callers are migrated
- Modify: `src/lib/queries.ts`, `src/lib/types.ts`, `src/app/page.tsx`, `src/app/acara/page.tsx`, `src/app/galeri/page.tsx`, `src/app/layout.tsx`
- Test: `tests/queries-contract.test.ts`

**Interfaces:**
- Consumes: public `settings`, `events`, `event_counts`, `albums`, and `photos` tables.
- Produces: `getSettings`, `getPublicEvents`, `getEventBySlug`, and `getPublicAlbums` return database-shaped data plus explicit empty/error state.

- [ ] Write failing contract tests proving home, event list, and gallery consume query-layer data rather than `content/*.json` or fallback factual records.
- [ ] Implement typed query results with no invented fallback settings, public `event_counts` only, storage public URL helpers, and distinguish configuration/query failure from true empty results.
- [ ] Update every public route to await the query functions and render loading, error, or empty states as specified.
- [ ] Delete obsolete content path imports and files; use `rg` to prove no remaining `content/`, V1 `date/startTime`, or `/gabung` references.
- [ ] Run relevant tests and `npm run lint`.

### Task 3: Finalize database schema and privacy boundary

**Files:**
- Modify: `supabase/schema.sql`, `.env.example`, `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/middleware.ts`
- Create: `tests/schema-contract.test.mjs`

**Interfaces:**
- Consumes: `register_for_event(p_slug, p_full_name, p_nickname, p_phone, p_position)`.
- Produces: RLS-protected tables, atomically capacity-checked RPC, public aggregate-only count view, authenticated cookie refresh, and `/admin` redirect protection.

- [ ] Write failing static schema tests for RLS, RPC grants, partial duplicate-phone index, private registrations, public aggregate view, and storage policies.
- [ ] Implement schema exactly as V2 specifies, including an event-to-photo cover foreign-key order that Postgres accepts, event state rules, and all RLS policies.
- [ ] Implement Supabase clients that fail clearly when configuration is absent and middleware that refreshes the session rather than bypassing `/admin` protection.
- [ ] Run the schema contract tests and `npm run build` without a service-role key.

### Task 4: Public registration flow

**Files:**
- Create: `src/components/sections/RegisterCard.tsx`, `src/components/sections/RegisterSuccess.tsx`, `src/lib/registration.ts`
- Modify: `src/lib/queries.ts`, `src/lib/whatsapp.ts`, `src/app/acara/[slug]/page.tsx`, `src/lib/types.ts`
- Test: `tests/registration.test.ts`, `tests/whatsapp.test.ts`

**Interfaces:**
- Consumes: event, aggregate counts, settings, and `registerForEventRpc(params)`.
- Produces: normalized `62xxxxxxxxxx` phone input, field errors, RPC error mapping, and a session-persisted successful registration summary.

- [ ] Write failing tests for 08/628/+628 phone normalization, required fields, amount source, full quota states, and WhatsApp message content.
- [ ] Implement pure validation and RPC response handling first; prove it passes tests.
- [ ] Implement the client form with honeypot, accessible validation, disabled filled options, retryable network error, and sessionStorage success restoration.
- [ ] Implement payment details only inside success view, copy feedback, and the two real WhatsApp proof-transfer links.
- [ ] Run test suite and manually test one GK and one player flow against a configured local Supabase project if credentials are supplied.

### Task 5: Complete public pages and metadata

**Files:**
- Modify: `src/app/page.tsx`, `src/app/acara/page.tsx`, `src/app/acara/[slug]/page.tsx`, `src/app/galeri/page.tsx`, `src/app/sparring/page.tsx`, `src/app/error.tsx`, `src/app/loading.tsx`, `src/app/not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`
- Create: `src/components/sections/EventRow.tsx`, `src/components/sections/MatchdayCard.tsx`, `src/components/sections/GalleryGrid.tsx`, `src/components/sections/JoinCta.tsx`, public page tests

**Interfaces:**
- Consumes: Task 2 query contract, Task 4 registration card, current `downloadIcs` and share helpers.
- Produces: V2 home composition, keyboard event tabs, detail action links, gallery empty/error states, sparring handoff, and accurate noindex metadata.

- [ ] Write failing route/component tests for no-event matchday fallback, status labels, no-about/no-photo section hiding, calendar/share URLs, and admin exclusion from sitemap/robots.
- [ ] Implement the required event strips, detail band/sticky registration layout, gallery fetch/render states, and branded system pages.
- [ ] Remove the sponsor route if it is not a specified navigation/page and remove all sitemap `/gabung` entries.
- [ ] Run tests, lint, and build.

### Task 6: Finish brand shell, design tokens, and accessible interactions

**Files:**
- Modify: `src/styles/tokens.css`, `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileDrawer.tsx`, `src/components/layout/ThemeToggle.tsx`, `src/components/ui/Reveal.tsx`
- Create: `tests/theme-and-navigation.test.tsx`

**Interfaces:**
- Consumes: `Settings` and public registration URL from layout.
- Produces: default-light theme, keyboard-safe drawer, true settings-driven footer contacts, header active links, animations A1-A9 with reduced-motion fallback.

- [ ] Write failing tests for first-load light mode, stored dark selection, toggle persistence, Escape close, focus return, and navigation with no dead route.
- [ ] Implement the shell and token rules, avoiding narrow tracked labels and component hard-coded settings defaults.
- [ ] Implement CSS/IntersectionObserver reveal, quota animation, header shrink, and only specified motion with no animation under reduced motion.
- [ ] Run component tests, lint, and a 360px browser smoke test.

### Task 7: Gallery lightbox and media handling

**Files:**
- Modify: `src/app/galeri/GalleryClient.tsx`, `src/components/sections/GalleryGrid.tsx`, `src/lib/image.ts`
- Create: `src/components/ui/Lightbox.tsx`, `tests/lightbox.test.tsx`

**Interfaces:**
- Consumes: public photo records and public storage URLs.
- Produces: keyboard and touch-operable lightbox plus client-side image resize result for later admin upload.

- [ ] Write failing tests for opening through click/Enter, Escape close and focus restore, arrow navigation, failed-image fallback, and reduced-motion behavior.
- [ ] Implement focus trap, caption, navigation, swipe, and fallback image state.
- [ ] Implement tested image compression constrained to a 1600px longest edge and JPEG/WebP quality 0.8.
- [ ] Run tests and gallery browser smoke test.

### Task 8: Admin authentication shell and settings

**Files:**
- Create: `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx`, `src/app/admin/page.tsx`, `src/app/admin/pengaturan/page.tsx`, `src/components/admin/AdminShell.tsx`, `src/components/admin/SettingsForm.tsx`, `src/app/admin/actions.ts`
- Test: `tests/admin-authorization.test.ts`, `tests/settings-form.test.tsx`

**Interfaces:**
- Consumes: Supabase Auth user, `is_admin()` server check, and settings record.
- Produces: protected noindex admin shell, sign-in/out, dashboard aggregate data, and settings mutation actions.

- [ ] Write failing tests for unauthenticated/non-admin denial and validation of prices, contacts, bank data, and about text.
- [ ] Implement server-side `requireAdmin` and use it in every admin page/action; middleware is only an early redirect.
- [ ] Implement responsive sidebar/bottom-tab shell, login errors, and keyboard-friendly settings form with success/error feedback.
- [ ] Run tests, lint, and build.

### Task 9: Admin event and registrant management

**Files:**
- Create: `src/app/admin/acara/page.tsx`, `src/app/admin/acara/baru/page.tsx`, `src/app/admin/acara/[id]/page.tsx`, `src/app/admin/acara/[id]/pendaftar/page.tsx`, `src/components/admin/EventForm.tsx`, `src/components/admin/BenefitsInput.tsx`, `src/components/admin/RegistrantsTable.tsx`
- Modify: `src/app/admin/actions.ts`, `src/lib/queries.ts`
- Test: `tests/admin-events.test.ts`, `tests/admin-registrants.test.ts`

**Interfaces:**
- Consumes: admin-only event/registration queries and mutations.
- Produces: event CRUD/status lifecycle, dynamic benefits, protected cancellation rules, paid/cancelled controls, client CSV export.

- [ ] Write failing tests for event validation, empty prices using defaults, event delete denial with registrations, status mutation, and CSV escaping.
- [ ] Implement admin server actions and forms with explicit confirmation dialogs; never send registrations to public components.
- [ ] Implement participant summaries, filters, search, payment total, WhatsApp link, responsive rows/cards, and client-only CSV export.
- [ ] Run tests, lint, and build.

### Task 10: Admin albums and uploads

**Files:**
- Create: `src/app/admin/galeri/page.tsx`, `src/app/admin/galeri/[id]/page.tsx`, `src/components/admin/PhotoUploader.tsx`
- Modify: `src/app/admin/actions.ts`, `src/lib/image.ts`
- Test: `tests/admin-gallery.test.tsx`

**Interfaces:**
- Consumes: Task 7 compression result and restricted storage policies.
- Produces: album management, multi-file upload progress, required alt data, ordering, cover selection, and confirmation before deletion.

- [ ] Write failing tests for rejecting missing alt text, exposing file progress, next/previous order mutations, and destructive confirmation.
- [ ] Implement admin-gated album actions and browser uploader to the correct bucket/path.
- [ ] Implement photo management controls with save/error/empty states and publish visibility.
- [ ] Run tests and manual authenticated storage smoke test where credentials are available.

### Task 11: Delivery verification and visual QA

**Files:**
- Create: `tests/e2e/public.spec.ts`, `tests/e2e/admin.spec.ts`, `docs/verification/2026-11-10-v2-report.md`
- Modify: only files revealed by failing verification.

**Interfaces:**
- Consumes: completed public/admin routes and Playwright fixture configuration.
- Produces: repeatable desktop/mobile light/dark screenshots and a precise PASS/FAIL report.

- [ ] Add Playwright coverage for all stated viewports/routes, default-light behavior, reduced motion, drawer/lightbox keyboard paths, and public admin denial.
- [ ] Run screenshot QA for `/`, `/acara`, real `/acara/[slug]`, `/galeri`, `/sparring`, and `/admin/acara/baru` at 1366x768 and 390x844 in light/dark.
- [ ] Run `npm test`, `npm run lint`, and `npm run build`; fix failures and rerun affected checks.
- [ ] Write the delivery report with evidence per required gate and the six requested one-line visual design rationales. Mark unavailable live Supabase operations as UNVERIFIED, not PASS.

## Coverage Review

- Brief sections 0, 2, 3, 5, and 10 map to Tasks 2, 5, 6, and 11.
- Brief sections 1 and 8 map to Task 3.
- Brief section 4 maps to Tasks 2, 5, 6, and 7.
- Brief section 6 maps to Task 4.
- Brief section 7 maps to Tasks 8, 9, and 10.
- Brief sections 9 and 11 map to Tasks 1 and 11.
- `ANTISLOP.md` is absent from the supplied directory; its additional gates must be incorporated before final delivery if the file is provided.
