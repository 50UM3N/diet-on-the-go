import { ActionIcon, Button, Center, CopyButton, Divider, Grid, Group, LoadingOverlay, Menu, Modal, Paper, Popover, Stack, Tabs, Text, Title } from "@mantine/core";
import { IconDotsVertical, IconPencil, IconPlus, IconSalad, IconTrash, IconShare, IconCopy, IconCheck } from "@tabler/icons-react";
import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { ChartInfo, MealChartInfo, MealFoodInfo, MealListInfo } from "@/types/index.type";
import { METRIC } from "@/data/constant";
import { useDeleteMealList, useGetMealListByMealChartId } from "@/hooks/api/mealList.hook";
import MealForm from "./forms/MealForm";
import FoodForm from "./forms/FoodForm";
import { useDeleteMealFood } from "@/hooks/api/mealFood.hook";
import { queryClient } from "@/main";
import MacroCard from "@/components/MacroCard";
import { calToGm, calcPercentage } from "@/utils";
import MacrosBadge from "@/components/MacrosBadge";
import { useCopyMealChart, useDeleteMealChart, useGetMealChartByChartId } from "@/hooks/api/mealChart.hook";
import MealChartForm from "./forms/MealChartForm";

const Data = ({ chart, isViewing = false }: { chart: ChartInfo; isViewing?: boolean }) => {
  const { id } = useParams();
  const [mealChart] = useGetMealChartByChartId(id as string);
  const [mealChartModal, setMealChartModal] = useState<{
    open: boolean;
    isEditing: boolean;
    data?: MealChartInfo;
  }>({ open: false, isEditing: false });

  return (
    <Paper withBorder p="md" radius="lg" style={{ position: "relative" }}>
      <LoadingOverlay visible={mealChart.isPending} overlayProps={{ radius: "sm", blur: 2 }} />
      <Grid grow gutter="xs">
        <Grid.Col span={{ xs: 3, base: 6 }}>
          <MacroCard type="Calories" color="cyan" total={100} amount={chart.intakeCalories} unit="kcal" />
        </Grid.Col>
        <Grid.Col span={{ xs: 3, base: 6 }}>
          <MacroCard type="Protein" color="green" total={chart.protein} amount={calToGm(calcPercentage(chart.intakeCalories, chart.protein), "protein")} unit="g" />
        </Grid.Col>
        <Grid.Col span={{ xs: 3, base: 6 }}>
          <MacroCard type="Fat" color="orange" total={chart.fat} amount={calToGm(calcPercentage(chart.intakeCalories, chart.fat), "fat")} unit="g" />
        </Grid.Col>
        <Grid.Col span={{ xs: 3, base: 6 }}>
          <MacroCard type="Carb" color="red" total={chart.carb} amount={calToGm(calcPercentage(chart.intakeCalories, chart.carb), "carbohydrates")} unit="g" />
        </Grid.Col>
      </Grid>
      <Divider my="xs" />

      {!mealChart?.data?.length ? (
        <Center mt="xs">
          <Stack gap="xs">
            <Text size="sm" ta="center">
              No Meal Chart
            </Text>
            <Button onClick={() => setMealChartModal({ open: true, isEditing: false, data: undefined })} size="xs">
              Create Meal Chart
            </Button>
          </Stack>
        </Center>
      ) : (
        <>
          <Group justify="space-between" mb="xs">
            <Title order={4}>Meal Chart</Title>
            {!isViewing && (
              <Button
                leftSection={<IconPlus size={16} />}
                size="xs"
                onClick={() => {
                  setMealChartModal({
                    open: true,
                    isEditing: false,
                  });
                }}
                data-no-print
              >
                Add Meal Chart
              </Button>
            )}
          </Group>
          <Divider my="xs" />
          <Tabs defaultValue={mealChart?.data?.[0].id}>
            <Tabs.List>
              {mealChart?.data?.map((item) => (
                <Tabs.Tab size="10px" key={item.id} value={item.id}>
                  {item.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>
            {mealChart?.data?.map((item) => (
              <Tabs.Panel value={item.id} key={item.id}>
                <MealList mealChartInfo={item} isViewing={isViewing} />
              </Tabs.Panel>
            ))}
          </Tabs>
        </>
      )}
      {/* modals */}

      {/* meal chart modal */}
      <Modal
        opened={mealChartModal.open}
        onClose={() => {
          setMealChartModal({
            open: false,
            isEditing: false,
            data: undefined,
          });
        }}
        title={mealChartModal.isEditing ? "Update Your Meal Chart" : "Add New Meal Chart"}
      >
        <MealChartForm
          isEditing={mealChartModal.isEditing}
          mealChartInfo={mealChartModal.data}
          onClose={() => {
            setMealChartModal({
              open: false,
              isEditing: false,
              data: undefined,
            });
          }}
        />
      </Modal>
      {/* end of meal modal */}
      {/* meal modal */}
    </Paper>
  );
};

export default Data;

const MealList = ({ isViewing, mealChartInfo }: { mealChartInfo: MealChartInfo; isViewing?: boolean }) => {
  const { id: chartId } = useParams();
  const [list] = useGetMealListByMealChartId(mealChartInfo.id);
  const [deleteMealList] = useDeleteMealList();
  const [deleteMealFood] = useDeleteMealFood();
  const [deleteMealChart] = useDeleteMealChart();
  const [copyMealChart] = useCopyMealChart();
  const [mealListModal, setMealListModal] = useState<{
    open: boolean;
    isEditing: boolean;
    data?: MealListInfo;
  }>({ open: false, isEditing: false });

  const [deleteMealListModal, setDeleteMealListModal] = useState<{ open: boolean; isDeleting: boolean; mealListId?: string }>({
    open: false,
    isDeleting: false,
  });

  const [mealChartModal, setMealChartModal] = useState<{
    open: boolean;
    data?: MealChartInfo;
  }>({ open: false });

  const [deleteMealChartModal, setDeleteMealChartModal] = useState<{ open: boolean; isDeleting: boolean; mealChartId?: string }>({
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

  const handleDeleteMealChart = async () => {
    if (!deleteMealChartModal.mealChartId) return;
    setDeleteMealChartModal((s) => ({ ...s, isDeleting: true }));
    deleteMealChart.mutate(deleteMealChartModal.mealChartId, {
      onSuccess: () => {
        setDeleteMealChartModal({ open: false, isDeleting: false, mealChartId: undefined });
        queryClient.invalidateQueries();
      },
      onError: () => {
        setDeleteMealChartModal({ open: false, isDeleting: false, mealChartId: undefined });
      },
    });
  };
  return (
    <div style={{ position: "relative" }}>
      <LoadingOverlay visible={list.isPending} overlayProps={{ radius: "sm", blur: 2 }} />
      {list.data && (
        <>
          <Group justify="space-between" my="xs">
            <Title order={5}>Meal List</Title>
            {!isViewing && (
              <Group gap="xs">
                <Popover width={140} position="bottom" radius="lg" withArrow shadow="md">
                  <Popover.Target>
                    <Button leftSection={<IconShare size={16} />} size="xs" data-no-print>
                      Share
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <CopyButton value={`${window.location.origin}/diet-chart/view/${chartId}`} timeout={2000}>
                      {({ copied, copy }) => (
                        <Button color={copied ? "green" : undefined} leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />} size="xs" variant="light" onClick={copy}>
                          {copied ? "Copied" : "Copy Link"}
                        </Button>
                      )}
                    </CopyButton>
                  </Popover.Dropdown>
                </Popover>

                <Button
                  leftSection={<IconPlus size={16} />}
                  size="xs"
                  onClick={() => {
                    setMealListModal({
                      open: true,
                      isEditing: false,
                    });
                  }}
                  data-no-print
                >
                  Add Meal
                </Button>
                <Menu shadow="md" width={150} position="bottom-end">
                  <Menu.Target>
                    <ActionIcon radius="md" variant="light" data-no-print>
                      <IconDotsVertical size={18} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => setMealChartModal({ open: true, data: mealChartInfo })}>
                      Edit
                    </Menu.Item>
                    <Menu.Item
                      leftSection={<IconCopy size={16} />}
                      onClick={() => {
                        copyMealChart.mutate({ chartId: chartId as string, mealChartId: mealChartInfo.id });
                      }}
                    >
                      Duplicate
                    </Menu.Item>
                    <Menu.Item
                      color="red"
                      leftSection={<IconTrash size={16} />}
                      onClick={() =>
                        setDeleteMealChartModal({
                          open: true,
                          isDeleting: false,
                          mealChartId: mealChartInfo.id,
                        })
                      }
                    >
                      Delete
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            )}
          </Group>
          <Divider my="xs" />
          <MacrosBadge style={{ flex: 1 }} wrapper={{ mb: "sm" }} protein={list.data.protein} fat={list.data.fat} carb={list.data.carb} size="lg" />
          <Paper withBorder radius="md">
            <div className="table-wrapper">
              <table className="test-table" style={{ width: "100%" }}>
                <tbody>
                  <tr className="t-head">
                    <td>Name</td>
                    <td style={{ width: "12%" }}>Amount</td>
                    <td style={{ width: "12%" }}>Protein</td>
                    <td style={{ width: "12%" }}>Fat</td>
                    <td style={{ width: "12%" }}>Carbohydrate </td>
                    {!isViewing && <td style={{ width: "80px" }}>Action</td>}
                  </tr>
                  {list.data.mealList?.map((item) => (
                    // console.log(item.protein);
                    <Fragment key={item.id}>
                      <tr className="t-meal-head">
                        <td colSpan={2}>{item.name}</td>
                        <td>{item.protein.toFixed(2)} g</td>
                        <td>{item.fat.toFixed(2)} g</td>
                        <td>{item.carb.toFixed(2)} g</td>
                        {!isViewing && (
                          <td>
                            <Group gap="xs" justify="center">
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
                                  <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => setMealListModal({ open: true, isEditing: true, data: item })}>
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
                        )}
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
                              {mealFood.qty} {mealFood.foodItem.metric === METRIC.GRAM ? "g" : mealFood.foodItem.metric === METRIC.PIECE ? "pc" : "ml"}
                            </td>
                            <td>{mealFood.foodItem.metric === METRIC.GRAM ? ((mealFood.foodItem.protein * mealFood.qty) / 100).toFixed(2) : (mealFood.foodItem.protein * mealFood.qty).toFixed(2)} g</td>
                            <td>{mealFood.foodItem.metric === METRIC.GRAM ? ((mealFood.foodItem.fat * mealFood.qty) / 100).toFixed(2) : (mealFood.foodItem.fat * mealFood.qty).toFixed(2)} g</td>
                            <td>{mealFood.foodItem.metric === METRIC.GRAM ? ((mealFood.foodItem.carb * mealFood.qty) / 100).toFixed(2) : (mealFood.foodItem.carb * mealFood.qty).toFixed(2)} g</td>
                            {!isViewing && (
                              <td>
                                <Group gap="xs" wrap="nowrap" justify="center" data-no-print>
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
                            )}
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
            opened={mealListModal.open}
            onClose={() => {
              setMealListModal({
                open: false,
                isEditing: false,
                data: undefined,
              });
            }}
            title={mealListModal.isEditing ? "Update Your Meal" : "Add New Meal"}
          >
            <MealForm
              isEditing={mealListModal.isEditing}
              mealListInfo={mealListModal.data}
              mealChartId={mealChartInfo.id}
              onClose={() => {
                setMealListModal({
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
          {/* meal chart modal */}
          <Modal
            opened={mealChartModal.open}
            onClose={() => {
              setMealChartModal({
                open: false,
                data: undefined,
              });
            }}
            title="Update Your Meal Chart"
          >
            <MealChartForm
              isEditing
              mealChartInfo={mealChartModal.data}
              onClose={() => {
                setMealChartModal({
                  open: false,
                  data: undefined,
                });
              }}
            />
          </Modal>
          {/* end of meal chart modal */}

          {/* delete meal chart modal */}
          <Modal
            opened={deleteMealChartModal.open}
            onClose={() =>
              setDeleteMealChartModal({
                open: false,
                isDeleting: false,
                mealChartId: undefined,
              })
            }
            title="Please confirm your action"
            centered
          >
            <Text size="sm" mb="xl">
              Are you sure want to delete your meal chart?
            </Text>
            <Group justify="right">
              <Button
                size="xs"
                onClick={() =>
                  setDeleteMealChartModal({
                    open: false,
                    isDeleting: false,
                    mealChartId: undefined,
                  })
                }
                variant="outline"
                disabled={deleteMealChartModal.isDeleting}
              >
                Cancel
              </Button>
              <Button size="xs" onClick={handleDeleteMealChart} color="red" loading={deleteMealChartModal.isDeleting}>
                Delete
              </Button>
            </Group>
          </Modal>
          {/* end of delete meal chart modal */}

          {/* end of modals */}
        </>
      )}
    </div>
  );
};
