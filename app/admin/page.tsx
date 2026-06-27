import type { Metadata } from 'next';
import { Suspense } from 'react';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Admin — Lane Academy',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Loading…</div>
      </div>
    }>
      <AdminClient />
    </Suspense>
  );
}
