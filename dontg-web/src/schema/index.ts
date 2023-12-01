import * as yup from "yup";
export const foodItemSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  protein: yup.number().required("Protein is required").moreThan(0),
  fat: yup.number().required("Fat is required").moreThan(0),
  carb: yup.number().required("Carbohydrate is required").moreThan(0),
  metric: yup.string().required("Metric is required"),
});

export const createChartSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const updateChartSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  weight: yup.number().required("weight is required").moreThan(0),
  heightInches: yup.number().required("height is required").moreThan(0),
  heightFeet: yup.number().required("height is required"),
  age: yup.number().required("age is required").moreThan(0),
  activityLevel: yup.number().required("activityLevel is required").moreThan(0),
  bmr: yup.number().required("bmr is required").moreThan(0),
  maintenanceCalories: yup.number().required("maintenanceCalories is required").moreThan(0),
  intakeCalories: yup.number().required("intakeCalories is required").moreThan(0),
  adjustAmount: yup.number().required("weight is required").moreThan(0),
  gender: yup.string().required("gender is required"),
  adjustType: yup.string().required("adjustType is required"),
});

export const mealListSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const mealFoodSchema = yup.object().shape({
  qty: yup.number().required("qty is required").moreThan(0),
});
