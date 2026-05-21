import { Book } from './index';

export type BookForm = Book;

export const initialBookForm = {
  id: '',
  isbn: '',
  name: '',
  author: {
    name: '',
  },
  year: 2024,
  categories: '',
  description: '',
  totalQuantity: 1,
  totalAvailable: 1,
  imageSrc: '',
};

export type LoanForm = {
  bookId: string;
  userId: string;
  loanDate: string;
  returnDate: string;
};
