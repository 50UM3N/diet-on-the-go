import { useFormik } from "formik";
import { TextInput, PasswordInput, Text, Paper, Group, PaperProps, Button, Anchor, Stack, Container, Title, useMantineColorScheme } from "@mantine/core";
import { darkLight } from "@/utils";
import { Link } from "react-router-dom";
import { LoginDTO } from "@/types/auth.type";
import { useGoogleLogin as useGoogle, useLogin } from "@/hooks/api/auth.hook";
import { loginSchema } from "@/schema";
// import { useGoogleLogin } from "@react-oauth/google";
import GoogleLogin from "@/components/GoogleLogin";

export function Login(props: PaperProps) {
  const { colorScheme } = useMantineColorScheme();
  const { loading, userLogin } = useLogin();
  const { googleLogin } = useGoogle();
  // const login = useGoogleLogin({
  //   onSuccess: (tokenResponse) => googleLogin(tokenResponse.access_token),
  //   flow: "implicit",
  // });
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
    <Container size={420} px="md">
      <Paper radius="lg" withBorder shadow="xs" style={{ overflow: "hidden" }} {...props}>
        <Paper shadow="none" p="xl" bg={darkLight(colorScheme, "cyan.9", "cyan")} radius={0}>
          <Title order={2} c="white" ta="center">
            Diet On The Go
          </Title>
        </Paper>
        <Paper shadow="none" px="lg" py="xl">
          <Title order={2} ta="center" mb="xs">
            Sign In
          </Title>
          <Text ta="center" size="sm" mb="lg">
            Enter your email address and password to access admin panel.
          </Text>

          <form onSubmit={form.handleSubmit}>
            <Stack>
              <TextInput
                withAsterisk
                label="Email"
                placeholder="hello@test.dev"
                onBlur={form.handleBlur("email")}
                onChange={(e) => form.handleChange("email")(e.currentTarget.value)}
                value={form.values.email}
                error={form.touched.email && form.errors.email}
                radius="md"
                type="email"
              />

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
            </Stack>

            <Group justify="center" align="center" mt="xl">
              <Anchor component={Link} to={"/register"} type="button" c="dimmed" size="xs">
                Don't have an account? Register
              </Anchor>
              <Group>
                {/* <Button onClick={() => login()} radius="xl">
                  Google
                </Button> */}
                <GoogleLogin
                  onGoogleSignIn={(res: any) => {
                    googleLogin(res.credential);
                  }}
                />
                <Button type="submit" radius="xl" loading={loading}>
                  Login
                </Button>
              </Group>
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
