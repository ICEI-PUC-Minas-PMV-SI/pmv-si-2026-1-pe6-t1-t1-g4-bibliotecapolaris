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
  year: 0,
  categories: '',
  description: '',
  totalQuantity: 0,
  totalAvailable: 0,
  imageSrc: '',
};

export type LoanForm = {
  bookId: string;
  userId: string;
  loanDate: string;
  returnDate: string;
};

export type AuthorType = {
  id: string;
  name: string;
};
