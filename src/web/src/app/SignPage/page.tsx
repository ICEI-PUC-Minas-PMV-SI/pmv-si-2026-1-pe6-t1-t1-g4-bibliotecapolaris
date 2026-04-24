'use client';

import Image from 'next/image';
import { ActionButton } from '@/components';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false); // Controla o estado de carregamento
  const [modal, setModal] = useState({ isOpen: false, type: '', message: '' }); // Controla a janelinha de aviso

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault(); // Impede a página de recarregar
    setIsLoading(true); // Muda o botão para "Carregando..."

    // Pega os dados digitados no formulário
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // (Fetch): Enviando os dados para a API
      const response = await fetch('http://localhost:3333/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          type: 'student',
        }),
      });

      const data = await response.json();

      // 4. Tratando a resposta
      if (response.status === 201) {
        setModal({ isOpen: true, type: 'success', message: 'Usuário cadastrado com sucesso!' });
      } else {
        
        let errorMsg = data.message || 'Erro ao realizar cadastro. Verifique os dados.';
        
        // Extrai o erro exato dependendo do formato que o backend mandar
        if (data.field) {
          if (Array.isArray(data.field)) {
            // Se o backend mandou uma lista direta (ex: E-mail duplicado)
            errorMsg = data.field[0];
          } else if (typeof data.field === 'object') {
            // Se o backend mandou um objeto por campo (ex: Erro do Zod na senha)
            const firstFieldError = Object.keys(data.field)[0];
            errorMsg = data.field[firstFieldError][0];
          }
        }

        setModal({ isOpen: true, type: 'error', message: errorMsg });
      }
    } catch (error) {
      setModal({ isOpen: true, type: 'error', message: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' });
    } finally {
      setIsLoading(false); // Libera o botão novamente
    }
  }

  // Função do botão "OK" do modal
  function handleModalConfirm() {
    if (modal.type === 'success') {
      // Tarefa: "caso de sucesso redirecionar o usuário somente após confirmação"
      router.push('/LoginPage');
    } else {
      // Se foi erro, só fecha o modal para o usuário tentar de novo
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

          {/* O botão reage ao estado isLoading */}
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

      {/* Componente do AlertModal (Só aparece se modal.isOpen for true) */}
      {modal.isOpen && (
        <div className="absolute inset-0 bg-black/80 flex justify-center items-center z-50">
          <div className="bg-[#1e1e1e] border border-gray-600 p-8 rounded-lg flex flex-col gap-4 w-96 text-center shadow-2xl">
            <h2 className={`text-2xl font-bold ${modal.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {modal.type === 'success' ? 'Sucesso!' : 'Atenção!'}
            </h2>
            <p className="text-white text-lg">{modal.message}</p>
            {/* onClick chama a função de confirmação para decidir se muda de página ou não */}
            <div className="mt-4" onClick={handleModalConfirm}>
              <ActionButton title="OK" className="h-10 w-full rounded-sm" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}