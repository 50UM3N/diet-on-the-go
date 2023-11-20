-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" REAL NOT NULL,
    "gender" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "age" INTEGER NOT NULL,
    "activityLevel" INTEGER NOT NULL,
    "bmr" INTEGER NOT NULL,
    "maintainanceCalories" INTEGER NOT NULL,
    "adjustAmount" INTEGER NOT NULL,
    "adjustType" TEXT NOT NULL,
    "intakeCalories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "carb" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MealList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "chartId" TEXT,
    CONSTRAINT "MealList_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "updatedAt" DATETIME NOT NULL,
    "mealListId" TEXT,
    CONSTRAINT "FoodItem_mealListId_fkey" FOREIGN KEY ("mealListId") REFERENCES "MealList" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodItem" ("carb", "createdAt", "fat", "id", "metric", "name", "protein", "updatedAt") SELECT "carb", "createdAt", "fat", "id", "metric", "name", "protein", "updatedAt" FROM "FoodItem";
DROP TABLE "FoodItem";
ALTER TABLE "new_FoodItem" RENAME TO "FoodItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
