import Loader from "@/components/Loader";
import Table from "@/components/Table";
import { useCreateChart, useDeleteChart, useGetChart } from "@/hooks/api/chart.hook";
import { createChartSchema } from "@/schema";
import { CreateChartDTO } from "@/types/index.type";
import { ActionIcon, Button, Container, Group, Menu, Modal, Stack, Text, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconSettings } from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table";
import { useFormik } from "formik";
import { useMemo } from "react";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

const DietChart = () => {
  const navigate = useNavigate();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const [data] = useGetChart();
  const [deleteChart] = useDeleteChart();
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
        maxSize: 30,
        cell(props) {
          const id = props.getValue();
          return (
            <Menu shadow="md" width={200} position="bottom-start">
              <Menu.Target>
                <ActionIcon size="sm" variant="filled">
                  <IconSettings size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => navigate(`/diet-chart/${id}`)}>
                  Edit
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
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
        <Table columns={columns} data={data.data} showAddButton buttonProps={{}} onAddButtonClick={open} />
        <Modal opened={opened} onClose={close} title={"Create Diet Chart"}>
          <DietChartForm
            onSave={() => {
              close();
            }}
          />
        </Modal>
      </Container>
    );
  return <Loader />;
};

export default DietChart;

const DietChartForm: React.FC<{ onSave?: (id: string) => void }> = ({ onSave }) => {
  const queryClient = useQueryClient();
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
          <Button size="xs" type="submit" loading={createChart.isLoading}>
            Create
          </Button>
        </Group>
      </form>
    </>
  );
};
