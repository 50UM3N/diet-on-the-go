import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Anchor,
  Stack,
  Container,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { darkLight } from "@/utils";
import { Link } from "react-router-dom";
export function Register() {
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
      <Paper radius="md" withBorder shadow="xs" style={{ overflow: "hidden" }}>
        <Paper shadow="none" p="xl" bg={darkLight(colorScheme, "blue.9", "blue")} radius={0}>
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
          <form onSubmit={form.onSubmit(() => {})}>
            <Stack>
              <TextInput
                required
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                radius="md"
              />
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
              <Anchor component={Link} to={"/login"} type="button" c="dimmed" size="xs">
                Already have an account? Login
              </Anchor>
              <Button type="submit" radius="xl">
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
