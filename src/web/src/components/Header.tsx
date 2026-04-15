'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ActionButton } from './ActionButton';

export function Header() {
  const { theme } = useTheme();

  const isDark = theme !== 'light';

  return (
    <header className="relative z-50 flex flex-row items-start justify-between w-full h-[20vh] px-8">
      <Image
        src={isDark ? '/assets/logo-dark.png' : '/assets/logo-light.png'}
        alt="Logo"
        width={112}
        height={40}
        className="h-full w-auto"
      />

      <ActionButton title="Perfil" variant="fill" className="mt-2" />
    </header>
  );
}
