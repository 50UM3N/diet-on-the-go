-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "password" TEXT NOT NULL,
    "dob" DATETIME,
    "height" REAL,
    "weight" REAL,
    "age" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FoodItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "carb" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "mealListId" TEXT,
    CONSTRAINT "FoodItem_mealListId_fkey" FOREIGN KEY ("mealListId") REFERENCES "MealList" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

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
    "maintenanceCalories" INTEGER NOT NULL,
    "adjustAmount" INTEGER NOT NULL,
    "adjustType" TEXT NOT NULL,
    "intakeCalories" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fat" INTEGER NOT NULL,
    "carb" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Chart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MealList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "chartId" TEXT,
    CONSTRAINT "MealList_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
