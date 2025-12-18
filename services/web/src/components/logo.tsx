import Link from 'next/link';
import { cn } from '@/lib/utils';

type LogoProps = {
  size?: 'sm' | 'default';
  asLink?: boolean;
};

export function Logo({ size = 'default', asLink = true }: LogoProps) {
  const content = (
    <>
      {/* Logo placeholder */}
      <div
        className={cn(
          'bg-primary text-primary-foreground flex items-center justify-center font-bold',
          size === 'sm' ? 'size-6 rounded text-xs' : 'size-8 rounded-lg text-sm'
        )}
      >
        M
      </div>
      <span className={cn('font-semibold', size === 'sm' ? 'text-base' : 'text-xl')}>Marcurry</span>
    </>
  );

  if (asLink) {
    return (
      <Link href="/" className="flex items-center gap-2">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center gap-2">{content}</div>;
}
