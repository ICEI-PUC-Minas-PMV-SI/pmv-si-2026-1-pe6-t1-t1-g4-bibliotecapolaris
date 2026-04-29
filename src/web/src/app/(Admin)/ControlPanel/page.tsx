'use client';

import '@/lib/AgGrid';

import { useEffect, useState } from 'react';
import { ActionButton, AddBookModal, ConfirmModal, DataGrid, gridConfigs, Header, mockData } from '@/components';
import { deleteBook, getBooks } from '@/services/Books';

import { formatBook } from '@/util/Formatter';

type ViewMode = 'livros' | 'emprestimos' | 'historico';

export default function ControlPanel() {
  const [books, setBooks] = useState([]);
  const [activeView, setActiveView] = useState<ViewMode>('livros');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const config = gridConfigs[activeView];
  const rowData = activeView === 'livros' ? books : mockData[activeView];

  async function loadBooks() {
    const data = await getBooks();
    setBooks((data ?? []).map(formatBook));
  }

  useEffect(() => {
    async function fetchBooks() {
      const data = await getBooks();
      setBooks((data ?? []).map(formatBook));
    }
    fetchBooks();
  }, []);

  return (
    <>
      <Header />

      {showAddModal && (
        <AddBookModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadBooks();
          }}
        />
      )}

      {bookToDelete && (
        <ConfirmModal
          title="Excluir Livro"
          message={`Tem certeza que deseja deletar o livro "${bookToDelete.name}"? Esta ação não pode ser desfeita.`}
          isLoading={isDeleting}
          confirmText="Excluir"
          loadingText="Excluindo..."
          onConfirm={async () => {
            setIsDeleting(true);
            try {
              await deleteBook(bookToDelete.id);
              setBookToDelete(null);
              loadBooks();
            } catch (err) {
              console.error(err);
              alert('Erro ao deletar livro');
            } finally {
              setIsDeleting(false);
            }
          }}
          onCancel={() => {
            if (!isDeleting) setBookToDelete(null);
          }}
        />
      )}


      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) mb-8 overflow-x-hidden">
        <section className=" flex flex-row mt-8 mx-8 justify-between">
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

          {activeView !== 'historico' && (
            <ActionButton
              title={activeView === 'livros' ? 'Adicionar +' : 'Adicionar'}
              onClick={() => {
                if (activeView === 'livros') setShowAddModal(true);
                // logic for Empréstimos could go here later
              }}
            />
          )}
        </section>

        <DataGrid 
          key={activeView}
          columnDefs={config.columnDefs} 
          rowData={rowData} 
          context={{ 
            refreshGrid: loadBooks, 
            requestDelete: (book: any) => setBookToDelete(book) 
          }} 
        />
      </main>
    </>
  );
}
