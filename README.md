<div align="center">

# 🌐 Client — Public Web Portal
### Alumni Associations Dpian · পাবলিক ওয়েব পোর্টাল

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-purple)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-cyan)](https://tailwindcss.com)
[![i18n](https://img.shields.io/badge/i18next-Bilingual-green)](https://www.i18next.com)

> The public-facing bilingual (Bengali + English) SPA for alumni to browse profiles, register for events, donate to the welfare fund, read news, and contact the association.

</div>

---

## 📁 Project Structure

```
client/
├── public/
│   ├── alumni_logo.png          # Association logo
│   └── locales/
│       ├── en/translation.json  # English translations
│       └── bn/translation.json  # Bengali translations
├── src/
│   ├── api/
│   │   └── api.js               # Axios instance (base URL from env)
│   ├── components/
│   │   └── ui/
│   │       ├── Footer.jsx        # Site footer with partners marquee
│   │       ├── Navbar.jsx        # Bilingual top navigation bar
│   │       ├── IntroLoader.jsx   # Branded page intro animation
│   │       ├── SeatingPlanner.jsx # Event seating planner modal
│   │       └── ...Skeleton.jsx   # Loading skeleton placeholders
│   ├── context/
│   │   └── settings.jsx         # CMS site settings context provider
│   ├── pages/
│   │   ├── Home.jsx             # Landing page with hero, notices, events
│   │   ├── About.jsx            # About association + timeline
│   │   ├── Members.jsx          # Member directory with search & filter
│   │   ├── MemberDetail.jsx     # Individual member profile + digital ID
│   │   ├── Events.jsx           # Events listing + RSVP & registration
│   │   ├── Committee.jsx        # Committee listing page
│   │   ├── CommitteeDetail.jsx  # Detailed committee member profile
│   │   ├── Blog.jsx             # News & blog listing
│   │   ├── BlogDetail.jsx       # Single blog/news article
│   │   ├── Notices.jsx          # Notice board
│   │   ├── Gallery.jsx          # Photo gallery albums
│   │   ├── Donation.jsx         # Welfare fund donation flow
│   │   ├── Partners.jsx         # Sponsors & partners directory
│   │   ├── Contact.jsx          # Contact form page
│   │   ├── Login.jsx            # Member login page
│   │   ├── Register.jsx         # Member registration form
│   │   ├── UserDashboard.jsx    # Logged-in member dashboard
│   │   ├── Policies.jsx         # Privacy/Terms/Refund/Cookie policies
│   │   └── Developer.jsx        # Developer credit page
│   ├── utils/
│   │   └── image.js             # Cloudinary/local image URL helper
│   ├── styles/
│   │   └── index.css            # Tailwind base + custom animations & marquee CSS
│   └── main.jsx                 # App entry point with Router + i18n providers
├── .env.example                 # Environment variable template
├── index.html                   # HTML entry with fonts, meta, favicon
├── vite.config.js               # Vite configuration
└── tailwind.config.js           # Tailwind theme, colors, custom utilities
```

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and set:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

For production:
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
```

---

## 🚀 Development

```bash
npm install
npm run dev       # Start dev server on http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

---

## 🌍 Internationalization (i18n)

The client supports full **Bengali (bn)** and **English (en)** language switching via `i18next` + `react-i18next`.

- Translation files are in `public/locales/{en,bn}/translation.json`
- Language is persisted in `localStorage`
- The `isBn` flag is derived from `i18n.language === 'bn'` throughout components
- Bengali font: `Hind Siliguri` / `Noto Sans Bengali`
- English font: `Inter` / `Poppins`

---

## 🎨 Design System

### Color Palette
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#003B73` | Navigation, headings, links |
| `--secondary` | `#F9A826` | Accents, CTAs, highlights |
| `--accent` | `#4FC3F7` | Tags, badges, info chips |
| `--dark` | `#071426` | Dark backgrounds, footer |

### Animations
- `animate-float-glow` — Ambient floating glow for hero backgrounds
- `animate-marquee` — Forward infinite scrolling partner logos
- `animate-marquee-reverse` — Reverse infinite scrolling partner logos
- `animate-loadingBar` — Intro loader progress bar
- `animate-fadeIn` — Smooth element entrance transitions

---

## 🔌 Key API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/settings` | Fetch CMS site-wide settings |
| `GET` | `/members` | Paginated member listing |
| `GET` | `/events` | Upcoming & past events |
| `POST` | `/events/:id/register` | RSVP / event registration |
| `GET` | `/notices` | Notice board listing |
| `GET` | `/blogs` | Blog / news listing |
| `GET` | `/committee` | Committee member data |
| `GET` | `/partners` | Partners & sponsors list |
| `POST` | `/contact` | Submit contact form |
| `POST` | `/donations` | Submit donation record |
| `POST` | `/auth/login` | Member login |
| `POST` | `/auth/register` | New member registration |

---

## 📱 Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|---|---|---|
| `sm` | `640px` | Mobile landscape |
| `md` | `768px` | Tablets |
| `lg` | `1024px` | Small desktops |
| `xl` | `1280px` | Full desktops |
| `2xl` | `1536px` | Wide screens |

---

## 🧩 Real-time Features

The client connects to **Socket.io** on the server to receive:
- **Live notice push events** — New sticky notices appear on the notice board in real time
- **Real-time counter updates** — Member count & event attendance badges

---

© 2026 Practon Alumni Association
