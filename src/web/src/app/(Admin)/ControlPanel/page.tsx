'use client';

import { useEffect, useState } from 'react';

import { ActionButton, DataGrid, Header } from '@/components';
import { AddBookModal } from '@/components/Form/AddBookModal';
import { ProtectedRoute } from '@/components/Global/ProtectedRoute';
import { useAlertModal } from '@/hooks/useAlertModal';
import { useAuth } from '@/context/AuthContext';

import { deleteBook } from '@/services/Books';
import { gridConfigs } from '@/components/Grid/Cells/GridConfig';
import { ViewHandler } from './ViewHandler';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

function ControlPanelContent() {
  const { user, isLoading } = useAuth();
  const { showConfirmation, showError, showSuccess, ModalComponent } = useAlertModal();

  const [activeView, setActiveView] = useState<ViewMode>('livros');
  const [rowData, setRowData] = useState<any[]>([]);
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: any | null }>({
    open: false,
    mode: 'create',
    data: null,
  });

  useEffect(() => {
    if (isLoading) return;
    if (!user || user.type !== 'administrator') {
      showError('Acesso negado', 'Você não tem permissão para acessar esta área.');
      window.location.replace('/');
      return;
    }
  }, [user, isLoading]);

  async function loadView(view: ViewMode) {
    const data = await ViewHandler[view].load();
    setRowData(data ?? []);
  }

  useEffect(() => {
    loadView(activeView);
  }, [activeView]);

  function handleDeleteBook(params: any) {
    const book = params.data;
    showConfirmation('Excluir livro', `Tem certeza que deseja excluir "${book.name}"?`, async () => {
      try {
        const { status, data } = await deleteBook(book.id);
        if (status === 200 || status === 202) {
          showSuccess('Sucesso!', 'Livro deletado com sucesso!', () => loadView('livros'));
        } else {
          showError('Erro', data?.message || 'Não foi possível deletar.');
        }
      } catch {
        showError('Erro no Servidor', 'Não foi possível conectar.');
      }
    });
  }

  const columnDefs = gridConfigs[activeView].columnDefs.map((col: any) => {
    if (col.field === 'action') {
      return { ...col, cellRendererParams: { onClick: handleDeleteBook } };
    }
    return col;
  });

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) px-10 pb-10">
        <div className="flex items-center justify-between">
          <div className="flex gap-6">
            <ActionButton
              title="Livros"
              variant={activeView === 'livros' ? 'fill' : 'outline'}
              onClick={() => setActiveView('livros')}
              className="text-2xl tracking-widest px-8 py-4"
            />
            <ActionButton
              title="Empréstimos"
              variant={activeView === 'emprestimos' ? 'fill' : 'outline'}
              onClick={() => setActiveView('emprestimos')}
              className="text-2xl tracking-widest px-8 py-4"
            />
            <ActionButton
              title="Histórico"
              variant={activeView === 'historico' ? 'fill' : 'outline'}
              onClick={() => setActiveView('historico')}
              className="text-2xl tracking-widest px-8 py-4"
            />
          </div>

          {activeView === 'livros' && (
            <ActionButton
              title="Adicionar +"
              variant="fill"
              onClick={() => setModal({ open: true, mode: 'create', data: null })}
              className="text-2xl tracking-widest px-8 py-4"
            />
          )}
        </div>

        <DataGrid columnDefs={columnDefs} rowData={rowData} />

        {modal.open && (
          <AddBookModal
            open={modal.open}
            mode={modal.mode}
            initialData={modal.data}
            onClose={() => setModal({ open: false, mode: 'create', data: null })}
            onSuccess={() => {
              setModal({ open: false, mode: 'create', data: null });
              loadView('livros');
            }}
          />
        )}

        {ModalComponent}
      </main>
    </>
  );
}

export default function ControlPanel() {
  return (
    <ProtectedRoute adminOnly>
      <ControlPanelContent />
    </ProtectedRoute>
  );
}
