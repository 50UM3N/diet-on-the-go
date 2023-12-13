import * as yup from "yup";
export const foodItemSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  protein: yup.number().required("Protein is required").min(0, "Protein must be greater than 0"),
  fat: yup.number().required("Fat is required").min(0, "Fat must be greater than 0"),
  carb: yup.number().required("Carbohydrate is required").min(0, "Carbohydrate must be greater than 0"),
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
  weight: yup.number().required("Weight is required").moreThan(0, "Weight must be greater than 0"),
  heightInches: yup.number().required("Height (in inches) is required").moreThan(0, "Height must be greater than 0"),
  heightFeet: yup.number().required("Height (in feet) is required").moreThan(0, "Height must be greater than 0"),
  age: yup.number().required("Age is required").moreThan(0, "Age must be greater than 0"),
  activityLevel: yup.number().required("Activity level is required").moreThan(0, "Activity level must be greater than 0"),
  bmr: yup.number().required("BMR is required").moreThan(0, "BMR must be greater than 0"),
  maintenanceCalories: yup.number().required("Maintenance calories are required").moreThan(0, "Maintenance calories must be greater than 0"),
  intakeCalories: yup.number().required("Intake calories are required").moreThan(0, "Intake calories must be greater than 0"),
  adjustAmount: yup.number().required("Adjust amount is required").moreThan(0, "Adjust amount must be greater than 0"),
  gender: yup.string().required("Gender is required"),
  adjustType: yup.string().required("Adjust type is required"),
});

export const mealListSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

export const mealFoodSchema = yup.object().shape({
  qty: yup.number().required("Quantity is required").moreThan(0, "Quantity must be greater than 0"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  conformPassword: yup
    .string()
    .required("Please retype your password.")
    .oneOf([yup.ref("password")], "Your passwords do not match."),
});

export const updateUserSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  mobile: yup.number().required("Mobile number is required"),
  heightFeet: yup.number().required("Height (in feet) is required").moreThan(0, "Height must be greater than 0"),
  heightInches: yup.number().required("Height (in inches) is required").moreThan(0, "Height must be greater than 0").lessThan(12, "Height (in inches) must be less than 12"),
  weight: yup.number().required("Weight is required").moreThan(0, "Weight must be greater than 0"),
  dob: yup.string().required("Date of Birth is required"),
});
