import { METRIC } from "@/data/constant";
import { db } from "@/firebase";
import { Badge, Button, Col, Grid, Group, NumberInput, Select, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { doc, updateDoc } from "firebase/firestore";
import { forwardRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useMealChart } from "./MealChartContext";

type ItemProps = React.ComponentPropsWithoutRef<"div"> & FoodItemSelect;

const FoodForm: React.FC<{
    onAddSuccessful?: () => void;
    onClose?: () => void;
    meal: DetailsMeals;
    isEditing?: boolean;
    editingFoodId?: string;
}> = ({ onAddSuccessful, onClose, meal, isEditing, editingFoodId }) => {
    const ctx = useMealChart();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const { chartId } = useParams();
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm<{ food: string; foodDetails: FoodItemSelect | null | undefined; qty: number }>({
        initialValues: {
            food: "",
            foodDetails: null,
            qty: 1,
        },
        validate: {
            food: (value) => (value ? null : "Required"),
            qty: (value) => (value > 0 ? null : "Required"),
        },
    });
    const formSubmit = async () => {
        setIsSaving(true);
        if (!user) return;
        if (!chartId) return;
        let addedFoods = meal.foods.map((item) => ({ foodId: item.food.id, qty: item.qty }));
        if (isEditing && editingFoodId) {
            addedFoods = addedFoods.map((item) =>
                item.foodId === editingFoodId ? { foodId: form.values.food, qty: form.values.qty } : item
            );
        } else {
            addedFoods.push({ foodId: form.values.food, qty: form.values.qty });
        }
        await updateDoc(doc(db, "users", user.id, "charts", chartId, "meals", meal.id), { foods: addedFoods });
        setIsSaving(false);
        onAddSuccessful && onAddSuccessful();
        onClose && onClose();
    };
    useEffect(() => {
        if (isEditing && editingFoodId) {
            const [foodItem, selectedFoodItem] = [
                meal.foods.find((item) => item.food.id === editingFoodId),
                ctx?.foodItems.find((item) => item.value === editingFoodId),
            ];
            if (!foodItem || !selectedFoodItem) return;
            form.setValues({ food: foodItem.food.id, foodDetails: selectedFoodItem, qty: foodItem.qty });
        }
    }, [isEditing, editingFoodId]);

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(({ label, protein, fat, carbohydrate, metric, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group position="apart" align="center   ">
                <Text size="sm" mb="xs" weight={500}>
                    {label}
                </Text>
                <Badge size="xs" color="red">
                    {METRIC[metric]}
                </Badge>
            </Group>
            <Group spacing="xs">
                <Badge size="xs" variant="outline" color="green">
                    {protein}g P
                </Badge>
                <Badge size="xs" variant="outline" color="orange">
                    {fat}g F
                </Badge>
                <Badge size="xs" variant="outline" color="cyan">
                    {carbohydrate}g C
                </Badge>
            </Group>
        </div>
    ));
    SelectItem.displayName = "SelectItem";
    return (
        <>
            <form onSubmit={form.onSubmit(formSubmit)} style={{ marginTop: 8 }}>
                <Grid gutter="xs">
                    <Col xs={8}>
                        <Select
                            label="Choose your food item"
                            placeholder="Pick one"
                            itemComponent={SelectItem}
                            data={ctx?.foodItems || []}
                            searchable
                            maxDropdownHeight={400}
                            {...form.getInputProps("food")}
                            onChange={(id) => {
                                form.getInputProps("food").onChange(id);
                                form.setFieldValue(
                                    "foodDetails",
                                    ctx?.foodItems.find((item) => item.value === id)
                                );
                            }}
                        />
                    </Col>
                    <Col xs={4}>
                        <NumberInput
                            min={1}
                            precision={form.values.foodDetails?.metric === "PER_100_G" ? 1 : 0}
                            placeholder="eg. 1"
                            label={`Quantity ${form.values.foodDetails?.metric ? METRIC[form.values.foodDetails.metric] : ""}`}
                            {...form.getInputProps("qty")}
                        />
                    </Col>
                </Grid>
                <Group position="right" mt="md">
                    <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSaving}>
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </Group>
            </form>
        </>
    );
};

export default FoodForm;
