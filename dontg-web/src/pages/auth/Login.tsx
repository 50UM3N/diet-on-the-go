import { useFormik } from "formik";
import * as yup from "yup";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
  Container,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { darkLight } from "@/utils";
import { Link } from "react-router-dom";
import { LoginDTO } from "@/types/auth.type";
import { useLogin } from "@/hooks/api/auth.hook";

const loginSchema = yup.object().shape({
  email: yup.string().required("Email is required").email("Enter your email"),
  password: yup.string().required("Password is required"),
});

export function Login(props: PaperProps) {
  const { colorScheme } = useMantineColorScheme();
  const { loading, userLogin } = useLogin();
  const form = useFormik<LoginDTO>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      userLogin(values);
    },
    validationSchema: loginSchema,
  });

  return (
    <Container size={420}>
      <Paper radius="md" withBorder shadow="xs" style={{ overflow: "hidden" }} {...props}>
        <Paper shadow="none" p="xl" bg={darkLight(colorScheme, "blue.9", "blue")} radius={0}>
          <Title order={2} c="white" ta="center">
            Diet On The Go
          </Title>
        </Paper>
        <Paper shadow="none" p="xl">
          <Title order={2} ta="center" mb="xs">
            Sign In
          </Title>
          <Text ta="center" size="sm" mb="lg">
            Enter your email address and password to access admin panel.
          </Text>

          <form onSubmit={form.handleSubmit}>
            <Stack>
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
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor component={Link} to={"/register"} type="button" c="dimmed" size="xs">
                Don't have an account? Register
              </Anchor>
              <Button type="submit" radius="xl" loading={loading}>
                Login
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
