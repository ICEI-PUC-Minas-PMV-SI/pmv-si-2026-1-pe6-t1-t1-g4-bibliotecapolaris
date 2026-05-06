'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type Props = {
  children: React.ReactNode;
  adminOnly?: boolean;
};

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/LoginPage');
      return;
    }
    if (adminOnly && user.type !== 'administrator') {
      router.replace('/');
    }
  }, [user, isLoading, adminOnly, router]);

  if (isLoading) return null;
  if (!user) return null;
  if (adminOnly && user.type !== 'administrator') return null;

  return <>{children}</>;
}
