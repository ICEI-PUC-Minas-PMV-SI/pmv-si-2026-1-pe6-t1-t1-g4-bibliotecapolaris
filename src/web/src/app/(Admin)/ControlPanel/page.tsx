'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

import { ActionButton, Header } from '@/components';
import { AddBookModal } from '@/components/Form/AddBookModal';
import { ProtectedRoute } from '@/components/Global/ProtectedRoute';
import { useAlertModal } from '@/hooks/useAlertModal';

import { getBooks, deleteBook } from '@/services/Books';
import { formatBook, formatCategories } from '@/util/Formatter';

type ViewMode = 'livros' | 'emprestimos';

const PAGE_SIZE = 8;

function ControlPanelContent() {
  const [activeView, setActiveView] = useState<ViewMode>('livros');
  const [books, setBooks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; data: any | null }>({
    open: false,
    mode: 'create',
    data: null,
  });
  const { showConfirmation, showError, showSuccess, ModalComponent } = useAlertModal();

  async function loadBooks() {
    const data = await getBooks();
    setBooks((data ?? []).map(formatBook));
    setPage(1);
  }

  useEffect(() => {
    loadBooks();
  }, []);

  const totalPages = Math.max(1, Math.ceil(books.length / PAGE_SIZE));
  const paged = books.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleDeleteBook(book: any) {
    showConfirmation('Excluir livro', `Tem certeza que deseja excluir "${book.name}"?`, async () => {
      try {
        const { status, data } = await deleteBook(book.id);
        if (status === 200 || status === 202) {
          showSuccess('Sucesso!', 'Livro deletado com sucesso!', loadBooks);
        } else {
          showError('Erro', data?.message || 'Não foi possível deletar.');
        }
      } catch {
        showError('Erro no Servidor', 'Não foi possível conectar.');
      }
    });
  }

  return (
    <>
      <Header />

      <main className="min-h-[80vh] flex flex-col gap-6 bg-(--background) px-10 pb-10">
        {/* Tabs + Adicionar */}
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

        {/* Tabela de Livros */}
        {activeView === 'livros' && (
          <BooksTable
            books={paged}
            onEdit={(book) => setModal({ open: true, mode: 'edit', data: book })}
            onDelete={handleDeleteBook}
          />
        )}

        {/* Tabela de Empréstimos (mock) */}
        {activeView === 'emprestimos' && <LoansTable />}

        {/* Paginação */}
        {activeView === 'livros' && (
          <div className="flex items-center justify-center gap-20 mt-4">
            <ActionButton
              title="Anterior"
              variant="fill"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-xl tracking-widest px-8 py-4 w-44"
            />
            <span className="font-serif font-bold text-3xl tracking-widest text-(--text)">
              Página {page} de {totalPages}
            </span>
            <ActionButton
              title="Próxima"
              variant="fill"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-xl tracking-widest px-8 py-4 w-44"
            />
          </div>
        )}

        {modal.open && (
          <AddBookModal
            open={modal.open}
            mode={modal.mode}
            initialData={modal.data}
            onClose={() => setModal({ open: false, mode: 'create', data: null })}
            onSuccess={() => {
              setModal({ open: false, mode: 'create', data: null });
              loadBooks();
            }}
          />
        )}

        {ModalComponent}
      </main>
    </>
  );
}

