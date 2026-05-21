export type BookForm = {
  id: string;
  isbn: string;
  name: string;
  author: string;
  year: number | '';
  categories: string;
  description: string;
  totalQuantity: number;
  totalAvailable: number;
  imageSrc: string;
};

export const initialBookForm = {
  id: '',
  isbn: '',
  name: '',
  author: '',
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
