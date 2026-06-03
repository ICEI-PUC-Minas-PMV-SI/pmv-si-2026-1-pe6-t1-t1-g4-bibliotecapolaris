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
    "image_src" TEXT NOT NULL,
    CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_books" ("author_id", "categories", "description", "id", "image_src", "isbn", "name", "slug", "total_available", "total_quantity", "year") SELECT "author_id", "categories", "description", "id", "image_src", "isbn", "name", "slug", "total_available", "total_quantity", "year" FROM "books";
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
    "justification" TEXT,
    "status" TEXT NOT NULL,
    CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "loans_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("book_id", "due_date", "id", "loan_date", "return_date", "status", "student_id") SELECT "book_id", "due_date", "id", "loan_date", "return_date", "status", "student_id" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
CREATE TABLE "new_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "loan_id" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    CONSTRAINT "reviews_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("date", "description", "id", "loan_id", "rating") SELECT "date", "description", "id", "loan_id", "rating" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
CREATE UNIQUE INDEX "reviews_loan_id_key" ON "reviews"("loan_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
