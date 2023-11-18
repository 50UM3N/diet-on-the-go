import { db } from "@/firebase";
import { updateUser } from "@/store/slices/userSlice";
import { Container, Modal, NumberInput, Grid, Group, Button } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopNav from "./TopNav";
import { theme } from "@/theme";

const AppShell: React.FC<any> = ({ children, footer = true }) => {
  const user = useSelector<RootState, User | null>((state) => state.user.user);
  const [openModal, setOpenModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      dob: "",
      feet: 0,
      inches: 0,
      weight: 0,
    },

    validate: {
      dob: (value) => (value ? null : "Required"),
      feet: (value) => (value ? null : "Required"),
      inches: (value) => (value ? null : "Required"),
      weight: (value) => (value ? null : "Required"),
    },
  });

  const formSubmit = async (values: any) => {
    if (!user) return;
    setIsSaving(true);
    const data = {
      dob: values.dob,
      height: {
        feet: values.feet,
        inches: values.inches,
      },
      weight: values.weight,
    };
    await updateDoc(doc(db, "users", user.id), data);
    dispatch(updateUser({ ...data, dob: data.dob.toLocaleDateString() }));
    setIsSaving(false);
    setOpenModal(false);
    showNotification({
      title: "Success",
      message: "Successfully Update your information",
    });
  };

  useEffect(() => {
    if (!user?.weight) {
      setOpenModal(true);
    }
  }, [user]);
  const closeModal = () => {
    if (user?.weight) {
      setOpenModal(true);
    } else {
      showNotification({
        color: "red",
        title: "Set the information",
        message: "Please enter your information",
      });
    }
  };
  return (
    <>
      <TopNav />
      <main style={{ height: `calc(100% - 44px - ${theme.spacing.xs})`, overflow: "auto" }}>
        <Container fluid m={0} px="xs" py="xs">
          {children}
          <Modal opened={openModal} onClose={closeModal} title={`Hi ${user?.name}. Fill your basic information`}>
            <form onSubmit={form.onSubmit(formSubmit)}>
              <DateInput size="xs" mb="xs" placeholder="Pick date" label="Event date" withAsterisk {...form.getInputProps("dob")} />
              <Grid gutter="xs" mb="xs">
                <Grid.Col span={6}>
                  <NumberInput step={0.5} size="xs" placeholder="eg. 10" label="Height (feet)" withAsterisk min={0} {...form.getInputProps("feet")} />
                </Grid.Col>
                <Grid.Col span={6}>
                  <NumberInput step={0.5} size="xs" placeholder="eg. 10" label="Height (inches)" withAsterisk min={0} {...form.getInputProps("inches")} />
                </Grid.Col>
              </Grid>
              <NumberInput mb="xs" step={0.5} size="xs" placeholder="eg. 10" label="Weight (kg)" withAsterisk min={0} {...form.getInputProps("weight")} />

              <Group justify="flex-end" mt="md">
                <Button size="xs" type="submit" loading={isSaving}>
                  Update
                </Button>
              </Group>
            </form>
          </Modal>
        </Container>
      </main>
    </>
  );
};

export default AppShell;
