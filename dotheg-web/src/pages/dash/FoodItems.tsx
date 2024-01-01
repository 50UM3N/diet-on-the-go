import Breadcrumbs from "@/components/Breadcrumbs";
import Loader from "@/components/Loader";
import Table from "@/components/Table";
import { EntryBase } from "@/data/constant";
import { useCreateFoodItem, useDeleteFoodItem, useGetFoodItem, useImportFoodItem, useUpdateFoodItem } from "@/hooks/api/foodItem.hook";
import { queryClient } from "@/main";
import { foodItemSchema } from "@/schema";
import { FoodItemDTO, FoodItemInfo } from "@/types/index.type";
import { downloadFile, toUrl } from "@/utils";
import { ActionIcon, Button, Container, FileInput, Grid, Group, Menu, Modal, NumberInput, Select, SimpleGrid, Text, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconJson, IconSettings, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { useFormik } from "formik";
import { useMemo, useState } from "react";

const FoodItems = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [data] = useGetFoodItem();
  const [editingItem, setEditingItem] = useState<FoodItemInfo>();
  const [deleteFoodItem] = useDeleteFoodItem();
  const [importData, setImportData] = useState(false);
  const handleDelete = async (id: string) => {
    modals.openConfirmModal({
      title: "Action Required",
      children: <Text size="sm">Are you sure to delete this item?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red", loading: deleteFoodItem.isPending },
      onConfirm: () => {
        deleteFoodItem.mutate(id, {
          onSuccess: () => {
            queryClient.invalidateQueries();
          },
        });
      },
    });
  };
  const columns = useMemo<ColumnDef<any, any>[]>(
    () => [
      {
        id: "action",
        header: "Action",
        accessorKey: "id",
        enableColumnFilter: false,
        maxSize: 30,
        cell(props) {
          const id = props.getValue();
          return (
            <Menu shadow="md" width={100} position="bottom-start">
              <Menu.Target>
                <ActionIcon size="sm" variant="filled">
                  <IconSettings size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={() => {
                    setEditingItem(props.row.original);
                    open();
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => {
                    handleDelete(id);
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          );
        },
      },

      {
        accessorKey: "name",
        header: "Name",
      },

      {
        accessorKey: "metric",
        header: "Metric",
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
        accessorKey: "carb",
        header: "Carbohydrate",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (data.data)
    return (
      <Container size="xl">
        <Breadcrumbs data={[{ name: "Food Items", path: "/food-item" }]} />
        <Table
          columns={columns}
          data={data.data}
          showAddButton
          buttonProps={{}}
          onAddButtonClick={open}
          otherButtons={
            <Menu shadow="md" width={100} position="bottom-start">
              <Menu.Target>
                <ActionIcon size="lg" radius="md" variant="filled">
                  <IconSettings size={18} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setImportData(true)}>
                  Import
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item leftSection={<IconTrash size={16} />} onClick={() => downloadFile(toUrl([EntryBase.FOOD_ITEM, "export"]))}>
                  Export
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
        />
        <Modal
          opened={opened}
          onClose={() => {
            close();
            setEditingItem(undefined);
          }}
          title={editingItem ? "Update Food Item" : "Add Food Item"}
          centered
        >
          <FoodItemsForm
            onSave={() => {
              close();
              setEditingItem(undefined);
            }}
            editingItem={editingItem}
          />
        </Modal>
        <Modal opened={importData} onClose={() => setImportData(false)} title="Import Food Item" centered>
          <FoodItemImport
            onSave={() => {
              close();
              setImportData(false);
            }}
          />
        </Modal>
      </Container>
    );

  return <Loader />;
};

export default FoodItems;

const FoodItemsForm: React.FC<{ onSave?: () => void; editingItem?: FoodItemInfo }> = ({ onSave, editingItem }) => {
  const [createFoodItem] = useCreateFoodItem();
  const [updateFoodItem] = useUpdateFoodItem();
  const form = useFormik<FoodItemDTO>({
    initialValues: {
      name: editingItem ? editingItem.name : "",
      metric: editingItem ? editingItem.metric : "",
      protein: editingItem ? editingItem.protein : 0,
      fat: editingItem ? editingItem.fat : 0,
      carb: editingItem ? editingItem.carb : 0,
    },
    onSubmit: async (values) => {
      values.protein = Number(values.protein);
      values.fat = Number(values.fat);
      values.carb = Number(values.carb);
      if (editingItem) {
        updateFoodItem.mutate(
          { id: editingItem.id, data: values },
          {
            onSuccess: () => {
              onSave && onSave();
              queryClient.invalidateQueries();
            },
          }
        );
      } else {
        createFoodItem.mutate(values, {
          onSuccess: () => {
            onSave && onSave();
            queryClient.invalidateQueries();
          },
        });
      }
    },
    validationSchema: foodItemSchema,
  });
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Grid gutter="xs" mb="xs">
          <Grid.Col span={{ md: 9 }}>
            <TextInput
              size="xs"
              placeholder="eg. Chicken"
              label="Name"
              withAsterisk
              onBlur={form.handleBlur("name")}
              onChange={(e) => form.handleChange("name")(e)}
              value={form.values.name}
              error={form.touched.name && form.errors.name}
            />
          </Grid.Col>
          <Grid.Col span={{ md: 3 }}>
            <Select
              withAsterisk
              size="xs"
              label="Metric"
              placeholder="Pick one"
              data={[
                { value: "/100g", label: "/100g" },
                { value: "/pc", label: "/pc" },
                { value: "/ml", label: "/ml" },
              ]}
              onBlur={form.handleBlur("email")}
              onChange={(e) => form.handleChange("metric")(e || "")}
              value={form.values.metric}
              error={form.touched.metric && form.errors.metric}
            />
          </Grid.Col>
        </Grid>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          <NumberInput
            step={0.05}
            size="xs"
            placeholder="eg. 10"
            label="Protein (g)"
            withAsterisk
            min={0}
            onBlur={form.handleBlur("email")}
            onChange={(e) => form.handleChange("protein")(String(e))}
            value={form.values.protein}
            error={form.touched.protein && form.errors.protein}
          />
          <NumberInput
            step={0.05}
            size="xs"
            placeholder="eg. 4"
            label="Fat (g)"
            withAsterisk
            min={0}
            onBlur={form.handleBlur("email")}
            onChange={(e) => form.handleChange("fat")(String(e))}
            value={form.values.fat}
            error={form.touched.fat && form.errors.fat}
          />
          <NumberInput
            step={0.05}
            size="xs"
            placeholder="eg. 10"
            label="Carbohydrate (g)"
            min={0}
            withAsterisk
            onBlur={form.handleBlur("carb")}
            onChange={(e) => {
              form.handleChange("carb")(String(e));
            }}
            value={form.values.carb}
            error={form.touched.carb && form.errors.carb}
          />
        </SimpleGrid>
        <Group justify="right" mt="md">
          <Button size="xs" type="submit" loading={createFoodItem.isPending || updateFoodItem.isPending}>
            {editingItem ? "Update" : "Save"}
          </Button>
        </Group>
      </form>
    </>
  );
};

const FoodItemImport: React.FC<{ onSave?: () => void; editingItem?: FoodItemInfo }> = ({ onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importFoodItem] = useImportFoodItem();
  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file, "file.json");
    importFoodItem.mutate(formData, {
      onSuccess: () => {
        onSave && onSave();
        queryClient.invalidateQueries();
      },
    });
  };

  return (
    <form onSubmit={handleUpload}>
      <FileInput
        rightSection={<IconJson />}
        mb="sm"
        label="File"
        onChange={(e) => {
          setFile(e);
        }}
        value={file}
        error={error}
        // @ts-ignore
        placeholder="Upload files"
      />
      <Button w="100%" type="submit">
        Import
      </Button>
    </form>
  );
};
