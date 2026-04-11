-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_reviews" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "loan_id" TEXT NOT NULL,
    "description" TEXT,
    "date" TEXT NOT NULL,
    CONSTRAINT "reviews_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_reviews" ("date", "description", "id", "loan_id", "rating") SELECT "date", "description", "id", "loan_id", "rating" FROM "reviews";
DROP TABLE "reviews";
ALTER TABLE "new_reviews" RENAME TO "reviews";
CREATE UNIQUE INDEX "reviews_loan_id_key" ON "reviews"("loan_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
