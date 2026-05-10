'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { loginUser } from '@/services/User';
import { ActionButton } from '@/components';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError, ModalComponent } = useAlertModal();

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      setIsLoading(true);

      const { status, data } = await loginUser(email, password);

      if (status === 200 || status === 201) {
        login(data.user, data.token);
        showSuccess('Sucesso!', 'Login realizado com sucesso!', () => router.push('/Books'));
      } else {
        showError('Atenção!', data.message || 'E-mail ou senha incorretos.');
      }
    } catch (error) {
      showError('Erro no Servidor', 'Não foi possível conectar.');
    } finally {
      setIsLoading(false);
    }
  }

  function goToSign() {
    router.push('/SignPage');
  }

  return (
    <main className="min-h-screen flex flex-row gap-6 bg-(--background) relative">
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

          <input
            name="email"
            type="email"
            placeholder="JohnDoe@unipolaris.com"
            className="form-input text-xl"
            required
          />
          <input name="password" type="password" placeholder="••••••••" className="form-input text-xl" required />

          <ActionButton
            title={isLoading ? 'Entrando...' : 'Entrar'}
            type="submit"
            className={`h-12 text-3xl rounded-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          />
        </form>

        <p className="text-(--text) text-2xl font-sans">
          Não tem conta?{' '}
          <span className="text-(--button-active) cursor-pointer" onClick={goToSign}>
            Registre aqui
          </span>
        </p>
      </section>

      {ModalComponent}
    </main>
  );
}
