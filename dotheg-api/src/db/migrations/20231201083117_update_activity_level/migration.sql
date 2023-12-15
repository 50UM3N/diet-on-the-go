/*
  Warnings:

  - You are about to alter the column `qty` on the `MealFood` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - You are about to alter the column `activityLevel` on the `Chart` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealFood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qty" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mealListId" TEXT,
    "foodItemId" TEXT NOT NULL,
    CONSTRAINT "MealFood_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealFood_mealListId_fkey" FOREIGN KEY ("mealListId") REFERENCES "MealList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealFood" ("createdAt", "foodItemId", "id", "mealListId", "qty", "updatedAt") SELECT "createdAt", "foodItemId", "id", "mealListId", "qty", "updatedAt" FROM "MealFood";
DROP TABLE "MealFood";
ALTER TABLE "new_MealFood" RENAME TO "MealFood";
CREATE TABLE "new_Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" REAL,
    "gender" TEXT,
    "height" REAL,
    "age" INTEGER,
    "activityLevel" REAL,
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
