import { useUpdateUser } from "@/hooks/api/user.hooks";
import { updateChartSchema } from "@/schema";
import { UpdateUserDTO } from "@/types/index.type";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useFormik } from "formik";


const UpdateProfile=()=>{

  const [updateUser] = useUpdateUser();
  const form = useFormik<UpdateUserDTO>({
    initialValues: {
        name: "",
        mobile: "",
        dob: "",
        height: 0,
        weight: 0,
    },
    onSubmit: async (values) => {
    //   updateUser.mutate(values);
    },
    validationSchema: updateChartSchema,
  });

    return (
        <form>
          <Stack>
          <TextInput
                required
                label="Name"
                placeholder="Your name"
                onBlur={form.handleBlur("name")}
                onChange={(e) => form.handleChange("name")(e.currentTarget.value)}
                value={form.values.name}
                error={form.touched.name && form.errors.name}
                radius="md"
            />
            <TextInput
                required
                label="Mobile"
                placeholder="9000121212"
                onBlur={form.handleBlur("mobile")}
                onChange={(e) => form.handleChange("mobile")(e.currentTarget.value)}
                value={form.values.mobile}
                error={form.touched.mobile && form.errors.mobile}
                radius="md"
            />
            <TextInput
                required
                label="DOB"
                placeholder="12/01/2000"
                onBlur={form.handleBlur("dob")}
                onChange={(e) => form.handleChange("dob")(e.currentTarget.value)}
                value={form.values.dob}
                error={form.touched.dob && form.errors.dob}
                radius="md"
            />
            <TextInput
                required
                label="Height(Ft.)"
                placeholder="5.10"
                onBlur={form.handleBlur("height")}
                onChange={(e) => form.handleChange("height")(e.currentTarget.value)}
                value={form.values.height}
                error={form.touched.height && form.errors.height}
                radius="md"
            />
            <TextInput
                required
                label="Weight(Kg)"
                placeholder="52"
                onBlur={form.handleBlur("weight")}
                onChange={(e) => form.handleChange("weight")(e.currentTarget.value)}
                value={form.values.weight}
                error={form.touched.weight && form.errors.weight}
                radius="md"
            />
          </Stack>
    
          <Group justify="e" mt="xl">
            <Button color="red" type="submit" radius="xl" loading={updateUser.isLoading}>
              Update
            </Button>
          </Group>
        </form>
      );
};
export default UpdateProfile;