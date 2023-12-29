import { useResetUserPassword } from "@/hooks/api/user.hooks";
import { resetPasswordSchema } from "@/schema";
import { ResetPasswordDTO } from "@/types/index.type";
import { Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useFormik } from "formik";

const ResetPassword = () => {
  const [resetPassword] = useResetUserPassword();
  const form = useFormik<ResetPasswordDTO>({
    initialValues: {
      oldPassword: "",
      confirmPassword: "",
      password: "",
    },
    onSubmit: async (values) => {
      resetPassword.mutate(values);
    },
    validationSchema: resetPasswordSchema,
  });
  return (
    <form onSubmit={form.handleSubmit}>
      <Stack>
        <PasswordInput
          withAsterisk
          label=" Old Password"
          placeholder="Your old password"
          onBlur={form.handleBlur("oldPassword")}
          onChange={(e) => form.handleChange("oldPassword")(e.currentTarget.value)}
          value={form.values.oldPassword}
          error={form.touched.oldPassword && form.errors.oldPassword}
          radius="md"
        />

        <PasswordInput
          withAsterisk
          label="New Password"
          placeholder="Your new password"
          onBlur={form.handleBlur("password")}
          onChange={(e) => form.handleChange("password")(e.currentTarget.value)}
          value={form.values.password}
          error={form.touched.password && form.errors.password}
          radius="md"
        />

        <PasswordInput
          withAsterisk
          label="Confirm New Password"
          placeholder="Confirm your new password"
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
