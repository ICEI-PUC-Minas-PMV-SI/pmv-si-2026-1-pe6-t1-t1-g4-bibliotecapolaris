'use client';

import Image from 'next/image';
import { ActionButton, AlertModal } from '@/components'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { registerUser } from '@/services/User'; 

export default function SignPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); 
  const [modal, setModal] = useState({ isOpen: false, type: 'error', title: '', description: '' }); 

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); 
    setIsLoading(true); 

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { status, data } = await registerUser(name, email, password);

      if (status === 201 || status === 200) {
        setModal({ 
          isOpen: true, 
          type: 'success', 
          title: 'Sucesso!',
          description: 'Usuário cadastrado com sucesso!' 
        });
      } else {
        let errorMsg = data.message || 'Erro ao realizar cadastro. Verifique os dados.';
        
        if (data.field) {
          if (Array.isArray(data.field)) {
            errorMsg = data.field[0];
          } else if (typeof data.field === 'object') {
            const firstFieldError = Object.keys(data.field)[0];
            errorMsg = data.field[firstFieldError][0];
          }
        }

        setModal({ 
          isOpen: true, 
          type: 'error', 
          title: 'Atenção!', 
          description: errorMsg 
        });
      }
    } catch (error) {
      setModal({ 
        isOpen: true, 
        type: 'error', 
        title: 'Erro de Conexão', 
        description: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' 
      });
    } finally {
      setIsLoading(false); 
    }
  }

  function handleModalConfirm() {
    if (modal.type === 'success') {
      router.push('/LoginPage');
    } else {
      setModal({ ...modal, isOpen: false });
    }
  }

  function goToLogin() {
    router.push('/LoginPage');
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
          <h1 className="text-4xl font-semibold text-(--text) border-b-4 border-(--button-active) pb-1 w-fit tracking-widest uppercase">
            Registrar
          </h1>

          <input name="name" type="text" placeholder="John Doe" className="form-input text-xl" required disabled={isLoading} />
          <input name="email" type="email" placeholder="JohnDoe@unipolaris.com" className="form-input text-xl" required disabled={isLoading} />
          <input name="password" type="password" placeholder="••••••••" className="form-input text-xl" required disabled={isLoading} />

          <ActionButton 
            title={isLoading ? "Carregando..." : "Registrar"} 
            type="submit" 
            className={`h-12 text-3xl rounded-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`} 
            disabled={isLoading} 
          />
        </form>

        <p className="text-(--text) text-2xl font-sans">
          Já tem conta?{' '}
          <span className="text-(--button-active) cursor-pointer" onClick={goToLogin}>
            Entre aqui
          </span>
        </p>
      </section>

      {modal.isOpen && (
        <AlertModal
          type={modal.type as 'error' | 'success'}
          title={modal.title}
          description={modal.description}
          onClose={handleModalConfirm}
        />
      )}
    </main>
  );
}