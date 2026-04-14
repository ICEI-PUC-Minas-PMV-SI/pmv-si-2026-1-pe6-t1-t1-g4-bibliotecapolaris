'use client';

import { useTheme } from 'next-themes';
import { ActionButton } from './ActionButton';

export function Header() {
  const { theme } = useTheme();

  const isDark = theme !== 'light';

  return (
    <header className="flex flex-row items-start justify-between w-full h-[20vh] px-2">
      <img src={isDark ? '/assets/logo-dark.png' : '/assets/logo-light.png'} alt="Logo" className="h-full max-w-28" />

      <ActionButton title="Perfil" variant="fill" />
    </header>
  );
}
