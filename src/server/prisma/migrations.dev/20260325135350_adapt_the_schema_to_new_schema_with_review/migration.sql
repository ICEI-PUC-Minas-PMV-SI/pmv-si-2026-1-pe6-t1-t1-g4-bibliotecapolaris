/*
  Warnings:

  - You are about to drop the column `edition_id` on the `loans` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `reviews` table. All the data in the column will be lost.
  - Added the required column `book_id` to the `loans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loan_id` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_loans" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "student_id" TEXT NOT NULL,
    "book_id" TEXT NOT NULL,
    "loan_date" DATETIME NOT NULL,
    "due_date" DATETIME NOT NULL,
    "return_date" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "loans_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "loans_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_loans" ("due_date", "id", "loan_date", "return_date", "status", "student_id") SELECT "due_date", "id", "loan_date", "return_date", "status", "student_id" FROM "loans";
DROP TABLE "loans";
ALTER TABLE "new_loans" RENAME TO "loans";
CREATE TABLE "new_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "loan_id" TEXT NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL,
    CONSTRAINT "reviews_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("date", "description", "id", "rating") SELECT "date", "description", "id", "rating" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
CREATE UNIQUE INDEX "reviews_loan_id_key" ON "reviews"("loan_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
