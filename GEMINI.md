# NEEV — Master Product, Design, Legal & Technical Specification
**Parent Legal Entity:** Upadhyay Technologies Private Limited (India)
**Brand Name:** Neev
**Official Tagline:** "Building the foundation of dreams through the blessings of your own."
**Hindi Companion Line:** "Apno Ke Aashirvaad Se, Sapno Ki Neev"

---

## 1. Core Product Vision & Business Model
- **What It Is:** A universal Indian social wishlist and group-gifting platform where anyone can create a pool for major life milestones (weddings, honeymoons, home down payments, college laptops, travel, personal dreams) and receive direct UPI contributions from invited guests or the public.
- **Visibility Modes:**
  1. `invite_only`: Unlisted from search/explore; accessible only via shareable link/QR and optional 4-digit PIN.
  2. `public`: Listed on the public "Explore Dreams" feed (requires KYC + supporting proof).
- **Strict Privacy Rule (Non-Negotiable):** Publicly, a pool displays ONLY the **total amount raised**, **target amount**, **supporter count**, and **public messages**. Individual contributor rupee amounts are **strictly hidden** from the public and visible ONLY to the pool creator in their private backend ledger.
- **Monetization (100% Free for Users):**
  - ₹0 platform fee for both wish creators and contributors.
  - Revenue comes strictly from: (a) Contextual wish-matched brand sponsors/affiliates placed **below the fold** (e.g., MakeMyTrip for travel pools, Croma/Apple for laptop pools, Pepperfry for home pools), (b) Sponsored brand "Top-Up Grants" on the Explore feed, and (c) Optional creator boosts for public pools.

---

## 2. Visual Design System & Brand Identity
- **Logo Concept:** Hands cradling a rising home and blooming lotus (representing blessings + strong foundation).
- **Color Palette:**
  - Canvas Background: Warm Ivory `#FAF8F5`
  - Primary Brand & Trust: Deep Forest Green `#1B4332`
  - Primary CTA Buttons: Warm Terracotta `#C85A32`
  - Progress Bars & Accents: Golden Amber `#D99B26`
  - Headings: Charcoal Ink `#1F2421` | Secondary Text: Muted Slate `#5C6660`
- **Typography:**
  - Editorial Serif (`Fraunces` or `Playfair Display`) for headings and milestone titles.
  - Clean Sans-Serif (`Plus Jakarta Sans` or `Inter`) with `tabular-nums` for currency figures and ledgers.

---

## 3. Category-Adaptive UI Copy Engine
Never use wedding-only words ("Shagun") on education or general pools. Dynamically map UI labels by pool `category`:

| Category Key | Primary CTA Label | Supporter Metric | Receipt Title |
| :--- | :--- | :--- | :--- |
| `wedding` | Send Aashirvaad & Shagun (₹0 Fee) | Blessings | Aashirvaad & Shagun Receipt |
| `education` | Support This Goal (₹0 Fee) | Supporters | Goal Support Receipt |
| `milestone` | Chip In for This Wish (₹0 Fee) | Contributors | Neev Gift & Wish Receipt |
| `universal` | Contribute to This Neev (₹0 Fee) | Supporters | Neev Contribution Receipt |

---

## 4. Two-Tier Legal, Tax & Document Architecture
1. **Non-Custodial Payment Flow:** Neev NEVER holds user funds in its own bank account. Use **Razorpay Route** or **Cashfree Easy Split** so UPI contributions settle directly into the KYC-verified creator's bank account. Restrict payments strictly to **domestic Indian INR / UPI rails** (FEMA & FCRA compliance).
2. **Checkout Clickwrap & Compliance:**
   - Capture contributor `name`, `relationship` (`Relative`, `Friend`, `Colleague`, `Well-Wisher`), and optional `message`.
   - If contribution `amount >= 50000`, dynamically require `contributor_pan` (for Income Tax Act Section 56(2)(x) compliance).
   - Require mandatory clickwrap checkbox before UPI intent: *"I confirm this is a voluntary Indian domestic gift (not a loan, investment, or purchase) and agree to the Terms & Gift Policy."* Log `consent_policy_version`, `consent_ip`, and UTC timestamp.
3. **Two-Tier PDF Outputs:**
   - **Contributor Receipt (Clean 1-Page PDF):** Warm, clutter-free receipt showing Receipt ID, Amount, Contributor Name, Recipient Name, Message, 12-digit **NPCI UPI UTR / Bank RRN**, Gateway Payment ID, SHA-256 hash, and a single-line footer referencing Upadhyay Technologies Pvt. Ltd. Terms.
   - **Creator CA Tax & Audit Bundle (Backend Export):** Consolidated PDF/CSV ledger with exact amounts, relationship tags, PAN numbers (for ₹50k+ gifts), NPCI UTRs, Payment Gateway Settlement Certificate, and digital signature block by Head of Legal & Compliance.
4. **Hosted Legal Hub (`/legal`):** Hosts full Terms of Service, Gift & Contribution Policy, and DPDP Privacy Policy citing IT Act 2000 (Sec 79 Safe Harbour, Sec 10A E-contracts), Indian Contract Act 1872 (Sec 25 Gift Irrevocability), Bharatiya Sakshya Adhiniyam 2023 (Sec 63), Income Tax Act (Sec 56(2)(x)), RBI PA Guidelines, PMLA 2002, FEMA/FCRA, DPDP Act 2023, and Arbitration & Conciliation Act 1996.

---

## 5. Tech Stack & Database Security Rules
- **Stack:** Next.js (App Router, TypeScript), Tailwind CSS, Supabase (Auth, PostgreSQL, Storage), Razorpay Route / Cashfree Easy Split, `@react-pdf/renderer` (for receipts), `@vercel/og` (for dynamic WhatsApp share cards).
- **Database Privacy Firewall (Supabase RLS):**
  - Lock `contributions` table with Row-Level Security so `SELECT` is permitted ONLY when `auth.uid() = wish_pools.creator_id`.
  - Serve public totals exclusively via a secure SQL view (`public_pool_stats`) returning only `COUNT(id)` and `SUM(amount)`.
  - Enforce idempotent webhook processing using unique `gateway_payment_id` and `npci_utr` constraints.

---

## 6. Build Sprints for Antigravity Agent
- **Sprint 1:** Scaffold Next.js + Tailwind theme tokens + Supabase schema (`wish_pools`, `contributions`, RLS policies, `public_pool_stats` view) + `category-copy.ts` helper + Create Neev wizard.
- **Sprint 2:** Build public/invite-only pool page (with PIN verification), 2-step UPI checkout drawer with dynamic ₹50k+ PAN validation, and webhook handler.
- **Sprint 3:** Build Creator Private Ledger dashboard, 1-page Contributor PDF Receipt generator, CA Legal & Tax Bundle PDF export, `/legal` policy pages, and below-the-fold contextual sponsor slots.