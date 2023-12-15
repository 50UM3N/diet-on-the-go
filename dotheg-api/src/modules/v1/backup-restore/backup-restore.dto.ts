import { Chart, FoodItem, MealFood, MealList } from "@prisma/client";

export interface RestoreDTO {
  charts: (Chart & {
    mealList: (MealList & {
      mealFood: (MealFood & {
        foodItem: FoodItem;
      })[];
    })[];
  })[];
  foodItems: FoodItem[];
}
