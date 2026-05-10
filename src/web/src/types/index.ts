import { BookForm } from './formTypes';

export type BookOptional = Partial<BookForm>;

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

export type User = { id: string; name: string; email: string; slug: string; role: 'student' | 'administrator' };
