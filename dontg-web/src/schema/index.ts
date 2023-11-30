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
