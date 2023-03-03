import { db } from "@/firebase";
import { Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const MealForm: React.FC<{ onAddSuccessful?: () => void; onClose?: () => void; isEditing?: boolean; editingItem?: DetailsMeals }> = ({
    onAddSuccessful,
    onClose,
    isEditing,
    editingItem,
}) => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: {
            name: (value) => (value ? null : "Required"),
        },
    });
    const formSubmit = async (values: any) => {
        setIsSaving(true);
        if (!user) return;
        if (!id) return;
        if (isEditing && editingItem)
            await updateDoc(doc(db, "users", user.id, "charts", id, "meals", editingItem.id), { name: values.name });
        else await addDoc(collection(db, "users", user.id, "charts", id, "meals"), { ...values, foods: [] });
        setIsSaving(false);
        onAddSuccessful && onAddSuccessful();
        onClose && onClose();
    };

    useEffect(() => {
        if (isEditing && editingItem) form.setValues({ name: editingItem.name });
    }, [isEditing, editingItem]);

    return (
        <>
            <Text mb="xs">{isEditing ? "Update Your Meal" : "Add New Meal"}</Text>
            <form onSubmit={form.onSubmit(formSubmit)}>
                <TextInput mb="xs" placeholder="eg. Breakfast" label="Name" withAsterisk {...form.getInputProps("name")} />
                <Group position="right" mt="md">
                    <Button variant="outline" type="button" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSaving}>
                        {isEditing ? "Update" : "Add"}
                    </Button>
                </Group>
            </form>
        </>
    );
};

export default MealForm;
