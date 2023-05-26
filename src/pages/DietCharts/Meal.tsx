import { ActionIcon, Badge, Button, Group, Menu, Modal, Paper, Stack, Text } from "@mantine/core";
import { IconDotsVertical, IconPencil, IconPlus, IconSalad, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import FoodForm from "./FoodForm";
import { useMealChart } from "./MealChartContext";
import useStyles from "./style";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import MacrosBadge from "@/components/MacrosBadge";
const Meal: React.FC<{ data: DetailsMeals; onEdit: () => void }> = ({ data, onEdit }) => {
    const { chartId } = useParams();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [foodPopover, setFoodPopover] = useState(false);
    const [deleteMealModal, setDeleteMealModal] = useState(false);
    const [isMealDeleting, setIsMealDeleting] = useState(false);
    // storing the deleted food itemid
    const [deleteFoodModal, setDeleteFoodModal] = useState<string>();
    const [isFoodDeleting, setIsFoodDeleting] = useState(false);
    const { cx, classes } = useStyles();
    const ctx = useMealChart();
    const [editingId, setEditingId] = useState<string>();
    const handleFoodEditing = (id: string) => {
        setEditingId(id);
        setFoodPopover(true);
        ctx?.setOverlay(true);
    };
    const handleDeleteMeal = async () => {
        if (!chartId) return;
        if (!user) return;
        setIsMealDeleting(true);
        await deleteDoc(doc(db, "users", user.id, "charts", chartId, "meals", data.id));
        setDeleteMealModal(false);
        setIsMealDeleting(false);
        showNotification({ message: "Successfully deleted meal" });
    };

    const handleDeleteFood = async (foodId: string) => {
        if (!chartId) return;
        if (!user) return;
        setIsFoodDeleting(true);
        const updatedFoodList = data.foods
            .map((item) => ({ foodId: item.food.id, qty: item.qty }))
            .filter((item) => item.foodId !== foodId);
        await updateDoc(doc(db, "users", user.id, "charts", chartId, "meals", data.id), { foods: updatedFoodList });
        setDeleteFoodModal(undefined);
        setIsFoodDeleting(false);
        showNotification({ message: "Successfully deleted Food" });
    };
    return (
        <>
            <Paper px={8} py={8} bg="gray.0" className={cx({ [classes.overlay]: ctx?.overlay })}>
                <Group position="apart">
                    <Text size="sm" weight={500}>
                        {data.name}
                    </Text>
                    <Group spacing="xs">
                        <Group spacing="xs">
                            <ActionIcon
                                data-no-print
                                variant="light"
                                color="blue"
                                onClick={() => {
                                    setFoodPopover(true);
                                    ctx?.setOverlay(true);
                                }}
                            >
                                <IconPlus size={14} />
                            </ActionIcon>
                            <Menu shadow="md" width={100} position="bottom-end">
                                <Menu.Target>
                                    <ActionIcon variant="light" data-no-print>
                                        <IconDotsVertical size={18} />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item icon={<IconPencil size={14} />} onClick={onEdit}>
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item color="red" icon={<IconTrash size={14} />} onClick={() => setDeleteMealModal(true)}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </Group>
                <MacrosBadge
                    wrapper={{ mt: "xs" }}
                    style={{ flex: 1 }}
                    protein={data.protein}
                    fat={data.fat}
                    carbohydrate={data.carbohydrate}
                    color="teal"
                />
            </Paper>
            {data.foods?.length > 0 && (
                <Paper p={0} style={{ overflow: "hidden" }}>
                    <Stack spacing={0}>
                        {data.foods?.map((item) => (
                            <Paper
                                withBorder={false}
                                radius={0}
                                px={12}
                                py={8}
                                key={item.food.id}
                                className={cx(
                                    classes.paper,
                                    "paper",
                                    { "active-hover": !ctx?.overlay },
                                    { [classes.overlay]: ctx?.overlay }
                                )}
                            >
                                <Group position="apart">
                                    <Group spacing="xs">
                                        <IconSalad size={20} />
                                        <Text size="sm" weight={500}>
                                            {item.food.name}
                                        </Text>
                                    </Group>
                                    <Badge size="sm" variant="outline" color="gray">
                                        {item.qty} {item.food.metric === "PER_100_G" ? "g" : "pc "}
                                    </Badge>
                                </Group>
                                <MacrosBadge
                                    wrapper={{ mt: "xs" }}
                                    style={{ flex: 1 }}
                                    protein={item.food.protein}
                                    fat={item.food.fat}
                                    carbohydrate={item.food.carbohydrate}
                                    color="orange"
                                    size="xs"
                                />
                                <div className={"control-wrapper"} data-no-print>
                                    <Group spacing="xs" data-no-print>
                                        <ActionIcon onClick={() => handleFoodEditing(item.food.id)}>
                                            <IconPencil size="1.125rem" />
                                        </ActionIcon>
                                        <ActionIcon color="red" onClick={() => setDeleteFoodModal(item.food.id)}>
                                            <IconTrash size="1.125rem" />
                                        </ActionIcon>
                                    </Group>
                                </div>
                            </Paper>
                        ))}
                    </Stack>
                </Paper>
            )}

            <Modal
                styles={{
                    root: {
                        "& .mantine-Paper-root": { padding: 16, overflowY: "unset" },
                        "& .mantine-Modal-header": { zIndex: 0 },
                    },
                }}
                centered
                padding={0}
                opened={foodPopover}
                onClose={() => {
                    setEditingId(undefined);
                    setFoodPopover((s) => !s);
                    ctx?.setOverlay((s) => !s);
                }}
                title={editingId ? "Update your food" : "Add new meal"}
            >
                <FoodForm
                    meal={data}
                    isEditing={editingId ? true : false}
                    editingFoodId={editingId}
                    onClose={() => {
                        setEditingId(undefined);
                        setFoodPopover((s) => !s);
                        ctx?.setOverlay((s) => !s);
                    }}
                />
            </Modal>
            <Modal opened={deleteMealModal} onClose={() => setDeleteMealModal(false)} title="Please confirm your action" centered>
                <Text size="sm" mb="xl">
                    Are you sure want to delete your meal?
                </Text>
                <Group position="right">
                    <Button size="xs" onClick={() => setDeleteMealModal(false)} variant="outline" disabled={isMealDeleting}>
                        Cancel
                    </Button>
                    <Button size="xs" onClick={handleDeleteMeal} color="red" loading={isMealDeleting}>
                        Delete
                    </Button>
                </Group>
            </Modal>

            <Modal
                opened={deleteFoodModal ? true : false}
                onClose={() => setDeleteFoodModal(undefined)}
                title="Please confirm your action"
                centered
            >
                <Text size="sm" mb="xl">
                    Are you sure want to delete your meal?
                </Text>
                <Group position="right">
                    <Button size="xs" onClick={() => setDeleteFoodModal(undefined)} variant="outline" disabled={isFoodDeleting}>
                        Cancel
                    </Button>
                    <Button size="xs" onClick={() => handleDeleteFood(deleteFoodModal || "")} color="red" loading={isFoodDeleting}>
                        Delete
                    </Button>
                </Group>
            </Modal>
        </>
    );
};

export default Meal;
