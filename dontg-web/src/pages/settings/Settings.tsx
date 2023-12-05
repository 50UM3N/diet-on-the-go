import Breadcrumbs from "@/components/Breadcrumbs";
import { Container, Grid, Paper, Text, Title } from "@mantine/core";
import ResetPassword from "./forms/ResetPassword";

const Settings = () => {
  return (
    <Container size="xl">
      <Breadcrumbs data={[{ name: "Settings" }]} />
      <Grid>
        <Grid.Col span={{ md: 6 }}>
          <Paper withBorder p="md" radius="lg">
            <Title order={4}>Update Profile</Title>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ md: 6 }}>
          <Paper withBorder p="md" radius="lg">
            <Title order={3} mb={4}>
              Reset Password
            </Title>
            <Text mb="xs">Reset password leads to logout the system</Text>
            <ResetPassword />
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Settings;
