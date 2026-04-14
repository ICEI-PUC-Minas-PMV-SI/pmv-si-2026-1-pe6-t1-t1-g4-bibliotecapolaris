'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme !== 'light';

  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')}>
      <img
        src={isDark ? '/assets/toggle-dark.png' : '/assets/toggle-light.png'}
        alt="Toggle Theme"
        className="w-30 cursor-pointer transition"
      />
    </button>
  );
}
