import Breadcrumbs from "@/components/Breadcrumbs";
import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import ResetPassword from "./forms/ResetPassword";
import UpdateProfile from "./forms/UpdateProfile";
import { useGetUser } from "@/hooks/api/user.hooks";
import Loader from "@/components/Loader";

const Settings = () => {
  const [data] = useGetUser();
  if (data.data)
    return (
      <Container size="xl">
        <Breadcrumbs data={[{ name: "Settings" }]} />
        <Grid>
          <Grid.Col span={{ md: 6 }}>
            <Paper withBorder p="md" radius="lg">
              <Title order={3} mb={8}>
                Update Profile
              </Title>
              <UpdateProfile data={data.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <Paper withBorder p="md" radius="lg">
              <Title order={3} mb={4}>
                Reset Password
              </Title>
              <Text mb="xs">Reset password leads to logout from the system</Text>
              <ResetPassword />
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    );
  return <Loader />;
};

export default Settings;
