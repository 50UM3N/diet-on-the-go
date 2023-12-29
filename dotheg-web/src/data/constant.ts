export const ACTIVITY_LEVEL = {
  SEDENTARY: {
    label: "Sedentary (little or no exercise)",
    value: 1.2,
  },
  LIGHT_ACTIVITY: {
    label: "Lightly active (exercise 1–3 days/week)",
    value: 1.375,
  },
  MODERATELY_ACTIVITY: {
    label: "Moderately active (exercise 3–5 days/week)",
    value: 1.55,
  },
  ACTIVE: {
    label: "Active (exercise 6–7 days/week)",
    value: 1.725,
  },
  VERY_ACTIVE: {
    label: "Very active (hard exercise 6–7 days/week)",
    value: 1.9,
  },
};
export enum EntryBase {
  FOOD_ITEM = "food-item",
  CHART = "chart",
  MEAL_CHART = "meal-chart",
  MEAL_LIST = "meal-list",
  USER = "user",
  MEAL_FOOD = "meal-list/meal-food",
}
export const QueryList = Object.values(EntryBase);

export const METRIC = {
  GRAM: "/100g",
  PIECE: "/pc",
  ML: "/ml",
};