function BooksTable({ books, onEdit, onDelete }: { books: any[]; onEdit: (b: any) => void; onDelete: (b: any) => void }) {
  return (
    <div className="w-full border-2 border-(--text)/20 rounded-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#fff2d6] grid grid-cols-[60px_1fr_1fr_1fr_2fr_80px] gap-10 px-10 py-5 border-b-2 border-(--text)/20">
        {['CAPA — NOME', 'AUTOR', 'CATEGORIA', 'DISPONÍVEIS', 'DESCRIÇÃO', ''].map((h, i) => (
          <span key={i} className="font-serif font-bold text-xl tracking-widest text-[#121212] uppercase">{h}</span>
        ))}
      </div>

      {/* Rows */}
      {books.length === 0 ? (
        <div className="bg-[#fff7e6] px-10 py-8 text-center font-serif text-2xl text-[#121212] tracking-widest">
          Nenhum livro cadastrado.
        </div>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
            className="bg-[#fff7e6] grid grid-cols-[60px_1fr_1fr_1fr_2fr_80px] gap-10 px-10 py-4 border-b border-(--text)/10 hover:bg-[#fff2d6] cursor-pointer transition-colors items-center"
            onClick={() => onEdit(book)}
          >
            <div className="relative w-10 h-16 border border-[#121212]/20 rounded-sm shadow overflow-hidden shrink-0">
              <Image
                src={book.imageSrc || '/assets/images/mock-book.png'}
                fill
                alt={book.name}
                className="object-cover"
                onError={(e: any) => { e.currentTarget.src = '/assets/images/mock-book.png'; }}
                unoptimized
              />
            </div>

            <span className="font-serif font-bold text-xl tracking-wide text-[#121212] truncate">{book.name}</span>
            <span className="font-serif font-bold text-xl tracking-widest text-[#121212] uppercase truncate">{book.author}</span>
            <span className="font-serif font-bold text-xl text-[#121212] truncate">{formatCategories(book.categories)}</span>
            <span className="font-sans text-base text-[#121212] truncate">{book.description}</span>

            <button
              className="flex items-center justify-center w-10 h-10 text-[#e53a41] hover:bg-[#e53a41]/10 rounded transition-colors"
              onClick={(e) => { e.stopPropagation(); onDelete(book); }}
              title="Excluir"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const MOCK_LOANS = [
  { id: '1', nome: 'Davih G. Duque', livro: 'The Sudden Stop', status: 'ok', dueDate: '12/03', dataRetirada: '22/02 - 14:30' },
  { id: '2', nome: 'Davih G. Duque', livro: 'The Sudden Stop', status: 'late', dueDate: '20/02', dataRetirada: '22/02 - 14:30' },
  { id: '3', nome: 'Davih G. Duque', livro: 'The Sudden Stop', status: 'warning', dueDate: '24/02', dataRetirada: '22/02 - 14:30' },
];

function LoansTable() {
  return (
    <div className="w-full border-2 border-(--text)/20 rounded-sm overflow-hidden">
      <div className="bg-[#fff2d6] grid grid-cols-4 gap-10 px-10 py-5 border-b-2 border-(--text)/20">
        {['NOME', 'LIVRO', 'STATUS', 'DATA DA RETIRADA'].map((h, i) => (
          <span key={i} className="font-serif font-bold text-xl tracking-widest text-[#121212] uppercase">{h}</span>
        ))}
      </div>

      {MOCK_LOANS.map((loan) => {
        const statusConfig = {
          ok: { bg: 'bg-[#00ff2f]', label: `Entrega em 12 dias - ${loan.dueDate}` },
          late: { bg: 'bg-[#e53a41]', label: `Atrasado em 4 dias - ${loan.dueDate}` },
          warning: { bg: 'bg-[#ffaa00]', label: `Entrega em 2 dias - ${loan.dueDate}` },
        }[loan.status] ?? { bg: 'bg-gray-400', label: loan.dueDate };

        return (
          <div key={loan.id} className="bg-[#fff7e6] grid grid-cols-4 gap-10 px-10 py-4 border-b border-(--text)/10 items-center">
            <span className="font-serif font-bold text-xl text-[#121212]">{loan.nome}</span>
            <span className="font-serif font-bold text-xl text-[#121212]">{loan.livro}</span>
            <span className={`${statusConfig.bg} border border-[#121212]/30 text-[#121212] font-serif font-semibold text-base tracking-wide px-3 py-1 rounded text-center`}>
              {statusConfig.label}
            </span>
            <span className="font-serif font-bold text-xl tracking-widest text-[#121212]">{loan.dataRetirada}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ControlPanel() {
  return (
    <ProtectedRoute adminOnly>
      <ControlPanelContent />
    </ProtectedRoute>
  );
}
