interface DietChartData {
    name: string;
    description: string;
    weight: number;
    height: {
        inches: number;
        feet: number;
    };
    gender: string;
    age: number;
    activity: string;
    bmr: number;
    maintenances_calorie: number;
    calorie_deficit_surplus_amount: number;
    calorie_deficit_surplus_type: string;
    calorie_intake: number;
    protein_intake: number;
    fat_intake: number;
    carbohydrate_intake: number;
    step: number;
    finish: boolean;
}

type METRIC = "PER_100_G" | "PER_PC";

interface FoodItem {
    id: string;
    name: string;
    carbohydrate: number;
    fat: number;
    metric: METRIC;
    protein: number;
}

interface FoodItemSelect {
    value: string;
    label: string;
    carbohydrate: number;
    fat: number;
    protein: number;
    metric: METRIC;
}

interface Meals {
    id: string;
    foods: { foodId: string; qty: number }[];
    name: string;
}

interface DetailsMeals {
    id: string;
    foods: { food: FoodItem; qty: number }[];
    name: string;
    carbohydrate: number;
    fat: number;
    protein: number;
}

interface Macros {
    carbohydrate: number;
    fat: number;
    protein: number;
}
