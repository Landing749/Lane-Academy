'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Plus, Edit3, Trash2, Eye, EyeOff,
  Star, StarOff, Upload, X, Check, AlertCircle, Loader2,
  Search, Globe, Lock,
} from 'lucide-react';
import {
  adminLogin, adminLogout, onAdminAuthChange,
  adminSubscribeAllCourses, adminCreateCourse,
  adminUpdateCourse, adminDeleteCourse, adminToggleField,
  type CourseInput,
} from '@/lib/firebase';
import { CATEGORIES, DIFFICULTY_COLORS } from '@/lib/categories';
import { buildCloudinaryUrl } from '@/lib/cloudinary';
import type { User } from 'firebase/auth';
import type { Course, Category, Difficulty } from '@/types';

// ─── Cloudinary unsigned upload ───────────────────────────────────────────────
const CLOUD_NAME = 'damr6r9op';
const UPLOAD_PRESET = 'org-resources';

async function uploadToCloudinary(file: File, folder = 'lane-academy/courses'): Promise<{
  publicId: string; secureUrl: string; width: number; height: number;
}> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  fd.append('folder', folder);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST', body: fd,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return {
    publicId: data.public_id,
    secureUrl: data.secure_url,
    width: data.width,
    height: data.height,
  };
}

// ─── Blank form state ─────────────────────────────────────────────────────────
function blankForm(): Partial<CourseInput> {
  return {
    title: '', slug: '', shortDescription: '', description: '',
    category: 'Personal Growth', difficulty: 'Beginner',
    duration: '', moduleCount: 1,
    tags: [], featured: false, published: false,
    createdAt: Date.now(), updatedAt: Date.now(),
    cover: { publicId: '', secureUrl: '', width: 0, height: 0, alt: '' },
  };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.875rem 1.25rem',
        background: type === 'success' ? '#2C9B6A' : '#E85D75',
        color: 'white', borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        fontSize: '0.9rem', fontWeight: 600, maxWidth: 360,
      }}
    >
      {type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', marginLeft: 'auto', display: 'flex' }}>
        <X size={14} />
      </button>
    </motion.div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }: {
  message: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'var(--surface)', borderRadius: 16,
          border: '1px solid var(--border)', padding: '2rem',
          maxWidth: 400, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
      >
        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Are you sure?
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '0.6rem 1.2rem', borderRadius: 10,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600,
            fontFamily: 'inherit', fontSize: '0.875rem',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '0.6rem 1.2rem', borderRadius: 10,
            background: '#E85D75', border: 'none',
            color: 'white', cursor: 'pointer', fontWeight: 600,
            fontFamily: 'inherit', fontSize: '0.875rem',
          }}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Course Form Modal ────────────────────────────────────────────────────────
