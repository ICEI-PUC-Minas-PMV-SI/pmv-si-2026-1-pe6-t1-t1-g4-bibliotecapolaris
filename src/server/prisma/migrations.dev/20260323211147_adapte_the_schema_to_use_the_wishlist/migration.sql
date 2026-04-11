/*
  Warnings:

  - You are about to drop the `editions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isbn` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_available` to the `books` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_quantity` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "editions";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "wishlists" (
    "student_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,

    PRIMARY KEY ("student_id", "book_id"),
    CONSTRAINT "wishlists_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "wishlists_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_books" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categories" TEXT NOT NULL,
    "total_quantity" INTEGER NOT NULL,
    "total_available" INTEGER NOT NULL,
    CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_books" ("author_id", "categories", "description", "id", "name", "slug") SELECT "author_id", "categories", "description", "id", "name", "slug" FROM "books";
DROP TABLE "books";
ALTER TABLE "new_books" RENAME TO "books";
CREATE UNIQUE INDEX "books_slug_key" ON "books"("slug");
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "edition_id" TEXT NOT NULL,
    "loan_date" DATETIME NOT NULL,
    "due_date" DATETIME NOT NULL,
    "return_date" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("due_date", "edition_id", "id", "loan_date", "return_date", "status", "student_id") SELECT "due_date", "edition_id", "id", "loan_date", "return_date", "status", "student_id" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
