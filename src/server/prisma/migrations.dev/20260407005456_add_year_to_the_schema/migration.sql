/*
  Warnings:

  - Added the required column `year` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "author_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "total_available" INTEGER NOT NULL,
    CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("author_id", "categories", "description", "id", "isbn", "name", "slug", "total_available", "total_quantity") SELECT "author_id", "categories", "description", "id", "isbn", "name", "slug", "total_available", "total_quantity" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "loan_date" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "return_date" TEXT,
    "status" TEXT NOT NULL,
    CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "loans_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("book_id", "due_date", "id", "loan_date", "return_date", "status", "student_id") SELECT "book_id", "due_date", "id", "loan_date", "return_date", "status", "student_id" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