function CourseFormModal({
  initial, onSave, onClose,
}: {
  initial: Partial<CourseInput> | null;
  onSave: (data: CourseInput) => Promise<void>;
  onClose: () => void;
}) {
  const isEdit = !!initial?.title;
  const [form, setForm] = useState<Partial<CourseInput>>(initial ?? blankForm());
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set_ = <K extends keyof CourseInput>(k: K, v: CourseInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (t: string) => {
    setForm((f) => ({ ...f, title: t, slug: isEdit ? f.slug : slugify(t) }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags?.includes(t)) {
      set_('tags', [...(form.tags ?? []), t]);
      setTagInput('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setUploadError('');
    try {
      const result = await uploadToCloudinary(file);
      setForm((f) => ({
        ...f,
        cover: {
          publicId: result.publicId,
          secureUrl: result.secureUrl,
          width: result.width,
          height: result.height,
          alt: f.cover?.alt ?? f.title ?? '',
        },
      }));
    } catch {
      setUploadError('Upload failed. Check your Cloudinary preset is set to "Unsigned".');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!form.title?.trim()) return alert('Title is required');
    if (!form.slug?.trim()) return alert('Slug is required');
    if (!form.shortDescription?.trim()) return alert('Short description is required');
    setSaving(true);
    try {
      await onSave({
        ...blankForm(),
        ...form,
        updatedAt: Date.now(),
        createdAt: form.createdAt ?? Date.now(),
      } as CourseInput);
    } finally {
      setSaving(false);
    }
  };

  const input = (label: string, key: keyof CourseInput, type = 'text', placeholder = '') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={(form[key] as string | number) ?? ''}
        onChange={(e) => {
          const v = type === 'number' ? Number(e.target.value) : e.target.value;
          if (key === 'title') { handleTitleChange(e.target.value); }
          else set_(key, v as CourseInput[typeof key]);
        }}
        style={{
          padding: '0.65rem 0.875rem', borderRadius: 10,
          background: 'var(--bg)', border: '1.5px solid var(--border)',
          color: 'var(--text-primary)', fontSize: '0.9rem',
          outline: 'none', fontFamily: 'inherit',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
      />
    </div>
  );

  const coverUrl = form.cover?.publicId
    ? buildCloudinaryUrl(form.cover.publicId, { width: 400, height: 240 })
    : form.cover?.secureUrl;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '1.5rem', overflowY: 'auto',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        style={{
          background: 'var(--surface)', borderRadius: 20,
          border: '1px solid var(--border)',
          width: '100%', maxWidth: 740,
          boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
        }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
            {isEdit ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--bg)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}>
            <X size={15} />
          </button>
        </div>

        {/* Form body */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

          {/* Cover image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Cover Image
            </label>
            <div style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap',
            }}>
              {/* Preview */}
              <div style={{
                width: 180, height: 110, borderRadius: 10, overflow: 'hidden',
                background: 'var(--surface-2)', border: '1.5px solid var(--border)',
                flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.75rem', padding: '0.5rem' }}>
                    No image yet
                  </div>
                )}
                {uploading && (
                  <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Loader2 size={22} color="white" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload}
                  style={{ display: 'none' }} id="cover-upload" />
                <label htmlFor="cover-upload" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1rem', borderRadius: 10,
                  background: 'var(--accent-light)', color: 'var(--accent)',
                  border: '1.5px solid rgba(79,126,247,0.25)',
                  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                  width: 'fit-content',
                }}>
                  <Upload size={14} />
                  {uploading ? 'Uploading…' : 'Upload image'}
                </label>
                {uploadError && (
                  <p style={{ color: '#E85D75', fontSize: '0.78rem', margin: 0 }}>{uploadError}</p>
                )}
                {form.cover?.publicId && (
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', margin: 0, wordBreak: 'break-all' }}>
                    ID: {form.cover.publicId}
                  </p>
                )}
                {/* Alt text */}
                <input
                  placeholder="Alt text (describe image)"
                  value={form.cover?.alt ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, cover: { ...(f.cover ?? { publicId: '', secureUrl: '', width: 0, height: 0, alt: '' }), alt: e.target.value } }))}
                  style={{
                    padding: '0.55rem 0.8rem', borderRadius: 8,
                    background: 'var(--bg)', border: '1.5px solid var(--border)',
                    color: 'var(--text-primary)', fontSize: '0.82rem',
                    outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                />
              </div>
            </div>
          </div>

          {/* 2-col grid for core fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {input('Title *', 'title', 'text', 'e.g. How to Have Hard Conversations')}
            {input('Slug *', 'slug', 'text', 'e.g. how-to-have-hard-conversations')}
          </div>

          {/* Short description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Short Description *
            </label>
            <textarea
              placeholder="One sentence shown on course cards…"
              value={form.shortDescription ?? ''}
              onChange={(e) => set_('shortDescription', e.target.value)}
              rows={2}
              style={{
                padding: '0.65rem 0.875rem', borderRadius: 10, resize: 'vertical',
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.9rem',
                outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Full description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Full Description
            </label>
            <textarea
              placeholder="Shown on the course detail page…"
              value={form.description ?? ''}
              onChange={(e) => set_('description', e.target.value)}
              rows={4}
              style={{
                padding: '0.65rem 0.875rem', borderRadius: 10, resize: 'vertical',
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.9rem',
                outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Row: category, difficulty, duration, modules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {/* Category */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => set_('category', e.target.value as Category)}
                style={{
                  padding: '0.65rem 0.875rem', borderRadius: 10,
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => set_('difficulty', e.target.value as Difficulty)}
                style={{
                  padding: '0.65rem 0.875rem', borderRadius: 10,
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
                }}
              >
                {['Beginner', 'Intermediate', 'Advanced'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            {input('Duration', 'duration', 'text', 'e.g. 2h 30m')}

            {/* Modules */}
            {input('Modules', 'moduleCount', 'number', '1')}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Tags
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.4rem' }}>
              {(form.tags ?? []).map((tag) => (
                <span key={tag} style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '3px 10px', borderRadius: 20,
                  background: 'var(--accent-light)', color: 'var(--accent)',
                  fontSize: '0.78rem', fontWeight: 600,
                }}>
                  {tag}
                  <button onClick={() => set_('tags', form.tags?.filter((t) => t !== tag) ?? [])}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', padding: 0 }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                placeholder="Add a tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                style={{
                  flex: 1, padding: '0.6rem 0.875rem', borderRadius: 10,
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '0.875rem',
                  outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
              <button onClick={addTag} style={{
                padding: '0.6rem 1rem', borderRadius: 10,
                background: 'var(--accent-light)', color: 'var(--accent)',
                border: '1.5px solid rgba(79,126,247,0.25)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem',
                fontFamily: 'inherit',
              }}>Add</button>
            </div>
          </div>

          {/* Toggles */}
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {([
              { key: 'published', label: 'Published', desc: 'Visible on the public site' },
              { key: 'featured', label: 'Featured', desc: 'Shown in homepage highlights' },
            ] as const).map(({ key, label, desc }) => (
              <label key={key} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer',
              }}>
                <div
                  onClick={() => set_(key, !form[key])}
                  style={{
                    width: 44, height: 24, borderRadius: 12, position: 'relative',
                    background: form[key] ? 'var(--accent)' : 'var(--border)',
                    transition: 'background 0.2s ease', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2,
                    left: form[key] ? 22 : 2,
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'white',
                    transition: 'left 0.2s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }} />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0 }}>{label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          padding: '1.25rem 1.5rem',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface-2)',
        }}>
          <button onClick={onClose} style={{
            padding: '0.7rem 1.25rem', borderRadius: 10,
            background: 'transparent', border: '1.5px solid var(--border)',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit',
          }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            style={{
              padding: '0.7rem 1.5rem', borderRadius: 10,
              background: saving || uploading ? 'var(--text-tertiary)' : 'var(--accent)',
              color: 'white', border: 'none',
              cursor: saving || uploading ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: '0.875rem', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : isEdit ? 'Save changes' : 'Create course'}
          </button>
        </div>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Course row card ──────────────────────────────────────────────────────────
function CourseRow({
  course, onEdit, onDelete, onToggle,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (field: 'published' | 'featured', val: boolean) => void;
}) {
  const cat = CATEGORIES.find((c) => c.name === course.category);
  const diff = DIFFICULTY_COLORS[course.difficulty] ?? DIFFICULTY_COLORS.Beginner;
  const thumb = course.cover?.publicId
    ? buildCloudinaryUrl(course.cover.publicId, { width: 120, height: 72 })
    : course.cover?.secureUrl;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '0.875rem 1rem',
        background: 'var(--surface)',
        border: '1.5px solid var(--border)',
        borderRadius: 14,
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(79,126,247,0.3)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Thumbnail */}
      <div style={{
        width: 90, height: 54, borderRadius: 8, overflow: 'hidden',
        background: cat?.bgColor ?? 'var(--surface-2)',
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem',
      }}>
        {thumb
          ? <img src={thumb} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : cat?.emoji
        }
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
          <p style={{
            fontWeight: 700, fontSize: '0.9rem',
            color: 'var(--text-primary)', margin: 0,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {course.title}
          </p>
          <span style={{
            fontSize: '0.7rem', padding: '2px 8px', borderRadius: 20,
            background: diff.bg, color: diff.text, fontWeight: 600, flexShrink: 0,
          }}>
            {course.difficulty}
          </span>
        </div>
        <p style={{
          fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          <span style={{ color: cat?.color }}>{cat?.emoji} {course.category}</span>
          {' · '}{course.duration}
          {' · '}{course.moduleCount} modules
          {' · '}<code style={{ fontSize: '0.72rem', background: 'var(--surface-2)', padding: '1px 5px', borderRadius: 4 }}>{course.slug}</code>
        </p>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
        {/* Published */}
        <button
          onClick={() => onToggle('published', !course.published)}
          title={course.published ? 'Unpublish' : 'Publish'}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '5px 10px', borderRadius: 8,
            background: course.published ? 'rgba(44,155,106,0.1)' : 'var(--surface-2)',
            border: `1.5px solid ${course.published ? 'rgba(44,155,106,0.3)' : 'var(--border)'}`,
            color: course.published ? '#2C9B6A' : 'var(--text-tertiary)',
            cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'inherit',
          }}
        >
          {course.published ? <Globe size={12} /> : <Lock size={12} />}
          <span className="hide-xs">{course.published ? 'Live' : 'Draft'}</span>
        </button>

        {/* Featured */}
        <button
          onClick={() => onToggle('featured', !course.featured)}
          title={course.featured ? 'Remove from featured' : 'Mark as featured'}
          style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: course.featured ? 'rgba(217,119,6,0.1)' : 'var(--surface-2)',
            border: `1.5px solid ${course.featured ? 'rgba(217,119,6,0.3)' : 'var(--border)'}`,
            color: course.featured ? '#D97706' : 'var(--text-tertiary)',
            cursor: 'pointer',
          }}
        >
          {course.featured ? <Star size={13} fill="currentColor" /> : <StarOff size={13} />}
        </button>

        {/* Edit */}
        <button onClick={onEdit} title="Edit course" style={{
          width: 32, height: 32, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--surface-2)', border: '1.5px solid var(--border)',
          color: 'var(--text-secondary)', cursor: 'pointer',
        }}>
          <Edit3 size={13} />
        </button>

        {/* Delete */}
        <button onClick={onDelete} title="Delete course" style={{
          width: 32, height: 32, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(232,93,117,0.07)', border: '1.5px solid rgba(232,93,117,0.2)',
          color: '#E85D75', cursor: 'pointer',
        }}>
          <Trash2 size={13} />
        </button>
      </div>
    </motion.div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError('');
    try {
      await adminLogin(email, password);
      onLogin();
    } catch {
      setError('Invalid credentials. Check your Firebase email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: '1.5rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'var(--surface)',
          borderRadius: 20, border: '1.5px solid var(--border)',
          padding: '2.5rem',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <Image
            src="/logo.png"
            alt="Lane Academy"
            width={150}
            height={50}
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
          <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', margin: '0.35rem 0 0', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
            Admin Dashboard
          </p>
        </div>

        <h1 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Sign in
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Use your Firebase Authentication email and password.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email</label>
            <input
              type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                padding: '0.75rem 1rem', borderRadius: 12,
                background: 'var(--bg)', border: '1.5px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.9rem',
                outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'} required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '0.75rem 2.75rem 0.75rem 1rem',
                  borderRadius: 12,
                  background: 'var(--bg)', border: '1.5px solid var(--border)',
                  color: 'var(--text-primary)', fontSize: '0.9rem',
                  outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', display: 'flex',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem', borderRadius: 10,
              background: 'rgba(232,93,117,0.1)', border: '1px solid rgba(232,93,117,0.25)',
              display: 'flex', gap: '0.5rem', alignItems: 'flex-start',
            }}>
              <AlertCircle size={14} style={{ color: '#E85D75', marginTop: 2, flexShrink: 0 }} />
              <p style={{ color: '#E85D75', fontSize: '0.82rem', margin: 0 }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            padding: '0.875rem', borderRadius: 12,
            background: loading ? 'var(--text-tertiary)' : 'var(--accent)',
            color: 'white', border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            marginTop: '0.25rem',
          }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Signing in…</> : 'Sign in'}
          </button>
        </form>
      </motion.div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Main Admin component ─────────────────────────────────────────────────────
export default function AdminClient() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Course | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
  };

  // Auth listener
  useEffect(() => {
    return onAdminAuthChange((u) => { setUser(u); setAuthLoading(false); });
  }, []);

  // Course listener — only when authed
  useEffect(() => {
    if (!user) return;
    return adminSubscribeAllCourses(setCourses);
  }, [user]);

  const filtered = courses.filter((c) => {
    if (filter === 'published' && !c.published) return false;
    if (filter === 'draft' && c.published) return false;
    if (filter === 'featured' && !c.featured) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.slug.includes(q);
    }
    return true;
  });

  const handleSave = async (data: CourseInput) => {
    try {
      if (editTarget) {
        await adminUpdateCourse(editTarget.id, data);
        showToast('Course updated successfully');
      } else {
        await adminCreateCourse(data);
        showToast('Course created successfully');
      }
      setFormOpen(false);
      setEditTarget(null);
    } catch (e) {
      showToast('Save failed. Check Firebase rules & auth.', 'error');
      throw e;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminDeleteCourse(deleteTarget.id);
      showToast(`"${deleteTarget.title}" deleted`);
    } catch {
      showToast('Delete failed.', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleToggle = async (course: Course, field: 'published' | 'featured', val: boolean) => {
    try {
      await adminToggleField(course.id, field, val);
      showToast(`${field === 'published' ? (val ? 'Published' : 'Unpublished') : (val ? 'Featured' : 'Unfeatured')}: "${course.title}"`);
    } catch {
      showToast('Update failed.', 'error');
    }
  };

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader2 size={24} style={{ color: 'var(--text-tertiary)', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={() => {}} />;
  }

  const stats = {
    total: courses.length,
    published: courses.filter((c) => c.published).length,
    featured: courses.filter((c) => c.featured).length,
    drafts: courses.filter((c) => !c.published).length,
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Top bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'var(--nav-bg)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.5rem', height: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Image
            src="/logo.png"
            alt="Lane Academy"
            width={110}
            height={37}
            style={{ objectFit: 'contain', objectPosition: 'left center' }}
            priority
          />
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)',
            background: 'var(--accent-light)', padding: '2px 8px', borderRadius: 20,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            Admin
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', display: 'none' }}
            className="hide-mobile">{user.email}</span>
          <button
            onClick={async () => { await adminLogout(); setUser(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 0.875rem', borderRadius: 8,
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: 600, fontFamily: 'inherit',
            }}
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        {/* Page title + CTA */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Instrument Serif, Georgia, serif',
              fontStyle: 'italic', fontWeight: 400,
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)', margin: 0,
            }}>
              Course Manager
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Create, edit and publish courses to Lane Academy
            </p>
          </div>
          <button
            onClick={() => { setEditTarget(null); setFormOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.25rem', borderRadius: 12,
              background: 'var(--accent)', color: 'white', border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'inherit',
              boxShadow: '0 4px 14px rgba(79,126,247,0.3)',
            }}
          >
            <Plus size={16} /> Add Course
          </button>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.875rem', marginBottom: '1.75rem',
        }}>
          {[
            { label: 'Total courses', value: stats.total, color: 'var(--accent)' },
            { label: 'Published', value: stats.published, color: '#2C9B6A' },
            { label: 'Drafts', value: stats.drafts, color: '#D97706' },
            { label: 'Featured', value: stats.featured, color: '#7C5CE4' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              padding: '1.1rem 1.25rem',
              background: 'var(--surface)',
              borderRadius: 14, border: '1.5px solid var(--border)',
            }}>
              <p style={{ fontSize: '1.75rem', fontWeight: 800, color, margin: '0 0 0.15rem', letterSpacing: '-0.03em' }}>{value}</p>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div style={{
          display: 'flex', gap: '0.625rem', marginBottom: '1.25rem',
          flexWrap: 'wrap', alignItems: 'center',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 180 }}>
            <Search size={14} style={{
              position: 'absolute', left: 11, top: '50%',
              transform: 'translateY(-50%)', color: 'var(--text-tertiary)',
              pointerEvents: 'none',
            }} />
            <input
              placeholder="Search courses…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '0.65rem 0.875rem 0.65rem 2.4rem',
                borderRadius: 10, background: 'var(--surface)',
                border: '1.5px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.875rem',
                outline: 'none', fontFamily: 'inherit',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
            />
          </div>

          {/* Status filters */}
          {(['all', 'published', 'draft', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.6rem 1rem', borderRadius: 10,
                background: filter === f ? 'var(--accent-light)' : 'var(--surface)',
                border: `1.5px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                color: filter === f ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: filter === f ? 700 : 500,
                fontSize: '0.82rem', fontFamily: 'inherit', textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? `All (${stats.total})` : f === 'published' ? `Live (${stats.published})` : f === 'draft' ? `Drafts (${stats.drafts})` : `Featured (${stats.featured})`}
            </button>
          ))}
        </div>

        {/* Course list */}
        {courses.length === 0 ? (
          <div style={{
            padding: '5rem 2rem', textAlign: 'center',
            borderRadius: 20, border: '2px dashed var(--border)',
            background: 'var(--surface)',
          }}>
            <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</p>
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No courses yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Create your first course to get started.
            </p>
            <button
              onClick={() => setFormOpen(true)}
              style={{
                padding: '0.75rem 1.5rem', borderRadius: 12,
                background: 'var(--accent)', color: 'white', border: 'none',
                cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              <Plus size={15} /> Add your first course
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: '3rem 2rem', textAlign: 'center',
            borderRadius: 16, background: 'var(--surface)', border: '1.5px solid var(--border)',
          }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              No courses match your filter.
            </p>
          </div>
        ) : (
          <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            <AnimatePresence>
              {filtered.map((course) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  onEdit={() => { setEditTarget(course); setFormOpen(true); }}
                  onDelete={() => setDeleteTarget(course)}
                  onToggle={(field, val) => handleToggle(course, field, val)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {formOpen && (
          <CourseFormModal
            initial={editTarget
              ? { ...editTarget }
              : null
            }
            onSave={handleSave}
            onClose={() => { setFormOpen(false); setEditTarget(null); }}
          />
        )}
      </AnimatePresence>

      {deleteTarget && (
        <ConfirmDialog
          message={`This will permanently delete "${deleteTarget.title}". This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Toasts */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.msg} msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 500px) { .hide-xs { display: none; } }
        @media (max-width: 640px) { .hide-mobile { display: none !important; } }
      `}</style>
    </div>
  );
}
