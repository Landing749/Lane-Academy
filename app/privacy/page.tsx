import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy — Lane Academy',
  description: 'Lane Academy is built on a simple promise: your data is yours. No accounts, no tracking, no uploads. Everything stays on your device.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
