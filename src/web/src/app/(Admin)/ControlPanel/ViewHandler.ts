import { getBooks, updateBook, addNewBook } from '@/services/Books';
import { getLoansByStatus, getLoans, createLoan, updateLoan, deleteLoan } from '@/services/Loans';
import { formatBook } from '@/util/Formatter';

async function loansWithBooks(status: string | null) {
  const [loans, books] = await Promise.all([
    status ? getLoansByStatus(status) : getLoans(),
    getBooks(),
  ]);

  const bookMap = new Map((books ?? []).map((b: any) => [b.id, b]));

  const filtered = status
    ? (loans ?? [])
    : (loans ?? []).filter((l: any) => l.status !== 'pending');

  return filtered.map((loan: any) => ({
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
    load: () => loansWithBooks('pending'),
    create: createLoan,
    update: updateLoan,
  },

  historico: {
    load: () => loansWithBooks(null),
  },
};
