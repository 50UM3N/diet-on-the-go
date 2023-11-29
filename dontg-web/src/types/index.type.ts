import { Icon } from "@tabler/icons-react";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
}
export interface LinksData {
  link: string;
  label: string;
  icon: Icon;
  links?: { link: string; label: string }[];
  exact?: boolean;
}
export type Gender = "male" | "female";

export interface AppError {
  message: string;
}

export type HTTPMethods = "GET" | "PUT" | "CONNECT" | "DELETE" | "POST" | "OPTIONS" | "TRACE" | "PATCH" | "HEAD";

export type Modify<T, R> = Omit<T, keyof R> & R;

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  mobile?: string;
  dob?: string;
  height?: number;
  weight?: number;
  age?: number;
  createdAt: string;
  updatedAt: string;
  Chart: ChartInfo[];
}

export interface FoodItemInfo {
  id: string;
  name: string;
  metric: string;
  protein: number;
  fat: number;
  carb: number;
  createdAt: string;
  updatedAt: string;
  MealList?: MealListInfo;
  mealListId?: string;
}
export interface FoodItemDTO {
  name: string;
  metric: string;
  protein: number;
  fat: number;
  carb: number;
  mealListId?: string;
}
export interface ChartInfo {
  id: string;
  name: string;
  description: string;
  weight: number;
  gender: string;
  height: number;
  age: number;
  activityLevel: number;
  bmr: number;
  maintenanceCalories: number;
  adjustAmount: number;
  adjustType: string;
  intakeCalories: number;
  protein: number;
  fat: number;
  carb: number;
  user: UserInfo;
  mealList: MealListInfo[];
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface MealListInfo {
  id: string;
  name: string;
  foodItem: FoodItemInfo[];
  createdAt: string;
  updatedAt: string;
  Chart?: ChartInfo;
  chartId?: string;
}
