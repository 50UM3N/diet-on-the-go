import Table from "@/components/Table";
import { METRIC } from "@/data/constant";
import { db } from "@/firebase";
import { Select, Title } from "@mantine/core";
import { Col } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { NumberInput } from "@mantine/core";
import { Group } from "@mantine/core";
import { Button } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Menu } from "@mantine/core";
import { Divider } from "@mantine/core";
import { SimpleGrid } from "@mantine/core";
import { Grid } from "@mantine/core";
import { Paper } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconEdit, IconSettings } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/table-core";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const FoodItems = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [list, setList] = useState<any>([]);
    const form = useForm({
        initialValues: {
            name: "",
            protein: "",
            fat: "",
            carbohydrate: "",
            metric: "",
        },

        validate: {
            name: (value) => (value ? null : "Required"),
            protein: (value) => (value ? null : "Required"),
            fat: (value) => (value ? null : "Required"),
            carbohydrate: (value) => (value ? null : "Required"),
            metric: (value) => (value ? null : "Required"),
        },
    });
    const formSubmit = async (values: any) => {
        setIsSaving(true);
        await addDoc(collection(db, "foodItems"), values);
        setIsSaving(false);
    };

    useEffect(() => {
        (async () => {
            const querySnapshot = await getDocs(collection(db, "foodItems"));
            const localList: any = [];
            querySnapshot.forEach((doc) => {
                localList.push({ id: doc.id, ...doc.data() });
            });
            setList(localList);
        })();
        const unsubscribe = onSnapshot(collection(db, "foodItems"), (snapshot) => {
            const localList: any = [];
            snapshot.forEach((doc) => {
                localList.push({ id: doc.id, ...doc.data() });
            });
            setList(localList);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    const handleDelete = async (id: string) => {
        await deleteDoc(doc(db, "foodItems", id));
    };
    const columns = React.useMemo<ColumnDef<any, any>[]>(
        () => [
            {
                accessorKey: "id",
                header: "Index",
                cell(props) {
                    return props.row.index;
                },
            },
            {
                accessorKey: "name",
                header: "Name",
            },

            {
                accessorKey: "metric",
                header: "Metric",

                cell(props) {
                    // @ts-ignore
                    return METRIC[props.getValue()];
                },
            },
            {
                accessorKey: "protein",
                header: "Protein",
            },
            {
                accessorKey: "fat",
                header: "Fat",
            },
            {
                accessorKey: "carbohydrate",
                header: "Carbohydrate",
            },

            {
                id: "action",
                header: "Action",
                accessorKey: "id",
                enableColumnFilter: false,
                cell(props) {
                    const id = props.getValue();
                    return (
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <ActionIcon variant="filled" color="blue">
                                    <IconSettings size={16} />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Application</Menu.Label>

                                <Menu.Item icon={<IconEdit size={14} />}>Edit</Menu.Item>
                                <Menu.Divider />
                                <Menu.Label>Danger zone</Menu.Label>
                                <Menu.Item color="red" onClick={() => handleDelete(id)}>
                                    Delete
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    );
                },
            },
        ],
        []
    );
    return (
        <>
            <Grid>
                <Col md={6}>
                    <Paper>
                        <Title order={4}>Food Items Form (100g Basis)</Title>
                        <Divider my="xs" />
                        <form onSubmit={form.onSubmit(formSubmit)}>
                            <Grid gutter="xs" mb="xs">
                                <Col md={10}>
                                    <TextInput
                                        size="xs"
                                        placeholder="eg. Chicken"
                                        label="Name"
                                        withAsterisk
                                        {...form.getInputProps("name")}
                                    />
                                </Col>
                                <Col md={2}>
                                    <Select
                                        withAsterisk
                                        size="xs"
                                        label="Metric"
                                        placeholder="Pick one"
                                        data={[
                                            { value: "PER_100_G", label: "/100g" },
                                            { value: "PER_PC", label: "/pc" },
                                        ]}
                                        {...form.getInputProps("metric")}
                                    />
                                </Col>
                            </Grid>
                            <SimpleGrid
                                cols={3}
                                breakpoints={[
                                    { maxWidth: 980, cols: 3, spacing: "xs" },
                                    { maxWidth: 755, cols: 2, spacing: "xs" },
                                    { maxWidth: 600, cols: 1, spacing: "xs" },
                                ]}
                            >
                                <NumberInput
                                    step={0.05}
                                    precision={2}
                                    size="xs"
                                    placeholder="eg. 10"
                                    label="Protein (g)"
                                    withAsterisk
                                    min={0}
                                    {...form.getInputProps("protein")}
                                />
                                <NumberInput
                                    step={0.05}
                                    precision={2}
                                    size="xs"
                                    placeholder="eg. 4"
                                    label="Fat (g)"
                                    withAsterisk
                                    min={0}
                                    {...form.getInputProps("fat")}
                                />
                                <NumberInput
                                    step={0.05}
                                    precision={2}
                                    size="xs"
                                    placeholder="eg. 10"
                                    label="Carbohydrate (g)"
                                    min={0}
                                    withAsterisk
                                    {...form.getInputProps("carbohydrate")}
                                />
                            </SimpleGrid>
                            <Group position="right" mt="md">
                                <Button size="xs" type="submit" loading={isSaving}>
                                    Save
                                </Button>
                            </Group>
                        </form>
                    </Paper>
                </Col>
                <Col md={6}>
                    <Paper>
                        <Title order={4}>Food Items List</Title>

                        <Table columns={columns} data={list} />
                    </Paper>
                </Col>
            </Grid>
        </>
    );
};

export default FoodItems;
