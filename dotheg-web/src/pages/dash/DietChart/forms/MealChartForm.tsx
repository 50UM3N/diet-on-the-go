import { useCreateMealChart, useUpdateMealChart } from "@/hooks/api/mealChart.hook";
import { queryClient } from "@/main";
import { mealListSchema } from "@/schema";
import { MealChartInfo, UpdateMealChartDTO } from "@/types/index.type";
import { Button, Group, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";

const MealChartForm: React.FC<{ onAddSuccessful?: () => void; onClose?: () => void; isEditing?: boolean; mealChartInfo?: MealChartInfo }> = ({ onAddSuccessful, onClose, isEditing, mealChartInfo }) => {
  const { id } = useParams();
  const [createMealChart, key] = useCreateMealChart();
  const [updateMealChart] = useUpdateMealChart();
  const form = useFormik<UpdateMealChartDTO>({
    initialValues: {
      name: mealChartInfo?.name || "",
    },
    onSubmit: async (values) => {
      if (isEditing && mealChartInfo) {
        updateMealChart.mutate(
          { id: mealChartInfo?.id, data: values },
          {
            onSuccess: () => {
              onAddSuccessful && onAddSuccessful();
              onClose && onClose();
              queryClient.invalidateQueries({ queryKey: key });
            },
          }
        );
      } else {
        createMealChart.mutate(
          {
            name: values.name,
            chartId: id as string,
          },
          {
            onSuccess: () => {
              onAddSuccessful && onAddSuccessful();
              onClose && onClose();
              queryClient.invalidateQueries({ queryKey: key });
            },
          }
        );
      }
    },
    validationSchema: mealListSchema,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextInput
        mb="xs"
        placeholder="eg. Veg Chart"
        label="Name"
        withAsterisk
        onBlur={form.handleBlur("name")}
        onChange={(e) => form.handleChange("name")(e)}
        value={form.values.name}
        error={form.touched.name && form.errors.name}
      />
      <Group justify="right" mt="md">
        <Button variant="outline" type="button" onClick={onClose} disabled={createMealChart.isPending || updateMealChart.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={createMealChart.isPending || updateMealChart.isPending}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </Group>
    </form>
  );
};

export default MealChartForm;
