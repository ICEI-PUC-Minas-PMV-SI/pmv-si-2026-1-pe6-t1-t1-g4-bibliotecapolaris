import { BookCell } from '@/components';
import { DeleteButtonCell } from '@/components';
import { LoanActionsCell } from '@/components';
import { StatusCell } from '@/components';
import { formatCategories } from '@/util/Formatter';

export const gridConfigs = {
  livros: {
    columnDefs: [
      {
        headerName: 'Livro',
        field: 'name',
        cellRenderer: BookCell,
      },
      { headerName: 'Autor', field: 'author', cellClass: 'font-serif font-bold text-xl uppercase justify-center' },
      { headerName: 'Categoria', field: 'categories', valueFormatter: (params: any) => formatCategories(params.value) },
      {
        headerName: 'Descrição',
        field: 'description',
        cellClass: 'flex items-center justify-start px-2',
      },
      {
        headerName: 'Ação',
        field: 'action',
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
