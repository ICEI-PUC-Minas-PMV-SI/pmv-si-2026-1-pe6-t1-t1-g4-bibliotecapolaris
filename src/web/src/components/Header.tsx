'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ActionButton } from './ActionButton';
import { useRouter } from 'next/navigation';

export function Header() {
  const { theme } = useTheme();
  const router = useRouter();

  const isDark = theme !== 'light';

  return (
    <header className="relative z-50 flex flex-row items-start justify-between w-full h-[20vh] px-8">
      <Image
        src={isDark ? '/assets/images/logo-dark.png' : '/assets/images/logo-light.png'}
        alt="Logo"
        width={280}
        height={40}
        className="h-full w-auto"
        onClick={() => router.push('/')}
      />

      <ActionButton title="Perfil" variant="fill" className="mt-2" />
    </header>
  );
}
