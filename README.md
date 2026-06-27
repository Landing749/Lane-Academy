# Lane Academy

> **Learn the skills life doesn't always teach.**

A modern, privacy-first educational platform built with Next.js 16, Firebase Realtime Database, and Cloudinary. No accounts. No tracking. All learner progress stays on the user's device.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| Icons | Lucide React |
| Course content | Firebase Realtime Database |
| Media | Cloudinary (f_auto, q_auto, responsive) |
| Progress storage | Browser LocalStorage (device-only) |
| Dark mode | next-themes |

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Firebase Setup

### 1. Realtime Database Rules

In the Firebase Console, go to **Realtime Database → Rules** and paste the contents of `firebase-rules.json`:

```json
{
  "rules": {
    "courses": {
      ".read": true,
      ".write": false
    }
  }
}
```

### 2. Seed sample course data

```bash
# Install firebase-admin (dev only)
npm install firebase-admin --save-dev

# Download service account key from Firebase Console:
# Project Settings → Service Accounts → Generate new private key
# Save as: scripts/serviceAccountKey.json

# Run the seed script
node scripts/seedFirebase.js
```

This populates 8 sample courses across all categories.

### 3. Adding courses manually

In the Firebase Console, navigate to **Realtime Database** and add courses under the `courses/` node using this structure:

```
courses/
  -NxABC123/
    title: "How to Have Hard Conversations"
    slug: "how-to-have-hard-conversations"
    shortDescription: "A practical framework..."
    description: "Full description..."
    category: "Communication"
    difficulty: "Beginner"
    duration: "2h 15m"
    moduleCount: 5
    tags: ["conflict", "relationships"]
    featured: true
    published: true
    createdAt: 1719446400000
    updatedAt: 1719446400000
    cover/
      publicId: "lane-academy/courses/cover-image"
      secureUrl: "https://res.cloudinary.com/..."
      width: 800
      height: 480
      alt: "Description of image"
```

Only courses where `published === true` are displayed.

---

## Cloudinary Setup

1. Log in to [Cloudinary](https://cloudinary.com)
2. Cloud name is already configured: `damr6r9op`
3. Upload course cover images to your Cloudinary library
4. Copy the **Public ID** (e.g. `lane-academy/courses/my-course`) into Firebase

The app automatically applies:
- `f_auto` — serve WebP/AVIF where supported
- `q_auto` — smart quality compression
- Responsive sizing per context

---

## Project Structure

```
lane-academy/
├── app/
│   ├── layout.tsx           # Root layout + metadata
│   ├── page.tsx             # Homepage
│   ├── not-found.tsx        # Custom 404
│   ├── globals.css          # Design tokens + global styles
│   ├── about/               # About page
│   ├── privacy/             # Privacy page
│   └── courses/
│       ├── page.tsx         # Course catalog (Suspense wrapper)
│       ├── CoursesClient.tsx # Catalog UI with search + filters
│       └── [slug]/          # Individual course pages
│           ├── page.tsx
│           └── CoursePageClient.tsx
├── components/
│   ├── Navigation.tsx       # Sticky nav + dark mode toggle
│   ├── Footer.tsx
│   ├── HeroSection.tsx      # Animated orb hero
│   ├── FeaturedCategories.tsx
│   ├── FeaturedCourses.tsx  # Firebase realtime feed
│   ├── CourseCard.tsx       # Cloudinary cover + metadata card
│   ├── WhyLaneAcademy.tsx
│   ├── PrivacyHighlight.tsx
│   └── ThemeProvider.tsx
├── hooks/
│   └── useCourses.ts        # Firebase listener + filter/sort logic
├── lib/
│   ├── firebase.ts          # Firebase config + realtime helpers
│   ├── cloudinary.ts        # URL builder + srcset generator
│   ├── storage.ts           # LocalStorage progress engine
│   └── categories.ts        # Category metadata + colors
├── types/
│   └── index.ts             # Course, Progress, Journal types
└── scripts/
    └── seedFirebase.js      # One-time DB seeder
```

---

## Privacy Architecture

**Nothing about the learner is ever sent to a server.**

| Data | Storage | Sent to server? |
|---|---|---|
| Course content | Firebase RTDB | Read-only, public |
| Lesson progress | Browser LocalStorage | ❌ Never |
| Journal entries | Browser LocalStorage | ❌ Never |
| Reflections | Browser LocalStorage | ❌ Never |
| Bookmarks | Browser LocalStorage | ❌ Never |

Users can export all local data as a JSON bundle from the course page.

---

## Deployment

### Vercel (recommended)

```bash
npx vercel
```

Add environment variables in the Vercel dashboard if moving config out of source files.

### Self-hosted

```bash
npm run build
npm start
```

---

## Roadmap

- [ ] Full lesson player with rich text content
- [ ] Interactive reflection worksheets
- [ ] Progress export as PDF
- [ ] Completion certificates (generated locally)
- [ ] PWA / offline mode
- [ ] Course collections + favorites
- [ ] Daily streak tracking (local)
- [ ] Multi-language support
- [ ] Reading time tracking

---

Built with care by **AthStudios**
