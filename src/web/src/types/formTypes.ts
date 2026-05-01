export type BookForm = {
  isbn: string;
  name: string;
  author: string;
  year: number | '';
  categories: string;
  description: string;
  totalQuantity: number;
  availableQuantity: number;
  imageSrc: string;
};

export const initialBookForm = {
  isbn: '',
  name: '',
  author: '',
  year: 0,
  categories: '',
  description: '',
  totalQuantity: 0,
  availableQuantity: 0,
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
