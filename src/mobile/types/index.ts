import { BookForm } from './formTypes';

export type BookOptional = Partial<BookForm>;

export type Book = {
  id: string;
  isbn: string;
  name: string;
  author: {
    name: string;
  };

  year: number | '';
  categories: string;
  description: string;

  totalQuantity: number;
  totalAvailable: number;

  imageSrc: string;
};

export type Loan = {
  id: string;
  studentId: string;
  bookId: string;
  loanDate: string | Date;
  dueDate: string | Date;
  returnDate?: string | Date | null;
  status: 'in_progress' | 'returned' | 'overdue' | 'canceled' | 'pending';
  justification?: string | null;
  book: BookOptional;
};

export type User = {
  id: string;
  name: string;
  email: string;
  slug: string;
  role: 'student' | 'administrator';
};

export type AuthorType = {
  id: string;
  name: string;
};

export type BookCardType = Omit<Book, 'totalQuantity' | 'totalAvailable'>;

export type RequestCardType = {
  id: string;
  bookName: string;
  authorName: string;
  loanDate: string;
  imageSrc: string;
};

type LoanStatusType = 'pending' | 'in_progress' | 'returned' | 'canceled' | 'overdue';

export type LoanCardType = {
  id: string;
  bookName: string;
  userName: string;
  authorName: string;
  dueDate: string;
  returnDate: string;
  loanDate: string;
  status: LoanStatusType;
};
