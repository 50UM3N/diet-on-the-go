import { db } from "@/firebase";
import { ActionIcon, Badge, Button, Center, Col, Divider, Grid, Group, LoadingOverlay, Menu, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { IconDotsVertical, IconFile, IconPencil, IconPlus, IconSalad, IconTrash } from "@tabler/icons-react";
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { calToGm, calcAmount, calcPercentage } from "@/utils";
import MacrosBadge from "@/components/MacrosBadge";
import MealForm from "./forms/MealForm";
import { showNotification } from "@mantine/notifications";
import FoodForm from "./forms/FoodForm";
import { MealProvider } from "./MealContext";

const Data = ({ data }: { data: DietChartData }) => {
  const { chartId } = useParams();
  const [loading, setLoading] = useState(true);
  const user = useSelector<RootState, User | null>((state) => state.user.user);
  const [totalMacros, setTotalMacros] = useState<Macros>({ protein: 0, carbohydrate: 0, fat: 0 });
  const [foodItems, setFoodItems] = useState<FoodItemSelect[]>([]);
  const [list, setList] = useState<DetailsMeals[]>();
  console.log(list);

  const [mealModal, setMealModal] = useState<{
    open: boolean;
    isEditing: boolean;
    data?: DetailsMeals;
  }>({ open: false, isEditing: false });

  const [deleteMealModal, setDeleteMealModal] = useState<{ open: boolean; isDeleting: boolean; mealId?: string }>({
    open: false,
    isDeleting: false,
  });

  const [foodModal, setFoodModal] = useState<{ open: boolean; isEditing: boolean; foodId?: string; meal?: DetailsMeals }>({
    open: false,
    isEditing: false,
  });

  const [deleteFoodModal, setDeleteFoodModal] = useState<{
    open: boolean;
    isDeleting: boolean;
    foodId?: string;
    meal?: DetailsMeals;
  }>({
    open: false,
    isDeleting: false,
    meal: undefined,
  });
  useEffect(() => {
    if (!user) return;
    if (!chartId) return;
    setLoading(true);
    const unsubscribe = onSnapshot(query(collection(db, "users", user.id, "charts", chartId, "meals"), orderBy("createdAt")), async (snapshot) => {
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
      setList(data);
      setLoading(false);
    });
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

  const handleDeleteMeal = async () => {
    if (!chartId) return;
    if (!user) return;
    if (!deleteMealModal.mealId) return;
    setDeleteMealModal((s) => ({ ...s, isDeleting: true }));
    await deleteDoc(doc(db, "users", user.id, "charts", chartId, "meals", deleteMealModal.mealId));
    setDeleteMealModal({ open: false, isDeleting: false, mealId: undefined });
    showNotification({ message: "Successfully deleted meal" });
  };

  const handleDeleteFood = async () => {
    if (!chartId) return;
    if (!user) return;
    if (!deleteFoodModal.meal) return;
    setDeleteFoodModal((s) => ({ ...s, isDeleting: true }));
    const updatedFoodList = deleteFoodModal.meal.foods.map((item) => ({ foodId: item.food.id, qty: item.qty })).filter((item) => item.foodId !== deleteFoodModal.foodId);
    await updateDoc(doc(db, "users", user.id, "charts", chartId, "meals", deleteFoodModal.meal.id), { foods: updatedFoodList });
    setDeleteFoodModal({ open: false, isDeleting: false, foodId: undefined, meal: undefined });
    showNotification({ message: "Successfully deleted Food" });
  };

  return (
    <MealProvider
      value={{
        foodItems,
        macros: totalMacros,
      }}
    >
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Grid grow gutter="xs">
        <Col span={3}>
          <Paper bg="gray.0" p={6}>
            <Title order={6} mb={4} align="center">
              Calories
            </Title>
            <Center>
              <Badge size="xs" variant="filled">
                100%
              </Badge>
            </Center>
            <Text size="xs" align="center" mt={4}>
              {data.calorie_intake}
            </Text>
          </Paper>
        </Col>
        <Col span={3}>
          <Paper bg="gray.0" p={6}>
            <Title order={6} mb={4} align="center">
              Protein
            </Title>
            <Center>
              <Badge size="xs" color="cyan" variant="filled">
                {data.protein_intake}%
              </Badge>
            </Center>
            <Text size="xs" align="center" mt={4}>
              {calToGm(calcPercentage(data.calorie_intake, data.protein_intake), "protein")}g
            </Text>
          </Paper>
        </Col>
        <Col span={3}>
          <Paper bg="gray.0" p={6}>
            <Title order={6} mb={4} align="center">
              Fat
            </Title>
            <Center>
              <Badge size="xs" color="orange" variant="filled">
                {data.fat_intake}%
              </Badge>
            </Center>
            <Text size="xs" align="center" mt={4}>
              {calToGm(calcPercentage(data.calorie_intake, data.fat_intake), "fat")}g
            </Text>
          </Paper>
        </Col>
        <Col span={3}>
          <Paper bg="gray.0" p={6}>
            <Title order={6} mb={4} align="center">
              Carb
            </Title>
            <Center>
              <Badge size="xs" color="green" variant="filled">
                {data.carbohydrate_intake}%
              </Badge>
            </Center>
            <Text size="xs" align="center" mt={4}>
              {calToGm(calcPercentage(data.calorie_intake, data.carbohydrate_intake), "carbohydrates")}g
            </Text>
          </Paper>
        </Col>
      </Grid>
      <Divider my="xs" />

      <Group position="apart" mb="xs">
        <Title order={4}>Meal List</Title>
        <Group spacing="xs">
          <Button
            leftIcon={<IconPlus size={14} />}
            size="xs"
            onClick={() => {
              setMealModal({
                open: true,
                isEditing: false,
              });
            }}
            data-no-print
          >
            Add Meal
          </Button>
          <Button
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

      <table className="test-table" style={{ width: "100%" }}>
        <tbody>
          <tr className="t-head">
            <td style={{}}>Name</td>
            <td style={{ width: "12%" }}>Amount</td>
            <td style={{ width: "12%" }}>Protein</td>
            <td style={{ width: "12%" }}>Carbohydrate </td>
            <td style={{ width: "12%" }}>Fat</td>
            <td style={{ width: "80px" }}>Action</td>
          </tr>
          {list?.map((item) => (
            <Fragment key={item.id}>
              <tr className="t-meal-head">
                <td colSpan={2}>{item.name}</td>
                <td>{item.protein.toFixed(2)} g</td>
                <td>{item.carbohydrate.toFixed(2)} g</td>
                <td>{item.fat.toFixed(2)} g</td>
                <td>
                  <Group spacing="xs">
                    <ActionIcon
                      size={14}
                      data-no-print
                      variant="light"
                      color="blue"
                      onClick={() => {
                        setFoodModal({
                          open: true,
                          meal: item,
                          isEditing: false,
                        });
                      }}
                    >
                      <IconPlus size={12} />
                    </ActionIcon>
                    <Menu shadow="md" width={100} position="bottom-end">
                      <Menu.Target>
                        <ActionIcon size={14} variant="light" data-no-print>
                          <IconDotsVertical size={12} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Item icon={<IconPencil size={14} />} onClick={() => setMealModal({ open: true, isEditing: true, data: item })}>
                          Edit
                        </Menu.Item>
                        <Menu.Item
                          color="red"
                          icon={<IconTrash size={14} />}
                          onClick={() =>
                            setDeleteMealModal({
                              open: true,
                              isDeleting: false,
                              mealId: item.id,
                            })
                          }
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </td>
              </tr>
              {item.foods.map((food) => {
                return (
                  <tr key={food.food.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 8 }}>
                        <IconSalad size={14} />
                        {food.food.name}
                      </div>
                    </td>
                    <td>
                      {food.qty} {food.food.metric === "PER_100_G" ? "g" : "pc "}
                    </td>
                    <td>{food.food.protein} g</td>
                    <td>{food.food.carbohydrate} g</td>
                    <td>{food.food.fat} g</td>
                    <td>
                      <Group spacing="xs" data-no-print>
                        <ActionIcon size={14} onClick={() => setFoodModal({ open: true, meal: item, isEditing: true, foodId: food.food.id })}>
                          <IconPencil size="12px" />
                        </ActionIcon>
                        <ActionIcon
                          size={14}
                          color="red"
                          onClick={() =>
                            setDeleteFoodModal({
                              open: true,
                              isDeleting: false,
                              foodId: food.food.id,
                              meal: item,
                            })
                          }
                        >
                          <IconTrash size="12px" />
                        </ActionIcon>
                      </Group>
                    </td>
                  </tr>
                );
              })}
            </Fragment>
          ))}
        </tbody>
      </table>

      {/* modals */}

      {/* meal modal */}
      <Modal
        styles={{
          root: {
            "& .mantine-Paper-root": { padding: 16 },
          },
        }}
        centered
        padding={0}
        opened={mealModal.open}
        onClose={() => {
          setMealModal({
            open: false,
            isEditing: false,
            data: undefined,
          });
        }}
        title={mealModal.isEditing ? "Update Your Meal" : "Add New Meal"}
      >
        <MealForm
          isEditing={mealModal.isEditing}
          editingItem={mealModal.data}
          onClose={() => {
            setMealModal({
              open: false,
              isEditing: false,
              data: undefined,
            });
          }}
        />
      </Modal>
      {/* end of meal modal */}

      {/* delete meal modal */}

      <Modal opened={deleteMealModal.open} onClose={() => setDeleteMealModal({ open: false, isDeleting: false, mealId: undefined })} title="Please confirm your action" centered>
        <Text size="sm" mb="xl">
          Are you sure want to delete your meal?
        </Text>
        <Group position="right">
          <Button size="xs" onClick={() => setDeleteMealModal({ open: false, isDeleting: false, mealId: undefined })} variant="outline" disabled={deleteMealModal.isDeleting}>
            Cancel
          </Button>
          <Button size="xs" onClick={handleDeleteMeal} color="red" loading={deleteMealModal.isDeleting}>
            Delete
          </Button>
        </Group>
      </Modal>
      {/* end of delete meal modal */}

      {/* FoodItem Add Modal */}
      <Modal
        styles={{
          root: {
            "& .mantine-Paper-root": { padding: 16, overflowY: "unset" },
            "& .mantine-Modal-header": { zIndex: 0 },
          },
        }}
        centered
        padding={0}
        opened={foodModal.open}
        onClose={() => {
          setFoodModal({
            open: false,
            isEditing: false,
            foodId: undefined,
            meal: undefined,
          });
        }}
        title={foodModal.isEditing ? "Update your food" : "Add new meal"}
      >
        {foodModal.meal && (
          <FoodForm
            meal={foodModal.meal}
            isEditing={foodModal.isEditing}
            editingFoodId={foodModal.foodId}
            onClose={() => {
              setFoodModal({
                open: false,
                isEditing: false,
                foodId: undefined,
                meal: undefined,
              });
            }}
          />
        )}
      </Modal>
      {/* end of FoodItem Add Modal */}

      {/* delete food modal */}
      <Modal
        opened={deleteFoodModal.open}
        onClose={() =>
          setDeleteFoodModal({
            open: false,
            isDeleting: false,
            foodId: undefined,
            meal: undefined,
          })
        }
        title="Please confirm your action"
        centered
      >
        <Text size="sm" mb="xl">
          Are you sure want to delete your meal?
        </Text>
        <Group position="right">
          <Button
            size="xs"
            onClick={() =>
              setDeleteFoodModal({
                open: false,
                isDeleting: false,
                foodId: undefined,
                meal: undefined,
              })
            }
            variant="outline"
            disabled={deleteFoodModal.isDeleting}
          >
            Cancel
          </Button>
          <Button size="xs" onClick={handleDeleteFood} color="red" loading={deleteFoodModal.isDeleting}>
            Delete
          </Button>
        </Group>
      </Modal>
      {/* end of delete food modal */}

      {/* end of modals */}
    </MealProvider>
  );
};

export default Data;
