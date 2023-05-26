import { db } from "@/firebase";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const MealForm: React.FC<{ onAddSuccessful?: () => void; onClose?: () => void; isEditing?: boolean; editingItem?: DetailsMeals }> = ({
    onAddSuccessful,
    onClose,
    isEditing,
    editingItem,
}) => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const { chartId } = useParams();
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
        if (!chartId) return;
        if (isEditing && editingItem)
            await updateDoc(doc(db, "users", user.id, "charts", chartId, "meals", editingItem.id), { name: values.name });
        else await addDoc(collection(db, "users", user.id, "charts", chartId, "meals"), { ...values, createdAt: serverTimestamp(), foods: [] });
        setIsSaving(false);
        onAddSuccessful && onAddSuccessful();
        onClose && onClose();
    };

    useEffect(() => {
        if (isEditing && editingItem) form.setValues({ name: editingItem.name });
    }, [isEditing, editingItem]);

    return (
        <>
            <form onSubmit={form.onSubmit(formSubmit)} style={{marginTop:8}}>
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
