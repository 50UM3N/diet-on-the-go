import { useGetChartById } from "@/hooks/api/chart.hook";
import { useParams } from "react-router-dom";
import ChartForm from "./forms/ChartForm";
import { Container, Grid, Paper } from "@mantine/core";
import Data from "./Data";
import Loader from "@/components/Loader";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useGetUser } from "@/hooks/api/user.hooks";

const UpdateDietChart = () => {
  const { id } = useParams();
  const [data] = useGetChartById(id as string);
  const [userData] = useGetUser();
  if (data.data && userData.data)
    return (
      <Container size="xl">
        <Breadcrumbs data={[{ name: "Diet Chart", path: "/diet-chart" }, { name: data.data.name }]} />
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="lg">
              <ChartForm user={userData.data} data={data.data} />
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Data chart={data.data} />
          </Grid.Col>
        </Grid>
      </Container>
    );
  return <Loader />;
};

export default UpdateDietChart;
