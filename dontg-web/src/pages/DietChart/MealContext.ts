import { createContext, useContext } from "react";

export interface MealContextValue {
  foodItems: FoodItemSelect[];
  macros: Macros;
}

export const MealContext = createContext<MealContextValue | null>(null);
export const MealProvider = MealContext.Provider;
export const useMeal: () => MealContextValue | null = () => useContext(MealContext);
