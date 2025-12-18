import type { ReactNode } from 'react';
import { Header } from '@/components/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="container w-full max-w-6xl">
      <Header />
      <main className="px-4">{children}</main>
    </div>
  );
}
