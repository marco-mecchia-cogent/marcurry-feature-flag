'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import { authClient } from '@/lib/auth-client';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/sign-in');
        },
      },
    });
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
