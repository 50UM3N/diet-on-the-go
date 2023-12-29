import { Icon } from "@tabler/icons-react";
export interface MacrosInfo {
  protein: number;
  carb: number;
  fat: number;
}
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
  loginType?: string;
  createdAt?: string;
  updatedAt?: string;
  chart?: ChartInfo[];
}

export interface UpdateUserDTO {
  name?: string;
  mobile?: string;
  dob?: string;
  height?: number;
  weight?: number;
  age?: number;
}

export interface ResetPasswordDTO {
  oldPassword: string;
  password: string;
  confirmPassword: string;
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
}
export interface CreateChartDTO {
  name: string;
  description: string;
}

export interface UpdateChartDTO {
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
}

export interface MealListInfo {
  id: string;
  name: string;
  mealFood: MealFoodInfo[];
  createdAt: string;
  updatedAt: string;
  chart?: ChartInfo;
}

export interface CreateMealListDTO {
  name: string;
  chartId: string;
}

export interface UpdateMealListDTO {
  name: string;
}

export interface MealFoodInfo {
  id: string;
  qty: number;
  foodItem: FoodItemInfo;
  createdAt: string;
  updatedAt: string;
  mealList?: MealListInfo;
}

export interface CreateMealFoodDto {
  qty: number;
  foodItemId: string;
  mealListId: string;
}

export interface UpdateMealFoodDto {
  qty: number;
  foodItemId: string;
}
