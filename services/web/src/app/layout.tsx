import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { ToastProvider } from '@/components/ui/toast';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'MarCurry - Feature Flag Management',
  description: 'Feature Flag Management Solution',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex w-full content-center items-center justify-center antialiased`}
      >
        <ToastProvider>
          <div className="container w-full max-w-7xl">
            <Navigation />
            <main className="px-4">{children}</main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
