# SS — Struggle of Students 🌱

*Built by students. For students.*

React + JavaScript **single-page** site for the SS community. Every section lives on one page and
the navbar smooth-scrolls to it: About · Opportunities · Campus Ambassadors · Events & sessions ·
Talent · Services · Impact · Team · Join · Contact. Opportunity and event details open in a pop-up panel
(shareable links like `/?opp=opp-1` or `/#ambassador`). The team admin dashboard is at `/admin`.
**Frontend only — no backend.** Styling: Tailwind CSS v4. Fonts: Bricolage Grotesque + Plus Jakarta Sans.

---

## 1. Setup (uv + venv, no pip)

The site itself is JavaScript, so it needs Node.js. To keep everything inside a virtual
environment managed by **uv**, Node is installed *into* `.venv` with `nodeenv`
(declared in `pyproject.toml`). Nothing is installed globally and pip is never used.

**Prerequisite:** [uv](https://docs.astral.sh/uv/) installed.

### Windows (PowerShell)
```powershell
cd ss-website
powershell -ExecutionPolicy Bypass -File .\setup.ps1   # one time
.\.venv\Scripts\Activate.ps1                           # every new terminal
npm run dev                                            # http://localhost:5173
```

### macOS / Linux / Git Bash
```bash
cd ss-website
bash setup.sh                 # one time
source .venv/bin/activate     # every new terminal
npm run dev
```

What the setup script does (if you prefer typing it yourself):
```bash
uv sync                               # creates .venv and installs nodeenv into it
uv run nodeenv -p --node=22.22.0      # puts node + npm inside .venv
# activate .venv, then:
npm install                           # JS packages go to ./node_modules
```

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |

---

## 2. Brand: colours, fonts, logo

* **Colours & fonts:** `src/config/theme.css` is the *only* place they are defined.
  - Palette A “ocean”: `03045e 023e8a 0077b6 0096c7 00b4d8 48cae4 90e0ef ade8f4 caf0f8`
  - Palette B “lagoon”: `004e64 00a5cf 9fffcb 25a18e 7ae582`
  - Edit a hex there and the whole site updates. Components use classes such as
    `bg-ocean-900`, `text-brand`, `bg-lagoon-mint`.
* **Logo:** the official SS logo. `src/assets/ss-logo-original.jpg` is the untouched file;
  `ss-mark.png` (SS + student, used in the navbar), `ss-logo-full.jpg` (About section) and
  `public/favicon.png` / `apple-touch-icon.png` are cropped from it.
* **Socials, navbar sections, admin passcode:** `src/config/site.js`. SS is contacted through
  its social handles (Instagram, X, YouTube, WhatsApp community) and the contact form.

---

## 3. Starting content

The launch content (people, team, organisations, member / volunteer / registration counts, venues) is **invented** so the
site looks complete. It lives in `src/data/seed.js` (invented student records come from `src/data/people.js`); replace it with real SS data through the
admin dashboard whenever it's ready. Leadership: Admin → Leadership. Placements: Admin → Placements.

---

## 4. Admin dashboard: `/admin`

Demo passcode: **`ss-admin`** (change it in `src/config/site.js`).

Manage: talent profiles, leadership, opportunities, Campus Ambassador applications, events (incl. volunteer capacity, volunteers and registrations),
online sessions (capacity, meeting link, registrations), members, applications,
enquiries, placements, and services. Each list can be searched and exported as CSV.

**Capacity rules (enforced automatically):**
* Volunteer applications stop when `volunteerCapacity` is reached, and the site shows **“Volunteer Slots Full”**.
  Raise the capacity or remove a volunteer to reopen applications.
* Session registration closes when `capacity` is reached.
* Opportunities close automatically after their deadline, or when set to *Closed*.

> ⚠️ **Frontend-only limitation:** with no backend, data is saved in the **browser’s
> localStorage**. Submissions are visible in Admin only on the same browser/device, and the
> passcode is not real security. Use *Export / Import data* to back up or move data.

---

## 5. Campus Ambassador Program

The `#ambassador` section explains the program (how it works, what ambassadors do, perks),
and collects ambassador applications. (College names are intentionally not shown.)
Colleges and organisations can also click *Partner with us*, which pre-fills the contact form.
In Admin: **Ambassadors** (review applications, set status).

## 6. Adding a backend later

All data access goes through **`src/services/api.js`**. Pages never touch storage
directly. To connect a real backend (Supabase, Firebase, Node/Express, Django…), replace the
function bodies with `fetch()` calls and keep the same names and return shapes. No UI code
needs to change.

**Zoom:** sessions already have `platform`, `meetingLink` and a reserved `zoomMeetingId`.
`registerForSession()` has a marked spot for calling Zoom’s *add meeting registrant* API from
your backend. Never put Zoom API keys in frontend code.

---

## 7. Project structure

```
src/
  config/        theme.css (palette + fonts), site.js (contact, socials, lists)
  data/          seed.js — starting content (invented launch data)
  services/      api.js — the single data layer (swap for a backend later)
  hooks/         useCollection, useReveal
  components/
    ui/          Button, Badge, Modal, Field, Logo, Avatar, Banner, Icon, SectionHeader, Feedback
    cards/       OpportunityCard, EventCard, ServiceCard, PlacementCard,
                 SessionCard, StatCard, VolunteerMeter
    forms/       RegistrationForm, QuickForm, ContactForm
    layout/      Navbar, Footer, Layout (+ PageHero)
    sections/    ServiceModal
  sections/      HeroSection, AboutSection, OpportunitiesSection, AmbassadorSection,
                 EventsSection (events + online sessions), ServicesSection, ImpactSection,
                 TalentSection, TeamSection (Founder & Directors), JoinSection, ContactSection
  pages/         Home (stacks all sections), admin/
```

## 8. Deploying

`npm run build` creates a static `dist/` folder that can be hosted on Netlify, Vercel,
Cloudflare Pages or GitHub Pages. `public/_redirects` handles client-side routes on Netlify.
On other hosts, add an equivalent “rewrite all routes to /index.html” rule.

## Talent photos

Talent photos are real photos from Unsplash, free to use under the Unsplash licence and loaded
from Unsplash's CDN. Credits are kept in `src/data/seed.js` (`credit` field). Names, talents and bios are
invented. Swap in real SS students and their photos via Admin → Talent.
