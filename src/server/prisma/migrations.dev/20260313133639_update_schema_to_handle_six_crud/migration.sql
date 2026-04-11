/*
  Warnings:

  - You are about to drop the column `author` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `publisher` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_available` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `loans` table. All the data in the column will be lost.
  - Added the required column `author_id` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `edition_id` to the `loans` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "editions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "book_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "publisher" TEXT NOT NULL,
    "ISBN" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "quantity_available" INTEGER NOT NULL,
    CONSTRAINT "editions_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    CONSTRAINT "reviews_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "reviews_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("categories", "description", "id", "name", "slug") SELECT "categories", "description", "id", "name", "slug" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "loan_date" DATETIME NOT NULL,
    "due_date" DATETIME NOT NULL,
    "return_date" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "loans_edition_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "editions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("due_date", "id", "loan_date", "return_date", "status", "student_id") SELECT "due_date", "id", "loan_date", "return_date", "status", "student_id" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
