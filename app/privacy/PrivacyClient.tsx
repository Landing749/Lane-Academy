'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, HardDrive, UserX, Eye, Trash2, Download } from 'lucide-react';

const SECTIONS = [
  {
    icon: UserX,
    color: '#4F7EF7',
    title: 'No sign-up required',
    content:
      'Lane Academy has no user accounts. You do not need to provide an email address, phone number, name, or any personal information to access any course. Just open the site and begin.',
  },
  {
    icon: Eye,
    color: '#7C5CE4',
    title: 'No personal information collected',
    content:
      'We do not collect any personally identifiable information at any point. There are no analytics that track who you are, no cookies that follow you across the web, and no profiles built from your behavior.',
  },
  {
    icon: HardDrive,
    color: '#2C9B6A',
    title: 'No journal entries or reflections uploaded',
    content:
      'When you write a journal entry or complete a reflection exercise, that content is saved only to your own browser\'s local storage. It is never transmitted to any server, never read by us, and never shared with anyone.',
  },
  {
    icon: ShieldCheck,
    color: '#0891B2',
    title: 'Progress stays only on your device',
    content:
      'Your completed lessons, module progress, bookmarks, and personal notes are stored locally on your device using browser-native storage technologies. Nothing leaves your device.',
  },
  {
    icon: Trash2,
    color: '#E85D75',
    title: 'Clearing browser storage removes local progress',
    content:
      'If you clear your browser\'s local storage or site data, your locally stored progress will be removed. This is intentional — it means your data truly lives with you, and only you control it. We recommend exporting your progress before clearing storage if you want to keep a copy.',
  },
  {
    icon: Download,
    color: '#D97706',
    title: 'You can export your progress at any time',
    content:
      'Lane Academy allows you to export all your locally stored progress as a JSON file at any time. This gives you a portable copy of your reflections, completed lessons, and journal entries that you can store anywhere you choose.',
  },
];

export default function PrivacyClient() {
  return (
    <div style={{ paddingTop: '68px' }}>
      {/* Header */}
      <section style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79,126,247,0.08) 0%, transparent 65%)',
          transform: 'translate(30%, -30%)',
          pointerEvents: 'none',
        }} />
        <div className="container-xl" style={{ maxWidth: 760, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Trust badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'var(--accent-light)',
              border: '1px solid rgba(79,126,247,0.2)',
              borderRadius: 20, padding: '6px 14px',
              marginBottom: '1.5rem',
            }}>
              <ShieldCheck size={14} style={{ color: 'var(--accent)' }} />
              <span style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>
                Transparency is a core value
              </span>
            </div>

            <h1 className="font-display" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontStyle: 'italic', fontWeight: 400,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              lineHeight: 1.08,
              marginBottom: '1.25rem',
            }}>
              Your privacy, plainly explained.
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: 580,
            }}>
              Lane Academy is built on a simple principle: your private thoughts, reflections,
              and learning progress belong to you and only you. Here's exactly how that works.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy sections */}
      <section className="section-pad" style={{ background: 'var(--bg)' }}>
        <div className="container-xl" style={{ maxWidth: 780 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {SECTIONS.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  style={{
                    display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                    padding: '1.75rem 2rem',
                    borderRadius: 18,
                    background: 'var(--surface)',
                    border: '1.5px solid var(--border)',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = section.color + '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{
                    width: 48, height: 48, flexShrink: 0,
                    borderRadius: 14,
                    background: section.color + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={22} color={section.color} />
                  </div>
                  <div>
                    <h2 style={{
                      fontWeight: 700, fontSize: '1.05rem',
                      color: 'var(--text-primary)',
                      margin: '0 0 0.6rem',
                      letterSpacing: '-0.015em',
                    }}>
                      {section.title}
                    </h2>
                    <p style={{
                      fontSize: '0.95rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {section.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* What IS collected note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{
              marginTop: '2.5rem',
              padding: '2rem',
              borderRadius: 18,
              background: 'var(--accent-lighter)',
              border: '1.5px solid rgba(79,126,247,0.15)',
            }}
          >
            <h3 style={{
              fontWeight: 700, fontSize: '1rem',
              color: 'var(--text-primary)',
              margin: '0 0 0.75rem',
            }}>
              One thing our course platform does use
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Lane Academy uses Firebase Realtime Database to deliver course content — titles,
              descriptions, categories, and other course metadata. This is read-only content
              delivery, like fetching a webpage. No user data is involved in this process.
              Cloudinary is used to host and deliver course images efficiently. Neither service
              receives any information about you or your learning activity.
            </p>
          </motion.div>

          {/* Last updated */}
          <p style={{
            color: 'var(--text-tertiary)', fontSize: '0.8rem',
            marginTop: '2rem', textAlign: 'center',
          }}>
            Privacy policy last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>
    </div>
  );
}
