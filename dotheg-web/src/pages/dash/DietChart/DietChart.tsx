import Breadcrumbs from "@/components/Breadcrumbs";
import Loader from "@/components/Loader";
import Table from "@/components/Table";
import { EntryBase } from "@/data/constant";
import { useCreateChart, useCreateCopyChart, useDeleteChart, useGetChart, useImportChart } from "@/hooks/api/chart.hook";
import { queryClient } from "@/main";
import { createChartSchema } from "@/schema";
import { ChartInfo, CreateChartDTO } from "@/types/index.type";
import { downloadFile, toUrl } from "@/utils";
import { ActionIcon, Button, Container, FileInput, Group, Menu, Modal, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCopy, IconEdit, IconJson, IconSettings, IconTrash } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const DietChart = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const [data] = useGetChart();
  const [deleteChart] = useDeleteChart();
  const [copyChart] = useCreateCopyChart();
  const [importData, setImportData] = useState(false);
  const handleDelete = async (id: string) => {
    modals.openConfirmModal({
      title: "Action Required",
      children: <Text size="sm">Are you sure to delete this item?</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteChart.mutate(id, {
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
        maxSize: 10,

        cell(props) {
          const id = props.getValue();
          return (
            <Menu shadow="md" width={150} position="bottom-start">
              <Menu.Target>
                <ActionIcon size="sm" variant="filled">
                  <IconSettings size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/diet-chart/${id}`)}>
                  Edit
                </Menu.Item>
                <Menu.Item leftSection={<IconCopy size={14} />} onClick={() => copyChart.mutate({ chartId: id })}>
                  Duplicate
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
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "intakeCalories",
        header: "Calories",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (data.data)
    return (
      <Container size="xl">
        <Breadcrumbs data={[{ name: "Diet Chart", path: "/diet-chart" }]} />
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
                <Menu.Item leftSection={<IconTrash size={16} />} onClick={() => downloadFile(toUrl([EntryBase.CHART, "export"]))}>
                  Export
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
        />
        <Modal opened={opened} onClose={close} title={"Create Diet Chart"} centered>
          <DietChartForm
            onSave={() => {
              close();
            }}
          />
        </Modal>
        <Modal opened={importData} onClose={() => setImportData(false)} title="Import Food Item" centered>
          <ChartImport
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

export default DietChart;

const DietChartForm: React.FC<{ onSave?: (id: string) => void }> = ({ onSave }) => {
  const [createChart] = useCreateChart();
  const form = useFormik<CreateChartDTO>({
    initialValues: {
      name: "",
      description: "",
    },
    onSubmit: async (values) => {
      createChart.mutate(values, {
        onSuccess: (e) => {
          onSave && onSave(e.id);
          queryClient.invalidateQueries();
        },
      });
    },
    validationSchema: createChartSchema,
  });
  return (
    <>
      <form onSubmit={form.handleSubmit}>
        <Stack gap="xs" mb="xs">
          <TextInput
            size="xs"
            placeholder="Enter Name"
            label="Name"
            withAsterisk
            onBlur={form.handleBlur("name")}
            onChange={(e) => form.handleChange("name")(e)}
            value={form.values.name}
            error={form.touched.name && form.errors.name}
          />
          <Textarea
            size="xs"
            placeholder="Enter Description"
            label="Description"
            onBlur={form.handleBlur("description")}
            onChange={(e) => form.handleChange("description")(e)}
            value={form.values.description}
            error={form.touched.description && form.errors.description}
          />
        </Stack>

        <Group justify="right" mt="md">
          <Button size="xs" type="submit" loading={createChart.isPending}>
            Create
          </Button>
        </Group>
      </form>
    </>
  );
};

const ChartImport: React.FC<{ onSave?: () => void; editingItem?: ChartInfo }> = ({ onSave }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importFoodItem] = useImportChart();
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
