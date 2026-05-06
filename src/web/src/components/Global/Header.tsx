'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

import { ActionButton } from '@/components';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, logout } = useAuth();

  const isDark = theme !== 'light';

  const isAdmin = user?.type === 'administrator';

  function handleProfileClick() {
    if (!user) {
      router.push('/LoginPage');
    } else if (isAdmin) {
      router.push('/ControlPanel');
    } else {
      router.push(`/Users/${user.slug}`);
    }
  }

  function handleLogout() {
    logout();
    router.push('/LoginPage');
  }

  return (
    <header className="relative z-50 flex flex-row items-start justify-between w-full h-[20vh] px-8">
      <Image
        src={isDark ? '/assets/images/logo-dark.png' : '/assets/images/logo-light.png'}
        alt="Logo"
        width={280}
        height={40}
        className="h-full w-auto cursor-pointer"
        onClick={() => router.push('/')}
      />

      <div className="flex flex-row items-center gap-3 mt-2">
        {user && (
          <span className="text-(--text) text-lg font-sans tracking-wide">{user.name.split(' ')[0]}</span>
        )}
        <ActionButton
          title={isAdmin ? 'Painel de Controle' : 'Perfil'}
          variant="fill"
          className="text-2xl"
          onClick={handleProfileClick}
        />
        {user && (
          <ActionButton title="Sair" variant="outline" className="text-2xl" onClick={handleLogout} />
        )}
      </div>
    </header>
  );
}
