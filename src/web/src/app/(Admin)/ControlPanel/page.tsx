'use client';

import '@/lib/AgGrid';

import { useEffect, useState } from 'react';
import { ActionButton, DataGrid, gridConfigs, Header, mockData } from '@/components';

import { AddBookModal } from '@/components/Form/AddBookModal';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

import { ViewHandler } from './ViewHandler';
import { useAlertModal } from '@/hooks/useAlertModal';
import { deleteBook } from '@/services/Books';
export default function ControlPanel() {
  const [activeView, setActiveView] = useState<ViewMode>('livros');
  const { showConfirmation, showError, showSuccess, ModalComponent } = useAlertModal();

  const view = ViewHandler[activeView];

  const [data, setData] = useState<any[]>([]);

  const [modal, setModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    data: any | null;
  }>({
    open: false,
    mode: 'create',
    data: null,
  });

  async function load() {
    const result = await view.load();
    setData(result);
  }

  useEffect(() => {
    load();
  }, [activeView]);

  function openCreate() {
    setModal({
      open: true,
      mode: 'create',
      data: null,
    });
  }

  function handleRowClick(event: any) {
    if (event.event?.target?.closest('button')) return;

    if (activeView === 'historico') return;

    setModal({
      open: true,
      mode: 'edit',
      data: event.data,
    });
  }

  const handleDeleteRequest = (row: any) => {
    const book = row?.data ?? row;

    showConfirmation('Excluir livro', `Tem certeza que deseja excluir "${book.name}"?`, async () => {
      try {
        const { status, data } = await deleteBook(book.id);

        if (status === 200 || status === 202) {
          showSuccess('Sucesso!', 'Livro deletado com sucesso!', () => {
            load();
          });
        } else {
          showError('Erro', data?.message || 'Não foi possível deletar o livro.');
        }
      } catch (err) {
        showError('Erro no Servidor', 'Não foi possível conectar.');
      }
    });
  };
  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) mb-8 overflow-x-hidden">
        <section className="flex flex-row mt-8 mx-8 justify-between">
          <div className="flex flex-row gap-4">
            <ActionButton
              title="Livros"
              variant={activeView === 'livros' ? 'fill' : 'outline'}
              onClick={() => setActiveView('livros')}
            />

            <ActionButton
              title="Empréstimos"
              variant={activeView === 'emprestimos' ? 'fill' : 'outline'}
              onClick={() => setActiveView('emprestimos')}
            />

            <ActionButton
              title="Histórico"
              variant={activeView === 'historico' ? 'fill' : 'outline'}
              onClick={() => setActiveView('historico')}
            />
          </div>

          {activeView !== 'historico' && <ActionButton title="Adicionar" onClick={openCreate} />}
        </section>

        <DataGrid
          key={`${activeView}-${data.length}`}
          columnDefs={gridConfigs[activeView].columnDefs}
          rowData={data}
          onRowClick={handleRowClick}
          context={{
            handleDeleteRequest,
          }}
        />

        {modal.open && (
          <AddBookModal
            open={modal.open}
            mode={modal.mode}
            initialData={modal.data}
            onClose={() => setModal({ open: false, mode: 'create', data: null })}
            onSuccess={() => {
              setModal({ open: false, mode: 'create', data: null });
              load();
            }}
          />
        )}

        {ModalComponent}
      </main>
    </>
  );
}
