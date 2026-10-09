# SS — Struggle of Students 🌱

**Built by students. For students.**

A React + JavaScript **single-page website** for the Struggle of Students (SS) community. All sections live on one page, and the navigation bar smoothly scrolls to each section.

**Sections:** About · Opportunities · Campus Ambassadors · Events & Sessions · Talent · Services · Impact · Team · Join · Contact

Opportunity and event details open in a pop-up panel, with shareable links such as `/?opp=opp-1` or `/#ambassador`.

The team admin dashboard is available at `/admin`.

**Tech stack:** React, JavaScript, Tailwind CSS v4, Bricolage Grotesque, and Plus Jakarta Sans.

**Architecture:** Frontend only — no backend.

---

## 1. Setup and Installation

The website uses JavaScript and requires Node.js. To keep the development environment self-contained, Node.js is installed inside the Python virtual environment managed by **uv**, using `nodeenv`.

Nothing is installed globally, and `pip` is never used.

### Prerequisite

Install [uv](https://docs.astral.sh/uv/).

### Windows (PowerShell)

```powershell
cd ss-website
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

The setup script needs to be run only once.

Activate the environment whenever you open a new terminal:

```powershell
.\.venv\Scripts\Activate.ps1
```

Start the development server:

```powershell
npm run dev
```

Open http://localhost:5173 in your browser.

### macOS / Linux / Git Bash

Run the setup script once:

```bash
cd ss-website
bash setup.sh
```

Activate the environment whenever you open a new terminal:

```bash
source .venv/bin/activate
```

Start the development server:

```bash
npm run dev
```

### What the setup script does

If you prefer to run the setup steps manually:

```bash
uv sync
uv run nodeenv -p --node=22.22.0
```

Activate `.venv`, then install the JavaScript dependencies:

```bash
npm install
```

This creates the Python virtual environment, installs `nodeenv`, installs Node.js and npm inside the environment, and installs the project's JavaScript packages in `node_modules/`.

### Available Commands

| Command           | Description                                    |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Starts the development server with hot reload. |
| `npm run build`   | Creates a production build in `dist/`.         |
| `npm run preview` | Previews the production build locally.         |
| `npm run lint`    | Runs Oxlint to check the code.                 |

---

## 2. Brand: Colours, Fonts, and Logo

### Colours and Fonts

All brand colours and font definitions are maintained in `src/config/theme.css`.

**Palette A — Ocean**

`03045e` · `023e8a` · `0077b6` · `0096c7` · `00b4d8` · `48cae4` · `90e0ef` · `ade8f4` · `caf0f8`

**Palette B — Lagoon**

`004e64` · `00a5cf` · `9fffcb` · `25a18e` · `7ae582`

Edit the colour values in `src/config/theme.css` to update the branding across the website.

Components use utility classes such as `bg-ocean-900`, `text-brand`, and `bg-lagoon-mint`.

### Logo

The website uses the official SS logo.

* `src/assets/ss-logo-original.jpg` — Original, untouched logo.
* `ss-mark.png` — Cropped SS mark with student imagery, used in the navigation bar.
* `ss-logo-full.jpg` — Full logo used in the About section.
* `public/favicon.png` — Website favicon.
* `public/apple-touch-icon.png` — Apple touch icon.

### Website Configuration

The file `src/config/site.js` contains:

* Social media links (Instagram, X, YouTube, and WhatsApp community).
* Navigation bar section configuration.
* Contact information.
* Admin demo passcode.

---

## 3. Starting Content

The initial website content is **sample data created for demonstration purposes**. It makes the website look complete before real SS information is available.

The sample data includes:

* People and student profiles.
* Team members and leadership.
* Organisations and placements.
* Opportunities and events.
* Member, volunteer, and registration counts.
* Venues and other demonstration content.

The data is maintained in:

* `src/data/seed.js` — Initial website content.
* `src/data/people.js` — Sample student and people records.

Replace the sample data with real SS information through the admin dashboard when it becomes available.

**Admin sections:**

* **Leadership** — Manage leadership information.
* **Placements** — Manage placement information.

---

## 4. Admin Dashboard

Access the admin dashboard at:

`/admin`

**Demo passcode:** `ss-admin`

You can change the demo passcode in `src/config/site.js`.

### What You Can Manage

The admin dashboard supports managing:

* Talent profiles.
* Leadership and team information.
* Opportunities.
* Campus Ambassador applications.
* Events, volunteers, and registrations.
* Online sessions, capacities, meeting links, and registrations.
* Members and applications.
* Enquiries.
* Placements.
* Services.

Each list supports searching and CSV export.

### Automatic Capacity and Deadline Rules

* **Volunteer applications:** Applications close automatically when `volunteerCapacity` is reached. The website displays **"Volunteer Slots Full"**. Increase the capacity or remove a volunteer to reopen applications.
* **Online sessions:** Registration closes when the session's `capacity` is reached.
* **Opportunities:** Opportunities close automatically after their deadline or when their status is set to `Closed`.

### Important: Frontend-Only Limitations

The website does not currently have a backend. Data is stored in the browser's `localStorage`.

This means:

* Submissions are visible in the admin dashboard only in the same browser and on the same device.
* Data is not automatically shared between different users or devices.
* Clearing browser storage may delete saved data.
* The admin passcode is only a demonstration-level access check, not real security.
* Use **Export / Import Data** to back up or transfer stored data.

For a production website, connect a backend and implement proper authentication and access control.

---

## 5. Campus Ambassador Program

The `#ambassador` section explains the Campus Ambassador Program, including:

* How the program works.
* Ambassador responsibilities.
* Benefits and perks.
* Application submission.

College names are intentionally not displayed.

Colleges and organisations can also select **Partner with Us**, which pre-fills the contact form.

In the admin dashboard, use **Ambassadors** to review applications and update their status.

---

## 6. Adding a Backend Later

All data access is centralised in:

`src/services/api.js`

The pages and components use this service layer instead of accessing browser storage directly.

To connect a backend in the future, replace the relevant service function implementations with API requests using `fetch()` while maintaining the existing function names and return structures.

Possible backend options include:

* [Supabase](https://supabase.com/)
* [Firebase](https://firebase.google.com/)
* Node.js with Express.
* Django.

This architecture helps minimise the UI changes required when introducing a backend.

### Zoom Integration

Online sessions already include the following fields:

* `platform`
* `meetingLink`
* `zoomMeetingId` (reserved field)

The `registerForSession()` function contains a designated integration point for calling Zoom's meeting registrant API through a backend.

**Security note:** Never expose Zoom API keys or other secret credentials in frontend code. Store them securely on the backend.

---

## 7. Project Structure

```text
src/
├── config/
│   ├── theme.css
│   └── site.js
├── data/
│   ├── seed.js
│   └── people.js
├── services/
│   └── api.js
├── hooks/
│   ├── useCollection
│   └── useReveal
├── components/
│   ├── ui/
│   │   ├── Button
│   │   ├── Badge
│   │   ├── Modal
│   │   ├── Field
│   │   ├── Logo
│   │   ├── Avatar
│   │   ├── Banner
│   │   ├── Icon
│   │   ├── SectionHeader
│   │   └── Feedback
│   ├── cards/
│   │   ├── OpportunityCard
│   │   ├── EventCard
│   │   ├── ServiceCard
│   │   ├── PlacementCard
│   │   ├── SessionCard
│   │   ├── StatCard
│   │   └── VolunteerMeter
│   ├── forms/
│   │   ├── RegistrationForm
│   │   ├── QuickForm
│   │   └── ContactForm
│   ├── layout/
│   │   ├── Navbar
│   │   ├── Footer
│   │   ├── Layout
│   │   └── PageHero
│   └── sections/
│       └── ServiceModal
├── sections/
│   ├── HeroSection
│   ├── AboutSection
│   ├── OpportunitiesSection
│   ├── AmbassadorSection
│   ├── EventsSection
│   ├── ServicesSection
│   ├── ImpactSection
│   ├── TalentSection
│   ├── TeamSection
│   ├── JoinSection
│   └── ContactSection
└── pages/
    ├── Home
    └── admin/
```

*Note: File extensions and additional files are omitted from this overview for readability.*

---

## 8. Deployment

Build the production website:

```bash
npm run build
```

This generates a static production build in the `dist/` directory.

You can deploy the website using:

* [Netlify](https://www.netlify.com/)
* [Vercel](https://vercel.com/)
* [Cloudflare Pages](https://pages.cloudflare.com/)
* [GitHub Pages](https://pages.github.com/)

The `public/_redirects` file handles client-side routes on Netlify.

For other hosting platforms, configure an equivalent rewrite rule that serves `index.html` for application routes such as `/admin`.

**Deployment reminder:** The frontend-only architecture means browser-stored data will not automatically be shared between visitors, even when the site is publicly hosted.

---

## 9. Talent Photos and Credits

Talent profile photos use images from [Unsplash](https://unsplash.com/), loaded from its CDN.

Image credits are maintained in the `credit` field in `src/data/seed.js`.

The initial talent names, skills, and biographies are fictional demonstration content. Replace them with real SS student profiles and approved photos through **Admin → Talent**.

Ensure that you have permission to publish any real students' names, photos, and personal information before adding them to the website.

---

## About Struggle of Students

**Struggle of Students (SS)** is a student-focused community built around opportunities, collaboration, talent, events, services, and student impact.

*Built by students. For students.*

