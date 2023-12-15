-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" REAL,
    "gender" TEXT,
    "height" REAL,
    "age" INTEGER,
    "activityLevel" INTEGER,
    "bmr" INTEGER,
    "maintenanceCalories" INTEGER,
    "adjustAmount" INTEGER,
    "adjustType" TEXT,
    "intakeCalories" INTEGER,
    "protein" INTEGER,
    "fat" INTEGER,
    "carb" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Chart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Chart" ("activityLevel", "adjustAmount", "adjustType", "age", "bmr", "carb", "createdAt", "description", "fat", "gender", "height", "id", "intakeCalories", "maintenanceCalories", "name", "protein", "updatedAt", "userId", "weight") SELECT "activityLevel", "adjustAmount", "adjustType", "age", "bmr", "carb", "createdAt", "description", "fat", "gender", "height", "id", "intakeCalories", "maintenanceCalories", "name", "protein", "updatedAt", "userId", "weight" FROM "Chart";
DROP TABLE "Chart";
ALTER TABLE "new_Chart" RENAME TO "Chart";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
