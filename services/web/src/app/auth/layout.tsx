import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { paths } from '@/server/paths';

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  const isLoggedIn = !!session?.user;

  if (isLoggedIn) {
    redirect(paths.APP);
  }

  return (
    <div className="bg-muted flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo asLink={false} />
        </div>
        {children}
      </div>
    </div>
  );
}
