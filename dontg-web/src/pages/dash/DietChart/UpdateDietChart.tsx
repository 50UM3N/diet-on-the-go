import { useGetChartById } from "@/hooks/api/chart.hook";
import { useParams } from "react-router-dom";
import ChartForm from "./forms/ChartForm";
import { Container, Grid, Paper } from "@mantine/core";
import Data from "./Data";
import Loader from "@/components/Loader";

const UpdateDietChart = () => {
  const { id } = useParams();
  const [data] = useGetChartById(id as string);
  if (data.data)
    return (
      <Container size="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper withBorder p="md" radius="lg">
              <ChartForm data={data.data} />
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
