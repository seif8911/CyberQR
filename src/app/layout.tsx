import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CyberQR - Secure QR Code Scanner',
  description: 'Production-ready cybersecurity QR code scanner with gamified education and real-time threat detection.',
  keywords: ['cybersecurity', 'QR code', 'security scanner', 'phishing detection', 'education'],
  authors: [{ name: 'Code Crew Team' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
  themeColor: '#f9b222',
  manifest: '/manifest.json',
  icons: {
    icon: '/animations/Snapshot_3.PNG',
    apple: '/animations/Snapshot_3.PNG',
  },
  openGraph: {
    title: 'CyberQR - Secure QR Code Scanner',
    description: 'Scan QR codes safely, learn to spot scams, and level up your cyber skills.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberQR - Secure QR Code Scanner',
    description: 'Scan QR codes safely, learn to spot scams, and level up your cyber skills.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CyberQR" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
