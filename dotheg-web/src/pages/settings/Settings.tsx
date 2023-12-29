import Breadcrumbs from "@/components/Breadcrumbs";
import { Button, Container, Grid, Group, Paper, Text, Title, FileInput, rem, Notification } from "@mantine/core";
import ResetPassword from "./forms/ResetPassword";
import UpdateProfile from "./forms/UpdateProfile";
import { useGetUser } from "@/hooks/api/user.hooks";
import Loader from "@/components/Loader";
import { IconFilePlus } from "@tabler/icons-react";

const Settings = () => {
  const [data] = useGetUser();
  const icon = <IconFilePlus style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;

  if (data.data) {
    console.log(data.data);
    return (
      <Container size="xl">
        <Breadcrumbs data={[{ name: "Settings" }]} />
        <Grid>
          <Grid.Col span={{ md: 6 }}>
            <Paper withBorder p="md" radius="lg" mb={"md"}>
              <Title order={3} mb={8}>
                Update Profile
              </Title>
              <UpdateProfile data={data.data} />
              {/* <Notification title="We notify you that">You are now obligated to give a star to Mantine project on GitHub</Notification> */}
            </Paper>
            {data.data.loginType == "default" && (
              <Paper withBorder p="md" radius="lg">
                <Title order={3} mb={4}>
                  Reset Password
                </Title>
                <Text mb="xs">Reset password leads to logout from the system</Text>
                <ResetPassword />
              </Paper>
            )}
          </Grid.Col>
          <Grid.Col span={{ md: 6 }}>
            <Paper withBorder p="md" radius="lg">
              <Title order={3} mb={4}>
                Import/Export Data
              </Title>
              <FileInput clearable leftSection={icon} label="Attach your file to import" placeholder="Your File" leftSectionPointerEvents="none" />
              <Group justify="e" mt="xl">
                <Button type="submit" radius="xl">
                  Import
                </Button>
                <Button type="submit" radius="xl">
                  Export
                </Button>
              </Group>
            </Paper>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }
  return <Loader />;
};

export default Settings;
