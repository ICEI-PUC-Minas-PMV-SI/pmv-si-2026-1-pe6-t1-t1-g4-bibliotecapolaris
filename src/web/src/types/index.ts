export type Author = {
  id: string;
  name: string;
};

export type Book = {
  id: string;
  slug: string;
  isbn: string;
  name: string;
  categories: string;
  description: string;
  year: number;
  totalQuantity: number;
  availableQuantity: number;
  imageSrc?: string | null;
  authorId: string;
};

export type WishlistItem = {
  id: string;
  studentId: string;
  bookId: string;
  book?: Book;
};

export type User = {
  id: string;
  name: string;
  email: string;
  type: 'student' | 'admin';
};

export type Loan = {
  id: string;
  studentId: string;
  bookId: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: 'active' | 'returned' | 'overdue';
  book?: Book;
  student?: User;
};
