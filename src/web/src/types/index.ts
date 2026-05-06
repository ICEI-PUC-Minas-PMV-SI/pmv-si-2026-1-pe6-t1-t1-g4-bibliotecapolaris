export type Book = {
  name: string;
  imageSrc: string;
};

export type Loan = {
  id: string;
  studentId: string;
  bookId: string;
  loanDate: string | Date;
  dueDate: string | Date;
  returnDate?: string | Date | null;
  status: 'in_progress' | 'returned' | 'late';
  justification?: string | null;
  book: Book;
};