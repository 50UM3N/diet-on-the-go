import Table from "@/components/Table";
import { db } from "@/firebase";
import { ActionIcon, Divider, Group, LoadingOverlay, Paper, Text, Title } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/table-core";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const DietChartListPage = () => {
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
            <Group gap="xs">
              <ActionIcon variant="filled" color="blue" component={Link} to={`/chart/${id}`}>
                <IconEdit size={16} />
              </ActionIcon>{" "}
              <ActionIcon
                variant="filled"
                color="red"
                onClick={() => {
                  openConfirmModal({
                    title: "Caution Required",
                    centered: true,
                    children: <Text size="sm">Are you sure you want to delete this item?</Text>,
                    labels: { confirm: "Delete", cancel: "Cancel" },
                    confirmProps: { color: "red" },
                    onConfirm: () => {
                      handleDelete(id);
                    },
                  });
                }}
              >
                <IconTrash size={16} />
              </ActionIcon>
              {/* <ActionIcon
                                variant="filled"
                                color="teal"
                                onClick={() => {
                                    //
                                }}
                            >
                                <IconCopy size={16} />
                            </ActionIcon> */}
            </Group>
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
      <Divider my="xs" />
      <LoadingOverlay visible={isLoading} overlayProps={{ radius: "sm", blur: 2 }} />
      <Table columns={columns} data={list} />
    </Paper>
  );
};

export default DietChartListPage;
