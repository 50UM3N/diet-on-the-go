import { useGetFoodItem } from "@/hooks/api/foodItem.hook";
import { useCreateMealFood, useUpdateMealFood } from "@/hooks/api/mealFood.hook";
import { queryClient } from "@/main";
import { mealFoodSchema } from "@/schema";
import { MealFoodInfo, UpdateMealFoodDto } from "@/types/index.type";
import { Button, Grid, Group, NumberInput, Select } from "@mantine/core";
import { useFormik } from "formik";

const FoodForm: React.FC<{
  onAddSuccessful?: () => void;
  onClose?: () => void;
  mealFood?: MealFoodInfo;
  isEditing?: boolean;
  mealListId: string;
}> = ({ onAddSuccessful, onClose, mealFood, isEditing, mealListId }) => {
  const [foodItem] = useGetFoodItem();
  const [createMealFood] = useCreateMealFood();
  const [updateMealFood] = useUpdateMealFood();
  const form = useFormik<UpdateMealFoodDto>({
    initialValues: {
      qty: mealFood?.qty || 0,
      foodItemId: mealFood?.foodItem?.id || "",
    },
    onSubmit: async (values) => {
      values.qty = Number(values.qty);
      if (isEditing && mealFood) {
        updateMealFood.mutate(
          { id: mealFood.id, data: values },
          {
            onSuccess: () => {
              onAddSuccessful && onAddSuccessful();
              onClose && onClose();
              queryClient.invalidateQueries();
            },
          }
        );
      } else {
        createMealFood.mutate(
          {
            qty: values.qty,
            foodItemId: values.foodItemId,
            mealListId: mealListId,
          },
          {
            onSuccess: () => {
              onAddSuccessful && onAddSuccessful();
              onClose && onClose();
              queryClient.invalidateQueries();
            },
          }
        );
      }
    },
    validationSchema: mealFoodSchema,
  });

  // const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, protein, fat, carbohydrate, metric, ...others }: ItemProps, ref) => (
  //   <div ref={ref} {...others}>
  //     <Group grow align="center">
  //       <Text size="sm" mb="xs" fw={500}>
  //         {label}
  //       </Text>
  //       <Badge size="xs" color="red">
  //         {METRIC[metric]}
  //       </Badge>
  //     </Group>
  //     <Group gap="xs">
  //       <Badge size="xs" variant="outline" color="green">
  //         {protein}g P
  //       </Badge>
  //       <Badge size="xs" variant="outline" color="orange">
  //         {fat}g F
  //       </Badge>
  //       <Badge size="xs" variant="outline" color="cyan">
  //         {carbohydrate}g C
  //       </Badge>
  //     </Group>
  //   </div>
  // ));
  // SelectItem.displayName = "SelectItem";
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Grid gutter="xs">
          <Grid.Col span={{ xs: 8 }}>
            <Select
              label="Choose your food item"
              placeholder="Pick one"
              // // @ts-ignore
              // itemComponent={SelectItem}
              data={foodItem.data?.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
              searchable
              maxDropdownHeight={400}
              onBlur={form.handleBlur("foodItemId")}
              onChange={(e) => form.handleChange("foodItemId")(String(e))}
              value={form.values.foodItemId}
              error={form.touched.foodItemId && form.errors.foodItemId}
            />
          </Grid.Col>
          <Grid.Col span={{ xs: 4 }}>
            <NumberInput
              min={1}
              placeholder="eg. 1"
              label={`Quantity `}
              onBlur={form.handleBlur("qty")}
              onChange={(e) => form.handleChange("qty")(String(e))}
              value={form.values.qty}
              error={form.touched.qty && form.errors.qty}
            />
          </Grid.Col>
        </Grid>
        <Group justify="right" mt="md">
          <Button variant="outline" type="button" onClick={onClose} disabled={createMealFood.isLoading || updateMealFood.isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={createMealFood.isLoading || updateMealFood.isLoading}>
            {isEditing ? "Update" : "Add"}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default FoodForm;
