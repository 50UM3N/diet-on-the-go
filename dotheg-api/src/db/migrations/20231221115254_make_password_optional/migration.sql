-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "password" TEXT,
    "dob" DATETIME,
    "height" REAL,
    "weight" REAL,
    "age" INTEGER,
    "loginType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("age", "createdAt", "dob", "email", "height", "id", "loginType", "mobile", "name", "password", "updatedAt", "weight") SELECT "age", "createdAt", "dob", "email", "height", "id", "loginType", "mobile", "name", "password", "updatedAt", "weight" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
