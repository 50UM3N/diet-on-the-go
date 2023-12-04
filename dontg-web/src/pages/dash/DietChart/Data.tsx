import { ActionIcon, Button, Divider, Grid, Group, LoadingOverlay, Menu, Modal, Paper, Text, Title } from "@mantine/core";
import { IconDotsVertical, IconFile, IconPencil, IconPlus, IconSalad, IconTrash } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { ChartInfo, MealFoodInfo, MealListInfo } from "@/types/index.type";
import { METRIC } from "@/data/constant";
import { useDeleteMealList, useGetMealListByChartId } from "@/hooks/api/mealList.hook";
import MealForm from "./forms/MealForm";
import FoodForm from "./forms/FoodForm";
import { useDeleteMealFood } from "@/hooks/api/mealFood.hook";
import { queryClient } from "@/main";
import MacroCard from "@/components/MacroCard";
import { calToGm, calcPercentage } from "@/utils";
import MacrosBadge from "@/components/MacrosBadge";

const Data = ({ chart }: { chart: ChartInfo }) => {
  const { id } = useParams();
  const [list] = useGetMealListByChartId(id as string);
  const [deleteMealList] = useDeleteMealList();
  const [deleteMealFood] = useDeleteMealFood();
  const [mealModal, setMealModal] = useState<{
    open: boolean;
    isEditing: boolean;
    data?: MealListInfo;
  }>({ open: false, isEditing: false });

  const [deleteMealListModal, setDeleteMealListModal] = useState<{ open: boolean; isDeleting: boolean; mealListId?: string }>({
    open: false,
    isDeleting: false,
  });

  const [mealFoodModal, setMealFoodModal] = useState<{ open: boolean; isEditing: boolean; mealFood?: MealFoodInfo; mealListId: string }>({
    open: false,
    isEditing: false,
    mealListId: "",
  });

  const [deleteFoodModal, setDeleteFoodModal] = useState<{
    open: boolean;
    isDeleting: boolean;
    mealFoodId?: string;
  }>({
    open: false,
    isDeleting: false,
  });

  const handleDeleteMealList = async () => {
    if (!deleteMealListModal.mealListId) return;
    setDeleteMealListModal((s) => ({ ...s, isDeleting: true }));
    deleteMealList.mutate(deleteMealListModal.mealListId, {
      onSuccess: () => {
        setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined });
        queryClient.invalidateQueries();
      },
      onError: () => {
        setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined });
      },
    });
  };

  const handleDeleteFood = async () => {
    if (!deleteFoodModal.mealFoodId) return;
    setDeleteFoodModal((s) => ({ ...s, isDeleting: true }));
    deleteMealFood.mutate(deleteFoodModal.mealFoodId, {
      onSuccess: () => {
        setDeleteFoodModal({ open: false, isDeleting: false, mealFoodId: undefined });
        queryClient.invalidateQueries();
      },
      onError: () => {
        setDeleteFoodModal({ open: false, isDeleting: false, mealFoodId: undefined });
      },
    });
  };

  return (
    <Paper withBorder p="md" radius="lg">
      <LoadingOverlay visible={list.isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      {list.data && (
        <>
          <Grid grow gutter="xs">
            <Grid.Col span={{ xs: 3, base: 6 }}>
              <MacroCard type="Calories" color="cyan" total={100} amount={chart.intakeCalories} />
            </Grid.Col>
            <Grid.Col span={{ xs: 3, base: 6 }}>
              <MacroCard type="Protein" color="green" total={chart.protein} amount={calToGm(calcPercentage(chart.intakeCalories, chart.protein), "protein")} />
            </Grid.Col>
            <Grid.Col span={{ xs: 3, base: 6 }}>
              <MacroCard type="Fat" color="orange" total={chart.fat} amount={calToGm(calcPercentage(chart.intakeCalories, chart.fat), "fat")} />
            </Grid.Col>
            <Grid.Col span={{ xs: 3, base: 6 }}>
              <MacroCard type="Carb" color="red" total={chart.carb} amount={calToGm(calcPercentage(chart.intakeCalories, chart.carb), "carbohydrates")} />
            </Grid.Col>
          </Grid>
          <Divider my="xs" />

          <Group justify="space-between" mb="xs">
            <Title order={4}>Meal List</Title>
            <Group gap="xs">
              <Button
                leftSection={<IconPlus size={16} />}
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
                leftSection={<IconFile size={16} />}
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
          <MacrosBadge style={{ flex: 1 }} wrapper={{ mb: "sm" }} protein={list.data.protein} fat={list.data.fat} carb={list.data.carb} size="lg" />
          <Paper withBorder radius="md">
            <div className="table-wrapper">
              <table className="test-table" style={{ width: "100%" }}>
                <tbody>
                  <tr className="t-head">
                    <td style={{}}>Name</td>
                    <td style={{ width: "12%" }}>Amount</td>
                    <td style={{ width: "12%" }}>Protein</td>
                    <td style={{ width: "12%" }}>Fat</td>
                    <td style={{ width: "12%" }}>Carbohydrate </td>
                    <td style={{ width: "80px" }}>Action</td>
                  </tr>
                  {list.data.mealList?.map((item) => (
                    <Fragment key={item.id}>
                      <tr className="t-meal-head">
                        <td colSpan={2}>{item.name}</td>
                        <td>{item.protein} g</td>
                        <td>{item.fat} g</td>
                        <td>{item.carb} g</td>
                        <td>
                          <Group gap="xs">
                            <ActionIcon
                              size={16}
                              data-no-print
                              variant="light"
                              onClick={() => {
                                setMealFoodModal({
                                  open: true,
                                  mealListId: item.id,
                                  isEditing: false,
                                });
                              }}
                            >
                              <IconPlus size={12} />
                            </ActionIcon>
                            <Menu shadow="md" width={100} position="bottom-end">
                              <Menu.Target>
                                <ActionIcon size={16} variant="light" data-no-print>
                                  <IconDotsVertical size={16} />
                                </ActionIcon>
                              </Menu.Target>

                              <Menu.Dropdown>
                                <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => setMealModal({ open: true, isEditing: true, data: item })}>
                                  Edit
                                </Menu.Item>
                                <Menu.Item
                                  color="red"
                                  leftSection={<IconTrash size={16} />}
                                  onClick={() =>
                                    setDeleteMealListModal({
                                      open: true,
                                      isDeleting: false,
                                      mealListId: item.id,
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
                      {item.mealFood.map((mealFood) => {
                        return (
                          <tr key={mealFood.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 4, paddingLeft: 8 }}>
                                <IconSalad size={16} />
                                {mealFood.foodItem.name}
                              </div>
                            </td>
                            <td>
                              {mealFood.qty} {mealFood.foodItem.metric === METRIC.GRAM ? "g" : (mealFood.foodItem.metric === METRIC.PIECE ?"pc" : "ml") }
                            </td>
                            <td>{(mealFood.foodItem.protein * mealFood.qty).toFixed(2)} g</td>
                            <td>{(mealFood.foodItem.carb * mealFood.qty).toFixed(2)} g</td>
                            <td>{(mealFood.foodItem.fat * mealFood.qty).toFixed(2)} g</td>
                            <td>
                              <Group gap="xs" wrap="nowrap" data-no-print>
                                <ActionIcon size={16} onClick={() => setMealFoodModal({ open: true, mealListId: item.id, isEditing: true, mealFood: mealFood })}>
                                  <IconPencil size="12px" />
                                </ActionIcon>
                                <ActionIcon
                                  size={16}
                                  color="red"
                                  onClick={() =>
                                    setDeleteFoodModal({
                                      open: true,
                                      isDeleting: false,
                                      mealFoodId: mealFood.id,
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
            </div>
          </Paper>

          {/* modals */}

          {/* meal modal */}
          <Modal
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
              mealListInfo={mealModal.data}
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

          <Modal opened={deleteMealListModal.open} onClose={() => setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined })} title="Please confirm your action" centered>
            <Text size="sm" mb="xl">
              Are you sure want to delete your meal?
            </Text>
            <Group justify="right">
              <Button size="xs" onClick={() => setDeleteMealListModal({ open: false, isDeleting: false, mealListId: undefined })} variant="outline" disabled={deleteMealListModal.isDeleting}>
                Cancel
              </Button>
              <Button size="xs" onClick={handleDeleteMealList} color="red" loading={deleteMealListModal.isDeleting}>
                Delete
              </Button>
            </Group>
          </Modal>
          {/* end of delete meal modal */}

          {/* FoodItem Add Modal */}
          <Modal
            opened={mealFoodModal.open}
            onClose={() => {
              setMealFoodModal({
                open: false,
                isEditing: false,
                mealFood: undefined,
                mealListId: "",
              });
            }}
            title={mealFoodModal.isEditing ? "Update your food" : "Add new meal"}
          >
            {mealFoodModal.mealListId && (
              <FoodForm
                mealListId={mealFoodModal.mealListId}
                isEditing={mealFoodModal.isEditing}
                mealFood={mealFoodModal.mealFood}
                onClose={() => {
                  setMealFoodModal({
                    open: false,
                    isEditing: false,
                    mealFood: undefined,
                    mealListId: "",
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
                mealFoodId: undefined,
              })
            }
            title="Please confirm your action"
            centered
          >
            <Text size="sm" mb="xl">
              Are you sure want to delete your meal?
            </Text>
            <Group justify="right">
              <Button
                size="xs"
                onClick={() =>
                  setDeleteFoodModal({
                    open: false,
                    isDeleting: false,
                    mealFoodId: undefined,
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
        </>
      )}
    </Paper>
  );
};

export default Data;
