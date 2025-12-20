import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { RedirectToSignIn } from '@daveyplate/better-auth-ui';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="container w-full max-w-6xl">
      <RedirectToSignIn />
      <Header />
      <main className="px-4">{children}</main>
    </div>
  );
}
