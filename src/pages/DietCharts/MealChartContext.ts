import { createContext, useContext } from "react";

export interface MealChartContextValue {
    foodItems: FoodItemSelect[];
    overlay: boolean;
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MealChartContext = createContext<MealChartContextValue | null>(null);
export const MealChartProvider = MealChartContext.Provider;
export const useMealChart: () => MealChartContextValue | null = () => useContext(MealChartContext);
