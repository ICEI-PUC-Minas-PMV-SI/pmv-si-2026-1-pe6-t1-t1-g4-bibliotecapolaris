import { BookCell } from '@/components';
import { DeleteButtonCell } from '@/components';
import { LoanActionsCell } from '@/components';
import { StatusCell } from '@/components';
import { HistoricoStatusCell } from '@/components';
import { formatCategories } from '@/util/Formatter';

export const gridConfigs = {
  livros: {
    columnDefs: [
      {
        headerName: 'Capa - Nome',
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
        headerName: '',
        field: 'action',
        cellRenderer: DeleteButtonCell,
        flex: 1,
      },
    ],
  },

  emprestimos: {
    columnDefs: [
      { headerName: 'Nome', field: 'student.name', valueGetter: (p: any) => p.data?.student?.name },
      { headerName: 'Livro', field: 'book.name', valueGetter: (p: any) => p.data?.book?.name },
      {
        headerName: 'Data da Retirada',
        field: 'loanDate',
        valueFormatter: (p: any) => {
          if (!p.value) return '';
          const [y, m, d] = p.value.split('-');
          return `${d}/${m}/${y}`;
        },
      },
      {
        headerName: 'Ações',
        cellRenderer: LoanActionsCell,
      },
    ],
  },

  historico: {
    columnDefs: [
      { headerName: 'Nome', field: 'student.name', valueGetter: (p: any) => p.data?.student?.name },
      { headerName: 'Livro', field: 'book.name', valueGetter: (p: any) => p.data?.book?.name },
      {
        headerName: 'Status',
        field: 'dueDate',
        cellRenderer: HistoricoStatusCell,
      },
      {
        headerName: 'Data da Retirada',
        field: 'loanDate',
        valueFormatter: (p: any) => {
          if (!p.value) return '';
          const [y, m, d] = p.value.split('-');
          return `${d}/${m}/${y}`;
        },
      },
    ],
  },
};
