import { db } from "@/firebase";
import { Button, Divider, Group, LoadingOverlay, Modal, Paper, Stack, Title } from "@mantine/core";
import { IconFile, IconPlus } from "@tabler/icons-react";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { calcAmount } from "@/utils";
import useStyles from "./style";
import { MealChartProvider } from "./MealChartContext";
import Meal from "./Meal";
import MealForm from "./MealForm";
import MacrosBadge from "@/components/MacrosBadge";

const MealChart: React.FC<{ data: DietChartData }> = ({ data }) => {
    const { cx, classes } = useStyles();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const { chartId } = useParams();
    const [loading, setLoading] = useState(chartId ? true : false);
    const [foodItems, setFoodItems] = useState<FoodItemSelect[]>([]);
    const [_data, setData] = useState<DetailsMeals[]>();
    const [overlay, setOverlay] = useState(false);
    const [mealPopper, setMealPopper] = useState(false);
    const [editingMealItem, setEditingMealItem] = useState<DetailsMeals>();
    const [totalMacros, setTotalMacros] = useState<Macros>({ protein: 0, carbohydrate: 0, fat: 0 });

    const handleMealEditing = (item: DetailsMeals) => {
        setEditingMealItem(item);
        setMealPopper(true);
        setOverlay(true);
    };

    useEffect(() => {
        if (!user) return;
        if (!chartId) return;
        setLoading(true);
        const unsubscribe = onSnapshot(
            query(collection(db, "users", user.id, "charts", chartId, "meals"), orderBy("createdAt")),
            async (snapshot) => {
                const data: DetailsMeals[] = [];
                let _protein = 0;
                let _fat = 0;
                let _carbohydrate = 0;
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
                    _protein += protein;
                    _carbohydrate += carbohydrate;
                    _fat += fat;
                    data.push({ id: item.id, name: dataItem.name, foods: foodItems, protein, carbohydrate, fat });
                }
                setTotalMacros({
                    protein: Number(_protein.toFixed(1)),
                    carbohydrate: Number(_carbohydrate.toFixed(1)),
                    fat: Number(_fat.toFixed(1)),
                });

                setData(data);
                setLoading(false);
            }
        );
        const unsubscribeFoodItems = onSnapshot(collection(db, "foodItems"), (snapshot) => {
            const data = snapshot.docs.map((item) => {
                const dataItem = item.data();
                return { value: item.id, label: dataItem.name, ...dataItem };
            }) as any;
            setFoodItems(data);
        });
        return () => {
            unsubscribe();
            unsubscribeFoodItems();
        };
    }, [chartId]);
    return (
        <MealChartProvider
            value={{
                foodItems,
                overlay,
                setOverlay,
                macros: totalMacros,
            }}
        >
            <Paper style={{ position: "relative" }} mt="md">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <Group position="apart" mb="xs" className={cx({ [classes.overlay]: overlay })}>
                    <Title order={4}>Meal List</Title>
                    <Group spacing="xs">
                        <Button
                            disabled={overlay}
                            leftIcon={<IconPlus size={14} />}
                            size="xs"
                            onClick={() => {
                                setMealPopper(true);
                                setOverlay(true);
                            }}
                            data-no-print
                        >
                            Add Meal
                        </Button>
                        <Button
                            disabled={overlay}
                            leftIcon={<IconFile size={14} />}
                            size="xs"
                            onClick={() => {
                                window.print();
                            }}
                            data-no-print
                        >
                            Export
                        </Button>
                    </Group>
                </Group>
                <Divider my="xs" />
                <MacrosBadge style={{ flex: 1 }} wrapper={{ mb: "sm" }} {...totalMacros} color="blue" size="lg" />
                <Stack spacing="xs">
                    {_data?.map((item) => (
                        <Meal data={item} key={item.id} onEdit={() => handleMealEditing(item)} />
                    ))}
                </Stack>
            </Paper>

            <Modal
                styles={{
                    root: {
                        "& .mantine-Paper-root": { padding: 16 },
                    },
                }}
                centered
                padding={0}
                opened={mealPopper}
                onClose={() => {
                    setEditingMealItem(undefined);
                    setMealPopper(false);
                    setOverlay(false);
                }}
                title={editingMealItem ? "Update Your Meal" : "Add New Meal"}
            >
                <MealForm
                    isEditing={editingMealItem ? true : false}
                    editingItem={editingMealItem}
                    onClose={() => {
                        setEditingMealItem(undefined);
                        setMealPopper(false);
                        setOverlay(false);
                    }}
                />
            </Modal>
        </MealChartProvider>
    );
};

export default MealChart;
