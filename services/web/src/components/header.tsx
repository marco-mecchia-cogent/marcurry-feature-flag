import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { NavLinks } from '@/components/nav-links';
import { ModeToggle } from '@/components/mode-toggle';
import { LogoutButton } from '@/components/logout-button';

export function Header({ className }: { className?: string }) {
  return (
    <header className={cn('border-b', className)}>
      <div className="px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <NavLinks />
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
