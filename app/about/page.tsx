import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About — Lane Academy',
  description: "Learn why Lane Academy exists and what makes it different from other learning platforms. No accounts, no tracking, just practical life skills.",
};

export default function AboutPage() {
  return <AboutClient />;
}
