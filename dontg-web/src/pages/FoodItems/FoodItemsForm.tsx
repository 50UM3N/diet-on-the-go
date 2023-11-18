import { db } from "@/firebase";
import { Button, Divider, Grid, Group, NumberInput, Select, SimpleGrid, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const FoodItemsForm: React.FC<{ onAddSuccessful?: () => void; onClose?: () => void; isEditing?: boolean; editingItem?: FoodItem }> = ({ onAddSuccessful, onClose, isEditing, editingItem }) => {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      protein: 0,
      fat: 0,
      carbohydrate: 0,
      metric: "",
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      protein: (value) => (value || value >= 0 ? null : "Required"),
      fat: (value) => (value || value >= 0 ? null : "Required"),
      carbohydrate: (value) => (value || value >= 0 ? null : "Required"),
      metric: (value) => (value ? null : "Required"),
    },
  });
  const formSubmit = async (values: any) => {
    setIsSaving(true);
    if (isEditing && editingItem) await updateDoc(doc(db, "foodItems", editingItem.id), values);
    else await addDoc(collection(db, "foodItems"), values);
    setIsSaving(false);
    onAddSuccessful && onAddSuccessful();
    onClose && onClose();
    form.reset();
  };
  useEffect(() => {
    if (isEditing && editingItem)
      form.setValues({
        name: editingItem.name,
        carbohydrate: editingItem.carbohydrate,
        fat: editingItem.fat,
        metric: editingItem.metric,
        protein: editingItem.protein,
      });
  }, [isEditing, editingItem]);
  return (
    <>
      <Title order={4}>Food Items Form (100g Basis)</Title>
      <Divider my="xs" />
      <form onSubmit={form.onSubmit(formSubmit)}>
        <Grid gutter="xs" mb="xs">
          <Grid.Col span={{ md: 10 }}>
            <TextInput size="xs" placeholder="eg. Chicken" label="Name" withAsterisk {...form.getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={{ md: 2 }}>
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
          </Grid.Col>
        </Grid>
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          <NumberInput step={0.05} size="xs" placeholder="eg. 10" label="Protein (g)" withAsterisk min={0} {...form.getInputProps("protein")} />
          <NumberInput step={0.05} size="xs" placeholder="eg. 4" label="Fat (g)" withAsterisk min={0} {...form.getInputProps("fat")} />
          <NumberInput step={0.05} size="xs" placeholder="eg. 10" label="Carbohydrate (g)" min={0} withAsterisk {...form.getInputProps("carbohydrate")} />
        </SimpleGrid>
        <Group justify="right" mt="md">
          <Button size="xs" type="submit" loading={isSaving}>
            Save
          </Button>
        </Group>
      </form>
    </>
  );
};

export default FoodItemsForm;
