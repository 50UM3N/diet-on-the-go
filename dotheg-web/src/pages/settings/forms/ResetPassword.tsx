import { useResetUserPassword } from "@/hooks/api/user.hooks";
import { resetPasswordSchema } from "@/schema";
import { ResetPasswordDTO } from "@/types/index.type";
import { Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useFormik } from "formik";

const ResetPassword = () => {
  const [resetPassword] = useResetUserPassword();
  const form = useFormik<ResetPasswordDTO>({
    initialValues: {
      confirmPassword: "",
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
          withAsterisk
          label="Password"
          placeholder="Your password"
          onBlur={form.handleBlur("password")}
          onChange={(e) => form.handleChange("password")(e.currentTarget.value)}
          value={form.values.password}
          error={form.touched.password && form.errors.password}
          radius="md"
        />

        <PasswordInput
          withAsterisk
          label="Confirm Password"
          placeholder="Confirm Your password"
          onBlur={form.handleBlur("confirmPassword")}
          onChange={(e) => form.handleChange("confirmPassword")(e.currentTarget.value)}
          value={form.values.confirmPassword}
          error={form.touched.confirmPassword && form.errors.confirmPassword}
          radius="md"
        />
      </Stack>

      <Group justify="e" mt="xl">
        <Button color="red" type="submit" radius="xl" loading={resetPassword.isPending}>
          Reset
        </Button>
      </Group>
    </form>
  );
};

export default ResetPassword;
