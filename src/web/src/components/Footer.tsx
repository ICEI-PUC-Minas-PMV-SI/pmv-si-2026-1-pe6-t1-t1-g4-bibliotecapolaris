'use client';

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { ActionButton } from './ActionButton';

export function Footer() {
  const { theme } = useTheme();

  const isDark = theme !== 'light';

  return (
    <footer className="flex flex-row items-start justify-between w-full h-[20vh] px-8 pb-8 border-t-2">
      <Image
        src={isDark ? '/assets/images/footer-dark.png' : '/assets/images/footer-light.png'}
        alt="Logo"
        width={280}
        height={20}
        className="h-full w-auto"
      />

      <section className="flex flex-row gap-16 items-center h-full">
        <div className="flex flex-col gap-2">
          <a className="text-4xl font-bold uppercase"> Tela Inicial </a>
          <a className="text-xl font-sans"> Livros </a>
          <a className="text-xl font-sans"> Categorias</a>
        </div>
        <div className="flex flex-col gap-2">
          <a className="text-4xl font-bold uppercase"> Universidade </a>
          <a className="text-xl font-sans"> Sobre Nós</a>
          <a className="text-xl font-sans"> Missão </a>
        </div>
        <div className="flex flex-col gap-2">
          <a className="text-4xl font-bold uppercase"> Privacidade </a>
          <a className="text-xl font-sans"> Termos & Condições </a>
          <a className="text-xl font-sans"> Privacidade </a>
        </div>
      </section>
    </footer>
  );
}
