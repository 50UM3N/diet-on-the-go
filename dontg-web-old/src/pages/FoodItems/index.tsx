import Table from "@/components/Table";
import { METRIC } from "@/data/constant";
import { db } from "@/firebase";
import { Modal, Title } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Menu } from "@mantine/core";
import { Grid } from "@mantine/core";
import { Paper } from "@mantine/core";
import { IconEdit, IconSettings } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/table-core";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import FoodItemsForm from "./FoodItemsForm";

const FoodItems = () => {
  const [list, setList] = useState<any>([]);
  const [editingItem, setEditingItem] = useState<FoodItem>();
  useEffect(() => {
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
                <ActionIcon variant="filled"  >
                  <IconSettings size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>

                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setEditingItem(props.row.original)}>
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
  return (
    <>
      <Grid gutter="xs">
        <Grid.Col span={{ md: 6 }}>
          <Paper>
            <FoodItemsForm />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ md: 6 }}>
          <Paper>
            <Title order={4}>Food Items List</Title>

            <Table columns={columns} data={list} />
          </Paper>
        </Grid.Col>
      </Grid>
      <Modal opened={editingItem ? true : false} size="lg" onClose={() => setEditingItem(undefined)} title="Edit Food Item">
        <FoodItemsForm isEditing={editingItem ? true : false} editingItem={editingItem} onClose={() => setEditingItem(undefined)} />
      </Modal>
    </>
  );
};

export default FoodItems;
