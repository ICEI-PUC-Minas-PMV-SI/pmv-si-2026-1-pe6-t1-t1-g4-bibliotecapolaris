import { BookCell } from '@/components';
import { DeleteButtonCell } from '@/components';
import { LoanActionsCell } from '@/components';
import { StatusCell } from '@/components';

export const gridConfigs = {
  livros: {
    columnDefs: [
      {
        headerName: 'Livro',
        field: 'livro',
        cellRenderer: BookCell,
      },
      { headerName: 'Autor', field: 'autor', cellClass: 'font-serif font-bold uppercase justify-center' },
      { headerName: 'Categoria', field: 'categoria' },
      {
        headerName: 'Descrição',
        field: 'descricao',
        cellClass: 'flex items-center justify-start px-2',
      },
      {
        headerName: 'Ação',
        cellRenderer: DeleteButtonCell,
        flex: 1,
      },
    ],
  },

  emprestimos: {
    columnDefs: [
      { headerName: 'Nome', field: 'nome' },
      { headerName: 'Livro', field: 'livro' },
      { headerName: 'Data da Retirada', field: 'dataRetirada' },
      {
        headerName: 'Ações',
        cellRenderer: LoanActionsCell,
      },
    ],
  },

  historico: {
    columnDefs: [
      { headerName: 'Nome', field: 'nome' },
      { headerName: 'Livro', field: 'livro' },
      {
        headerName: 'Status',
        field: 'dueDate',
        cellRenderer: StatusCell,
      },
      {
        headerName: 'Data da Retirada',
        field: 'dataRetirada',
      },
    ],
  },
};
