import { useResetUserPassword } from "@/hooks/api/user.hooks";
import { resetPasswordSchema } from "@/schema";
import { ResetPasswordDTO } from "@/types/index.type";
import { Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useFormik } from "formik";

const ResetPassword = () => {
  const [resetPassword] = useResetUserPassword();
  const form = useFormik<ResetPasswordDTO>({
    initialValues: {
      conformPassword: "",
      password: "",
    },
    onSubmit: async (values) => {
      resetPassword.mutate(values);
    },
    validationSchema: resetPasswordSchema,
  });
  return (
    <form>
      <Stack>
        <PasswordInput
          required
          label="Password"
          placeholder="Your password"
          onBlur={form.handleBlur("password")}
          onChange={(e) => form.handleChange("password")(e.currentTarget.value)}
          value={form.values.password}
          error={form.touched.password && form.errors.password}
          radius="md"
        />

        <PasswordInput
          required
          label="Confirm Password"
          placeholder="Confirm Your password"
          onBlur={form.handleBlur("conformPassword")}
          onChange={(e) => form.handleChange("conformPassword")(e.currentTarget.value)}
          value={form.values.conformPassword}
          error={form.touched.conformPassword && form.errors.conformPassword}
          radius="md"
        />
      </Stack>

      <Group justify="e" mt="xl">
        <Button color="red" type="submit" radius="xl" loading={resetPassword.isLoading}>
          Reset
        </Button>
      </Group>
    </form>
  );
};

export default ResetPassword;