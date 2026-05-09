'use client';

import '@/lib/AgGrid';

import { useEffect, useState } from 'react';
import { ActionButton, DataGrid, gridConfigs, Header } from '@/components';

import { AddBookModal } from '@/components/Form/AddBookModal';
import { AddLoanModal } from '@/components/Form/AddLoanModal';
import { AdjustLoanModal } from '@/components/Book/AdjustLoanModal';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

import { ViewHandler } from './ViewHandler';
import { useAlertModal } from '@/hooks/useAlertModal';
import { deleteBook } from '@/services/Books';
import { updateLoan, checkOverdueLoans } from '@/services/Loans';
function localDateIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function brToIso(br: string) {
  const [day, month, year] = br.split('/');
  return `${year}-${month}-${day}`;
}

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
    checkOverdueLoans().then(() => load());
  }, []);

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

    if (activeView === 'emprestimos') return;

    setModal({
      open: true,
      mode: 'edit',
      data: event.data,
    });
  }

  const handleLoanAction = async (row: any, status: string) => {
    try {
      const returnDate = status === 'returned' ? localDateIso() : undefined;
      await updateLoan(row.id, { status, ...(returnDate ? { returnDate } : {}) });
      load();
    } catch {
      showError('Erro', 'Não foi possível atualizar o empréstimo.');
    }
  };

  function closeModal() {
    setModal({ open: false, mode: 'create', data: null });
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
    // <ProtectedRoute adminOnly>
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
              title="Solicitações"
              variant={activeView === 'emprestimos' ? 'fill' : 'outline'}
              onClick={() => setActiveView('emprestimos')}
            />

            <ActionButton
              title="Empréstimos"
              variant={activeView === 'historico' ? 'fill' : 'outline'}
              onClick={() => setActiveView('historico')}
            />
          </div>

          {activeView !== 'emprestimos' && <ActionButton title="Adicionar →" onClick={openCreate} />}
        </section>

        <DataGrid
          key={`${activeView}-${data.length}`}
          columnDefs={gridConfigs[activeView].columnDefs}
          rowData={data}
          onRowClick={handleRowClick}
          context={{
            handleDeleteRequest,
            handleLoanAction,
          }}
        />

        {modal.open && activeView === 'livros' && (
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

        {modal.open && activeView === 'historico' && modal.mode === 'create' && (
          <AddLoanModal
            open={modal.open}
            onClose={closeModal}
            onSuccess={() => { closeModal(); load(); }}
          />
        )}

        {modal.open && activeView === 'historico' && modal.mode === 'edit' && (
          <AdjustLoanModal
            isOpen={modal.open}
            loan={modal.data}
            onClose={closeModal}
            onChangeDueDate={async (newDate) => {
              await updateLoan(modal.data.id, { dueDate: brToIso(newDate), status: modal.data.status });
              closeModal();
              load();
            }}
            onReturnBook={async () => {
              await handleLoanAction(modal.data, 'returned');
              closeModal();
            }}
            onJustifyAndReturn={async (justification) => {
              await updateLoan(modal.data.id, { status: 'returned', returnDate: localDateIso(), justification });
              closeModal();
              load();
            }}
          />
        )}

        {ModalComponent}
      </main>
      </>
    // </ProtectedRoute>
  );
}
