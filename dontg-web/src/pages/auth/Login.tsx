import { useForm } from "@mantine/form";
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
export function Login(props: PaperProps) {
  const { colorScheme } = useMantineColorScheme();
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
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

          <form onSubmit={form.onSubmit(() => {})}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="hello@test.dev"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 6 characters"}
                radius="md"
              />
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor component={Link} to={"/register"} type="button" c="dimmed" size="xs">
                Don't have an account? Register
              </Anchor>
              <Button type="submit" radius="xl">
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
