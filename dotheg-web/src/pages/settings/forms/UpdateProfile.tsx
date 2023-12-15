import { useUpdateUser } from "@/hooks/api/user.hooks";
import { updateUserSchema } from "@/schema";
import { UpdateUserDTO, UserInfo } from "@/types/index.type";
import { cmToInchFeet, inchFeetToCm } from "@/utils";
import { Button, Group, NumberInput, TextInput, Grid } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useFormik } from "formik";

const UpdateProfile = ({ data }: { data: UserInfo }) => {
  const [updateUser] = useUpdateUser();
  const form = useFormik<
    Omit<UpdateUserDTO, "height"> & {
      heightFeet: number;
      heightInches: number;
    }
  >({
    initialValues: {
      name: data.name,
      mobile: data.mobile || "",
      dob: data.dob || "",
      heightFeet: cmToInchFeet(data.height || 0).feet,
      heightInches: cmToInchFeet(data.height || 0).inch,
      weight: data.weight || 0,
    },
    onSubmit: async (values) => {
      const dto: UpdateUserDTO = {
        name: values.name,
        mobile: values.mobile,
        height: inchFeetToCm(values.heightFeet, values.heightInches),
        weight: Number(values.weight),
        dob: values.dob,
      };
      updateUser.mutate(dto);
    },
    validationSchema: updateUserSchema,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <Grid gutter="xs">
        <Grid.Col span={{ sm: 6 }}>
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Your name"
            onBlur={form.handleBlur("name")}
            onChange={(e) => form.handleChange("name")(e.currentTarget.value)}
            value={form.values.name}
            error={form.touched.name && form.errors.name}
            radius="md"
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            withAsterisk
            label="Mobile"
            placeholder="9000121212"
            onBlur={form.handleBlur("mobile")}
            onChange={(e) => form.handleChange("mobile")(String(e))}
            value={form.values.mobile}
            error={form.touched.mobile && form.errors.mobile}
            radius="md"
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <DateInput
            withAsterisk
            label="DOB"
            placeholder="12/01/2000"
            onBlur={form.handleBlur("dob")}
            onChange={(e) => form.handleChange("dob")(e?.toISOString() || "")}
            value={form.values.dob ? new Date(form.values.dob) : null}
            error={form.touched.dob && form.errors.dob}
            radius="md"
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            withAsterisk
            label="Weight(Kg)"
            placeholder="52"
            onBlur={form.handleBlur("weight")}
            onChange={(e) => form.handleChange("weight")(String(e))}
            value={form.values.weight}
            error={form.touched.weight && form.errors.weight}
            radius="md"
          />
        </Grid.Col>

        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            placeholder="eg. 10"
            label="Height (feet)"
            withAsterisk
            onBlur={form.handleBlur("heightFeet")}
            onChange={(e) => {
              form.handleChange("heightFeet")(String(e));
            }}
            value={form.values.heightFeet}
            error={form.touched.heightFeet && form.errors.heightFeet}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            placeholder="eg. 10"
            label="inches"
            withAsterisk
            onBlur={form.handleBlur("heightInches")}
            onChange={(e) => {
              form.handleChange("heightInches")(String(e));
            }}
            value={form.values.heightInches}
            error={form.touched.heightInches && form.errors.heightInches}
          />
        </Grid.Col>
      </Grid>

      <Group justify="e" mt="xl">
        <Button type="submit" radius="xl" loading={updateUser.isPending}>
          Update
        </Button>
      </Group>
    </form>
  );
};
export default UpdateProfile;
