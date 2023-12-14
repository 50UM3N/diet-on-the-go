/*
  Warnings:

  - You are about to drop the column `mealListId` on the `FoodItem` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MealFood" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "qty" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mealListId" TEXT,
    "foodItemId" TEXT NOT NULL,
    CONSTRAINT "MealFood_foodItemId_fkey" FOREIGN KEY ("foodItemId") REFERENCES "FoodItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MealFood_mealListId_fkey" FOREIGN KEY ("mealListId") REFERENCES "MealList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "carb" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FoodItem" ("carb", "createdAt", "fat", "id", "metric", "name", "protein", "updatedAt") SELECT "carb", "createdAt", "fat", "id", "metric", "name", "protein", "updatedAt" FROM "FoodItem";
DROP TABLE "FoodItem";
ALTER TABLE "new_FoodItem" RENAME TO "FoodItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
