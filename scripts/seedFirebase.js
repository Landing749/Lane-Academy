#!/usr/bin/env node
/**
 * Lane Academy — Firebase Realtime Database Seed Script
 *
 * Usage:
 *   1. Install the Firebase Admin SDK:
 *      npm install firebase-admin --save-dev
 *
 *   2. Download a service account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *      Save it as scripts/serviceAccountKey.json (already in .gitignore)
 *
 *   3. Run:
 *      node scripts/seedFirebase.js
 *
 * This script writes sample course data to your Realtime Database.
 * Run it once to get started, then manage courses directly in the Firebase Console.
 */

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lane-academy-default-rtdb.firebaseio.com',
});

const db = admin.database();

const now = Date.now();

const COURSES = [
  {
    title: 'How to Have Hard Conversations',
    slug: 'how-to-have-hard-conversations',
    description:
      'Most people avoid difficult conversations because they fear conflict, rejection, or saying the wrong thing. This course teaches you a simple, compassionate framework for navigating the conversations that matter most — with partners, family, friends, and colleagues.',
    shortDescription:
      'A practical framework for the conversations you keep putting off.',
    category: 'Communication',
    difficulty: 'Beginner',
    duration: '2h 15m',
    moduleCount: 5,
    tags: ['conflict', 'relationships', 'assertiveness', 'listening'],
    featured: true,
    published: true,
    createdAt: now - 7 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/hard-conversations',
      secureUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=800',
      width: 800,
      height: 480,
      alt: 'Two people having a meaningful conversation over coffee',
    },
  },
  {
    title: 'Understanding Your Emotions',
    slug: 'understanding-your-emotions',
    description:
      'Emotions aren\'t problems to fix — they\'re signals to understand. This course walks you through the science of emotions, how to identify what you\'re actually feeling, and how to respond rather than react when things get intense.',
    shortDescription:
      'Learn to read, name, and work with your emotions instead of against them.',
    category: 'Emotional Wellbeing',
    difficulty: 'Beginner',
    duration: '3h 00m',
    moduleCount: 6,
    tags: ['emotions', 'self-awareness', 'mental health', 'regulation'],
    featured: true,
    published: true,
    createdAt: now - 14 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/understanding-emotions',
      secureUrl: 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
      width: 800,
      height: 480,
      alt: 'Person journaling peacefully near a window',
    },
  },
  {
    title: 'Money Basics: A Calm Start',
    slug: 'money-basics-a-calm-start',
    description:
      'Finance doesn\'t have to be overwhelming. This course strips away the jargon and gives you a clear, honest foundation: how to track your spending, build a simple budget, start an emergency fund, and think about money without the anxiety.',
    shortDescription:
      'No jargon. No shame. Just a clear path to feeling in control of your money.',
    category: 'Money',
    difficulty: 'Beginner',
    duration: '2h 45m',
    moduleCount: 5,
    tags: ['budgeting', 'savings', 'personal finance', 'anxiety'],
    featured: true,
    published: true,
    createdAt: now - 21 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/money-basics',
      secureUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
      width: 800,
      height: 480,
      alt: 'Simple desk setup with notebook and plant',
    },
  },
  {
    title: 'Setting Boundaries That Actually Stick',
    slug: 'setting-boundaries-that-actually-stick',
    description:
      'Boundaries aren\'t walls — they\'re the agreements you make with people about how you want to be treated. This course shows you how to identify where your limits are, communicate them clearly, and hold them without guilt when they\'re pushed.',
    shortDescription:
      'Identify your limits, communicate them kindly, and hold them with confidence.',
    category: 'Relationships',
    difficulty: 'Intermediate',
    duration: '2h 30m',
    moduleCount: 4,
    tags: ['boundaries', 'self-respect', 'communication', 'relationships'],
    featured: false,
    published: true,
    createdAt: now - 5 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/boundaries',
      secureUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
      width: 800,
      height: 480,
      alt: 'Person reading calmly in a peaceful space',
    },
  },
  {
    title: 'Focus in a Distracted World',
    slug: 'focus-in-a-distracted-world',
    description:
      'Attention is the raw material of everything you want to build. This course explores why focus is so hard right now, how your environment shapes your ability to think, and practical systems for protecting your deep work time.',
    shortDescription:
      'Practical systems for protecting your attention in an age of constant interruption.',
    category: 'Productivity',
    difficulty: 'Beginner',
    duration: '1h 50m',
    moduleCount: 4,
    tags: ['focus', 'deep work', 'habits', 'distraction'],
    featured: false,
    published: true,
    createdAt: now - 3 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/focus',
      secureUrl: 'https://images.unsplash.com/photo-1467238307901-8fcc45f9ed97?w=800',
      width: 800,
      height: 480,
      alt: 'Clean minimal desk with single notebook',
    },
  },
  {
    title: 'Navigating Career Uncertainty',
    slug: 'navigating-career-uncertainty',
    description:
      'Whether you\'re stuck in the wrong job, at a crossroads, or just starting out, career uncertainty is deeply uncomfortable. This course helps you get clarity on what you actually want, how to make decisions under uncertainty, and how to move forward without a perfect plan.',
    shortDescription:
      'Get clarity on what you want and permission to move without a perfect plan.',
    category: 'Career',
    difficulty: 'Intermediate',
    duration: '3h 20m',
    moduleCount: 6,
    tags: ['career', 'decision making', 'clarity', 'transitions'],
    featured: false,
    published: true,
    createdAt: now - 10 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/career-uncertainty',
      secureUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      width: 800,
      height: 480,
      alt: 'Person standing at a crossroads on a country path',
    },
  },
  {
    title: 'The Art of Listening',
    slug: 'the-art-of-listening',
    description:
      'Most of us listen to respond, not to understand. This course teaches the rarely-taught skill of genuinely hearing people — what gets in the way, how to be fully present in conversation, and why listening is one of the most powerful things you can offer someone.',
    shortDescription:
      'One of the rarest gifts you can give someone is your full attention.',
    category: 'Communication',
    difficulty: 'Beginner',
    duration: '1h 40m',
    moduleCount: 3,
    tags: ['listening', 'empathy', 'presence', 'connection'],
    featured: false,
    published: true,
    createdAt: now - 1 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/listening',
      secureUrl: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800',
      width: 800,
      height: 480,
      alt: 'Two people listening intently in warm conversation',
    },
  },
  {
    title: 'Building Self-Compassion',
    slug: 'building-self-compassion',
    description:
      'We\'re often our own harshest critics. Self-compassion isn\'t self-indulgence — it\'s the practice of treating yourself with the same kindness you\'d offer a friend. This course draws on research-backed practices to help you quiet your inner critic and build resilience.',
    shortDescription:
      'Learn to treat yourself with the same kindness you extend to people you love.',
    category: 'Personal Growth',
    difficulty: 'Beginner',
    duration: '2h 20m',
    moduleCount: 5,
    tags: ['self-compassion', 'inner critic', 'mindfulness', 'resilience'],
    featured: true,
    published: true,
    createdAt: now - 18 * 24 * 60 * 60 * 1000,
    updatedAt: now,
    cover: {
      publicId: 'lane-academy/courses/self-compassion',
      secureUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800',
      width: 800,
      height: 480,
      alt: 'Person sitting peacefully in nature',
    },
  },
];

async function seed() {
  console.log('🌱 Seeding Lane Academy Firebase Realtime Database…\n');

  const coursesRef = db.ref('courses');

  // Clear existing courses (optional — comment out to append instead)
  await coursesRef.remove();
  console.log('🗑  Cleared existing courses\n');

  for (const course of COURSES) {
    const newRef = coursesRef.push();
    await newRef.set(course);
    console.log(`✅ ${course.title}`);
  }

  console.log(`\n🎉 Seeded ${COURSES.length} courses successfully!`);
  console.log('   Open your Firebase Console to verify:');
  console.log('   https://console.firebase.google.com/project/lane-academy/database\n');

  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
