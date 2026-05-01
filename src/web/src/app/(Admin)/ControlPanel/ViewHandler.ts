import { mockData } from '@/components';
import { getBooks, updateBook, addNewBook } from '@/services/Books';
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
    load: async () => mockData['emprestimos'],
    create: async () => {},
    update: async () => {},
  },

  historico: {
    load: async () => mockData['historico'],
  },
};
