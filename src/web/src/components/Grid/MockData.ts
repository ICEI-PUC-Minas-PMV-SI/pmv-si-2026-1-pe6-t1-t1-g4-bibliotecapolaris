type ViewMode = 'livros' | 'emprestimos' | 'historico';

export const mockData: Record<ViewMode, any[]> = {
  livros: [
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: '1984',
      },
      autor: 'George Orwell',
      categoria: 'Distopia',
      descricao: 'Uma sociedade controlada pelo Estado.',
    },
    {
      livro: {
        src: '/assets/images/mock-book.png',
        name: 'Clean Code',
      },
      autor: 'Robert C. Martin',
      categoria: 'Programação',
      descricao: 'Boas práticas de código.',
    },
  ],

  emprestimos: [
    {
      nome: 'João',
      livro: '1984',
      dataRetirada: '10/04/2026 - 12:30',
    },
    {
      nome: 'Maria',
      livro: 'Clean Code',
      dataRetirada: '12/04/2026 - 12:30',
    },
  ],

  historico: [
    {
      nome: 'Carlos',
      livro: '1984',
      dueDate: new Date('2026-04-15'),
      dataRetirada: '01/04/2026 - 12:30',
    },
    {
      nome: 'Ana',
      livro: 'Clean Code',
      dueDate: new Date('2026-04-25'),
      dataRetirada: '05/04/2026 - 12:30',
    },
  ],
};
