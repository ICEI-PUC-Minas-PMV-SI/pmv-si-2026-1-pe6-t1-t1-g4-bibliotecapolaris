import { getBooks, updateBook, addNewBook } from '@/services/Books';
import { getLoansByStatus, createLoan, updateLoan, deleteLoan } from '@/services/Loans';
import { formatBook } from '@/util/Formatter';

async function loansWithBooks(status: string) {
  const [loans, books] = await Promise.all([
    getLoansByStatus(status),
    getBooks(),
  ]);

  const bookMap = new Map((books ?? []).map((b: any) => [b.id, b]));

  return (loans ?? []).map((loan: any) => ({
    ...loan,
    book: loan.book ?? bookMap.get(loan.bookId) ?? null,
  }));
}

export const ViewHandler = {
  livros: {
    load: async () => {
      const data = await getBooks();
      return (data ?? []).map(formatBook);
    },

    create: addNewBook,
    update: updateBook,
  },

  emprestimos: {
    load: () => loansWithBooks('in_progress'),
    create: createLoan,
    update: updateLoan,
  },

  historico: {
    load: () => loansWithBooks('returned'),
  },
};
