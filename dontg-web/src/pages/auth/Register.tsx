import { TextInput, PasswordInput, Text, Paper, Group, Button, Anchor, Stack, Container, Title, useMantineColorScheme } from "@mantine/core";
import { darkLight } from "@/utils";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { SignUpDTO } from "@/types/auth.type";
import { useSignUp } from "@/hooks/api/auth.hook";
import { signupSchema } from "@/schema";

export function Register() {
  const { colorScheme } = useMantineColorScheme();

  const { loading, userSignUp } = useSignUp();
  const form = useFormik<SignUpDTO>({
    initialValues: {
      name: "",
      email: "",
      conformPassword: "",
      password: "",
    },
    onSubmit: async (values) => {
      userSignUp(values);
    },
    validationSchema: signupSchema,
  });

  return (
    <Container size={420}>
      <Paper radius="lg" withBorder shadow="xs" style={{ overflow: "hidden" }}>
        <Paper shadow="none" p="xl" bg={darkLight(colorScheme, "cyan.9", "cyan")} radius={0}>
          <Title order={2} c="white" ta="center">
            Diet On The Go
          </Title>
        </Paper>
        <Paper shadow="none" p="xl">
          <Title order={2} ta="center" mb="xs">
            Free Register
          </Title>
          <Text ta="center" size="sm" mb="lg">
            Don't have an account? Create your account, it takes less than a minute.
          </Text>
          <form onSubmit={form.handleSubmit}>
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
                label="Email"
                placeholder="hello@test.dev"
                onBlur={form.handleBlur("email")}
                onChange={(e) => form.handleChange("email")(e.currentTarget.value)}
                value={form.values.email}
                error={form.touched.email && form.errors.email}
                radius="md"
              />

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

            <Group justify="space-between" mt="xl">
              <Anchor component={Link} to={"/login"} type="button" c="dimmed" size="xs">
                Already have an account? Login
              </Anchor>
              <Button type="submit" radius="xl" loading={loading}>
                Register
              </Button>
            </Group>
          </form>
        </Paper>
      </Paper>
      <style>
        {`
          #root{
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </Container>
  );
}
