# Blood Bridge

Blood Bridge is a real-time donor coordination platform that helps blood bank teams find and re-engage eligible donors faster while guiding donors through safe, official donation workflows.

> Clinical rule: Blood Bridge supports communication and scheduling. It does **not** replace medical screening or clinical decision-making.

---

## Judge criteria alignment (5 principles)

### 1) Problem

**One-sentence problem statement**  
Blood services struggle to quickly match urgent blood needs with eligible donors, while willing donors often lack timely guidance on when, where, and how to donate.

**Who has the problem (demographic)**  
- **Primary users:** blood bank staff, donor coordinators, and hospital transfusion teams  
- **End users:** existing donors and potential donors in communities served by participating blood centers

**Story behind the problem**  
When a critical request is raised, teams often rely on fragmented calls, spreadsheets, and manual outreach. This slows response time, increases no-shows, and makes it difficult to track who is eligible, contacted, and booked.

**Proof / real-world evidence (for judges + deck)**  
- Blood and blood components are essential and cannot be manufactured on demand (WHO).  
- Blood systems regularly face urgent, type-specific shortages due to limited supply and shelf-life constraints (WHO, Red Cross communications).  
- This is an operational coordination problem, not only a donor willingness problem.

Reference sources:
- WHO: https://www.who.int/news-room/fact-sheets/detail/blood-safety-and-availability  
- WHO Blood products: https://www.who.int/health-topics/blood-products

### 2) Impact of problem (real-world impact)

If this coordination gap is not solved, teams lose time in urgent workflows and donors churn due to poor follow-up.

**Impact areas Blood Bridge targets**
- **Time saved:** faster matching and response tracking
- **Operational efficiency:** less manual outreach and duplicate effort
- **Service reliability:** better readiness for urgent blood needs
- **Scalability:** center-level -> city-level -> national coordination model

### 3) Implementation (demo + messaging)

**Current status:** MVP is working and demo-ready.

**MVP capabilities**
- Role-based auth and routing (`donor`, `blood_bank_staff`, `admin`)
- Donor profile, eligibility progress, appointments, and alerts
- Staff request creation, donor filtering, alerts, and appointment coordination
- Realtime updates across donor/staff views
- AI-assisted outreach suggestions (OpenRouter with rule-based fallback)
- SMS dispatch flow via Twilio (server-side)

**Simple demo story**
1. Staff creates an urgent blood request.
2. App generates outreach suggestions and sends donor alerts.
3. Donor responds (`interested`, `booked`, `unavailable`).
4. Staff dashboard updates in realtime with responses.

**Execution philosophy**
- Deliver a working MVP first.
- Layer enhancements (polish, animation, advanced messaging) on top.

### 4) M-factor (wow factor) and value framing

**Why this product is valuable**
- Converts donor willingness into coordinated action.
- Reduces friction from "blood needed" to "donor booked."
- Increases confidence for both staff and donors.

**4 Cs**
- **Clarity:** clear donor vs staff journeys
- **Customer vs end user:** built for blood service operations (customer) and donors (end users)
- **Concise:** "From urgent request to booked donor in one flow."
- **Correct + Confidence:** plain language, reliable role-based behavior, realtime visibility

### 5) Execution of solution

**How close is this to a real product?**  
It is deployment-ready as an MVP.

Readiness signals:
- Production-capable stack (Next.js + Supabase + Vercel)
- Auth + RLS + migrations + seed data in place
- Realtime updates wired to core operational pages
- Environment-driven AI/SMS integrations
- Demo-ready UX and route protection

---

## Product overview

### Tech stack
- **Frontend:** Next.js (App Router, TypeScript, Server Actions)
- **Backend/Auth/DB/Realtime:** Supabase (Postgres, RLS, Realtime, Auth)
- **Deployment:** Vercel

### Core roles
- `donor`
- `blood_bank_staff`
- `admin`

### Core feature set

**Donor**
- Secure signup/login
- Profile and eligibility tracker
- Appointment booking/history
- Donation history and next eligibility visibility
- Realtime alert inbox + response actions
- Donation center finder

**Blood bank staff**
- Dashboard analytics
- Blood request creation and management
- Donor search/filtering
- Alert dispatch + response tracking
- Appointment coordination
- AI-assisted outreach support

---

## App routes

- `/` landing page
- `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password`
- `/dashboard` role-aware redirect
- Donor: `/donor`, `/donor/profile`, `/donor/appointments`, `/donor/alerts`, `/donor/donations`
- Staff: `/staff`, `/staff/donors`, `/staff/requests`, `/staff/appointments`, `/staff/alerts`
- Shared: `/centres`

---

## Database schema and seed

### Migrations
- `supabase/migrations/202603150101_init_blood_bridge.sql`
- `supabase/migrations/202603150201_ensure_demo_blood_centers.sql`

Tables:
- `profiles`
- `donor_profiles`
- `blood_centers`
- `donor_verification_steps`
- `appointments`
- `donation_history`
- `blood_requests`
- `donor_alerts`
- `donor_alert_responses`
- `notifications`

### Seed
- `supabase/seed.sql`
- Includes donors, staff, centers, requests, appointments, alerts, and responses

---

## How to run the software

### Prerequisites
- Node.js 20+
- npm 10+
- Supabase project (hosted or local CLI)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
```bash
cp .env.example .env.local
```

Set values in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://hospital-donor-app.vercel.app

OPENROUTER_API_KEY=...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=openai/gpt-4o-mini

TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_FROM_NUMBER=+17712521684
TWILIO_MESSAGING_SERVICE_SID=MGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_STATUS_CALLBACK_URL=https://hospital-donor-app.vercel.app/api/twilio/sms/status
```

### 3) Apply schema and seed

Hosted Supabase:
- Run migration files + `supabase/seed.sql` in Supabase SQL Editor.

Supabase CLI:
```bash
supabase db push
supabase db reset --seed
```

### 4) Start the app
```bash
npm run dev
```

Open `http://localhost:3000`.

### 5) Validate
```bash
npm run lint
npm run build
```

---

## Role assignment for real auth users

New signups default to `donor`. Promote staff/admin with SQL:

```sql
update public.profiles
set role = 'blood_bank_staff'
where email = 'staff-user@example.com';
```

```sql
update public.profiles
set role = 'admin'
where email = 'admin-user@example.com';
```

---

## Deployment (Vercel + Supabase + Twilio)

1. Import repo to Vercel.
2. Add environment variables from `.env.example`.
3. Ensure Supabase migrations and seed are applied in production.
4. In Supabase Auth settings, include:
   - `https://hospital-donor-app.vercel.app/auth/callback`
   - `https://hospital-donor-app.vercel.app/dashboard`
5. Configure Twilio inbound webhook:
   - URL: `https://hospital-donor-app.vercel.app/api/twilio/sms/reply`
   - Method: `POST`
6. Deploy and verify login, callback routing, request creation, and realtime response updates.

---

## Professional demo checklist

- [ ] Environment variables set in local + Vercel
- [ ] Migrations + seed applied
- [ ] At least one donor and one staff account available
- [ ] Staff can create request and send alerts
- [ ] Donor can respond to alerts
- [ ] Staff sees realtime response changes
- [ ] `npm run build` passes

---

## Roadmap (post-hackathon)

- Operational analytics and audit reporting
- Enhanced donor retention workflows
- Multi-center regional coordination dashboard
- Forecast-assisted planning layer (future phase)
