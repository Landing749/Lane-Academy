import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: "Lane Academy — Learn the Skills Life Doesn't Always Teach",
    template: '%s | Lane Academy',
  },
  description:
    'Practical, self-paced courses designed to help you navigate relationships, emotions, communication, careers, finances, productivity, and personal growth.',
  keywords: [
    'self-paced courses','life skills','emotional wellbeing','relationships','personal growth','privacy-first','online learning',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Lane Academy',
    title: "Lane Academy — Learn the Skills Life Doesn't Always Teach",
    description:
      'Practical, self-paced courses on relationships, communication, money, and personal growth. No account. No tracking. Everything stays on your device.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <Navigation />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
