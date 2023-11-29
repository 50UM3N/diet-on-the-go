import * as yup from "yup";
export const foodItemSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  protein: yup.number().required("Protein is required").moreThan(0),
  fat: yup.number().required("Fat is required").moreThan(0),
  carb: yup.number().required("Carbohydrate is required").moreThan(0),
  metric: yup.string().required("Metric is required"),
});
