'use client';

import Image from 'next/image';
import { ActionButton } from '@/components';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get('email');
    const password = formData.get('password');

    console.log({ email, password });
  }

  function goToSign() {
    router.push('/SignPage');
  }

  return (
    <main className="min-h-screen flex flex-row gap-6 bg-(--background)">
      <figure className="relative w-[55vw] h-screen overflow-hidden">
        <Image
          src="/assets/images/login-dark.jpg"
          alt="Imagem principal da landing page"
          fill
          className="object-cover"
          unoptimized
        />
      </figure>

      <section className="w-[45vw] flex flex-col justify-between items-center pb-4">
        <figure className="relative w-48 h-48">
          <Image src="/assets/images/logo-dark.png" alt="Logo" fill className="object-cover" priority />
        </figure>

        <form className="w-full flex flex-col gap-5 px-20" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-semibold text-(--text) border-b-4 border-(--button-active) pb-1 w-fit tracking-widest">
            ENTRAR
          </h1>

          <input name="email" type="email" placeholder="alanwake@remedy.com" className="form-input text-xl" />
          <input name="password" type="password" placeholder="••••••••" className="form-input text-xl" />

          <ActionButton
            title="Entrar"
            type="submit"
            className="h-12 text-3xl rounded-sm cursor-pointer transition-colors hover:bg-(--button-hover-active)"
          />
        </form>

        <p className="text-(--text) text-2xl font-sans">
          Não tem conta?{' '}
          <span className="text-(--button-active) cursor-pointer" onClick={goToSign}>
            Registre aqui
          </span>
        </p>
      </section>
    </main>
  );
}
