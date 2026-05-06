import { mockData } from '@/components';
import { getBooks, updateBook, addNewBook } from '@/services/Books';
import { getLoans, getLoansByStatus, createLoan, updateLoan, deleteLoan } from '@/services/Loans';
import { formatBook } from '@/util/Formatter';

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
    load: async () => {
      const data = await getLoansByStatus('in_progress');
      return data ?? [];
    },
    create: createLoan,
    update: updateLoan,
  },

  historico: {
    load: async () => {
      const data = await getLoansByStatus('returned');
      return data ?? [];
    },
  },
};
