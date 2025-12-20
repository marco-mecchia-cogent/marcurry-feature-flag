import { cn } from '@/lib/utils';
import { Logo } from '@/components/logo';
import { NavLinks } from '@/components/nav-links';
import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@daveyplate/better-auth-ui';

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
            <UserButton size="icon" additionalLinks={[<ModeToggle key="mode-toggle" />]} />
          </div>
        </div>
      </div>
    </header>
  );
}
