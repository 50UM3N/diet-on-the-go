import { useCreateMealList, useUpdateMealList } from "@/hooks/api/mealList.hook";
import { queryClient } from "@/main";
import { mealListSchema } from "@/schema";
import { MealListInfo, UpdateMealListDTO } from "@/types/index.type";
import { Button, Group, TextInput } from "@mantine/core";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";

const MealForm: React.FC<{ onAddSuccessful?: () => void; onClose?: () => void; isEditing?: boolean; mealListInfo?: MealListInfo }> = ({ onAddSuccessful, onClose, isEditing, mealListInfo }) => {
  const { id } = useParams();
  const [createMealList, key] = useCreateMealList();
  const [updateMealList] = useUpdateMealList();
  const form = useFormik<UpdateMealListDTO>({
    initialValues: {
      name: mealListInfo?.name || "",
    },
    onSubmit: async (values) => {
      if (isEditing && mealListInfo) {
        updateMealList.mutate(
          { id: mealListInfo?.id, data: values },
          {
            onSuccess: () => {
              onAddSuccessful && onAddSuccessful();
              onClose && onClose();
              queryClient.invalidateQueries({ queryKey: key });
            },
          }
        );
      } else {
        createMealList.mutate(
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
        placeholder="eg. Breakfast"
        label="Name"
        withAsterisk
        onBlur={form.handleBlur("name")}
        onChange={(e) => form.handleChange("name")(e)}
        value={form.values.name}
        error={form.touched.name && form.errors.name}
      />
      <Group justify="right" mt="md">
        <Button variant="outline" type="button" onClick={onClose} disabled={createMealList.isPending || updateMealList.isPending}>
          Cancel
        </Button>
        <Button type="submit" loading={createMealList.isPending || updateMealList.isPending}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </Group>
    </form>
  );
};

export default MealForm;
