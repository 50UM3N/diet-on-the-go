import * as yup from "yup";
export const foodItemSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  protein: yup.number().required("Protein is required").min(0),
  fat: yup.number().required("Fat is required").min(0),
  carb: yup.number().required("Carbohydrate is required").min(0),
  metric: yup.string().required("Metric is required"),
});
export const loginSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Enter your email"),
  password: yup.string().required("Password is required"),
});

export const signupSchema = yup.object().shape({
  name: yup.string().required("Name is Required"),
  email: yup.string().required("Email is required").email("Enter your email"),
  password: yup.string().required("Password is required"),
  conformPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
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

export const resetPasswordSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  conformPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
});
