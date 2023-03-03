import Table from "@/components/Table";
import { db } from "@/firebase";
import { ActionIcon, LoadingOverlay, Menu, Paper, Title } from "@mantine/core";
import { IconEdit, IconSettings } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/table-core";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ChartList = () => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [list, setList] = useState<DietChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const columns = React.useMemo<ColumnDef<DietChartData, any>[]>(
        () => [
            {
                accessorKey: "id",
                header: "No",
                cell(props) {
                    return props.row.index + 1;
                },
            },
            {
                accessorKey: "name",
                header: "Name",
            },

            {
                accessorKey: "description",
                header: "Description",
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

                                <Menu.Item icon={<IconEdit size={14} />} component={Link} to={`?chart=${id}`}>
                                    Edit
                                </Menu.Item>
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
    const handleDelete = async (id: string) => {
        if (!user) return;
        await deleteDoc(doc(db, "users", user.id, "charts", id));
    };
    useEffect(() => {
        if (!user) return;
        const unsubscribe = onSnapshot(collection(db, "users", user.id, "charts"), (snapshot) => {
            const localList: any = [];
            snapshot.forEach((doc) => {
                localList.push({ id: doc.id, ...doc.data() });
            });
            setList(localList);
            setIsLoading(false);
        });
        return () => {
            unsubscribe();
        };
    }, []);
    return (
        <Paper style={{ position: "relative" }}>
            <Title order={4}>Chart List</Title>
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            <Table columns={columns} data={list} />
        </Paper>
    );
};

export default ChartList;
