/*
  Warnings:

  - You are about to drop the column `chartId` on the `MealList` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MealChart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "chartId" TEXT,
    CONSTRAINT "MealChart_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MealList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mealChartId" TEXT,
    CONSTRAINT "MealList_mealChartId_fkey" FOREIGN KEY ("mealChartId") REFERENCES "MealChart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MealList" ("createdAt", "id", "name", "updatedAt") SELECT "createdAt", "id", "name", "updatedAt" FROM "MealList";
DROP TABLE "MealList";
ALTER TABLE "new_MealList" RENAME TO "MealList";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
