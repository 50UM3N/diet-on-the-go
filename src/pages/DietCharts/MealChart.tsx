import { db } from "@/firebase";
import { Button, Group, Paper, Popover, Stack, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { calcAmount } from "@/utils";
import useStyles from "./style";
import { MealChartProvider } from "./MealChartContext";
import Meal from "./Meal";
import MealForm from "./MealForm";

const MealChart: React.FC<{ data: DietChartData }> = ({ data }) => {
    const { cx, classes } = useStyles();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const [loading, setLoading] = useState(id ? true : false);
    const [foodItems, setFoodItems] = useState<FoodItemSelect[]>([]);
    const [_data, setData] = useState<DetailsMeals[]>();
    const [overlay, setOverlay] = useState(false);
    const [mealPopper, setMealPopper] = useState(false);
    const [editingMealItem, setEditingMealItem] = useState<DetailsMeals>();

    const handleMealEditing = (item: DetailsMeals) => {
        setEditingMealItem(item);
        setMealPopper(true);
        setOverlay(true);
    };

    useEffect(() => {
        if (!user) return;
        if (!id) return;
        setLoading(true);
        const unsubscribe = onSnapshot(collection(db, "users", user.id, "charts", id, "meals"), async (snapshot) => {
            const data: DetailsMeals[] = [];
            for (let j = 0; j < snapshot.docs.length; j++) {
                const item = snapshot.docs[j];
                const dataItem = item.data() as Omit<Meals, "id">;
                let protein = 0;
                let fat = 0;
                let carbohydrate = 0;
                const foodItems: { food: FoodItem; qty: number }[] = [];
                for (let i = 0; i < dataItem.foods.length; i++) {
                    const element = dataItem.foods[i];
                    const foodDoc = await getDoc(doc(db, "foodItems", element.foodId));
                    const foodData = foodDoc.data() as Omit<FoodItem, "id">;
                    foodData.protein = calcAmount(foodData.protein, element.qty, foodData.metric);
                    protein += foodData.protein;
                    foodData.fat = calcAmount(foodData.fat, element.qty, foodData.metric);
                    fat += foodData.fat;
                    foodData.carbohydrate = calcAmount(foodData.carbohydrate, element.qty, foodData.metric);
                    carbohydrate += foodData.carbohydrate;
                    foodItems.push({ food: { id: foodDoc.id, ...foodData }, qty: element.qty });
                }
                data.push({ id: item.id, name: dataItem.name, foods: foodItems, protein, carbohydrate, fat });
            }

            setData(data);
            setLoading(false);
        });
        const unsubscribeFoodItems = onSnapshot(collection(db, "foodItems"), (snapshot) => {
            const data = snapshot.docs.map((item) => {
                const dataItem = item.data();
                return { value: item.id, label: dataItem.name, ...dataItem };
            }) as any;
            setFoodItems(data);
            console.log(data);
        });
        return () => {
            unsubscribe();
            unsubscribeFoodItems();
        };
    }, [id]);
    return (
        <MealChartProvider
            value={{
                foodItems,
                overlay,
                setOverlay,
            }}
        >
            <Popover
                position="bottom-end"
                width={300}
                opened={mealPopper}
                shadow="xl"
                styles={{
                    dropdown: { boxShadow: "0 1px 2px 0 rgb(60 64 67 / 30%), 0 1px 3px 1px rgb(60 64 67 / 15%)", border: "0px" },
                }}
            >
                <Paper style={{ position: "relative" }} mt="md">
                    <Group position="apart" mb="md" className={cx({ [classes.overlay]: overlay })}>
                        <Title order={4}>Create Your Meal</Title>
                        <Popover.Target>
                            <Button
                                disabled={overlay}
                                leftIcon={<IconPlus size={14} />}
                                size="xs"
                                onClick={() => {
                                    setMealPopper(true);
                                    setOverlay(true);
                                }}
                            >
                                Add Meal
                            </Button>
                        </Popover.Target>
                    </Group>
                    <Stack spacing="xs">
                        {_data?.map((item) => (
                            <Meal data={item} key={item.id} onEdit={() => handleMealEditing(item)} />
                        ))}
                    </Stack>
                </Paper>

                <Popover.Dropdown>
                    <MealForm
                        isEditing={editingMealItem ? true : false}
                        editingItem={editingMealItem}
                        onClose={() => {
                            setEditingMealItem(undefined);
                            setMealPopper(false);
                            setOverlay(false);
                        }}
                    />
                </Popover.Dropdown>
            </Popover>
        </MealChartProvider>
    );
};

export default MealChart;
