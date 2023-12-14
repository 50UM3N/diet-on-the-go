import { Container } from "@mantine/core";
import Data from "./dash/DietChart/Data";
import { useParams } from "react-router-dom";
import { useGetChartById } from "@/hooks/api/chart.hook";
import Loader from "@/components/Loader";

const View = () => {
  const { id } = useParams();
  const [data] = useGetChartById(id as string);
  if (data.data)
    return (
      <Container my="xl" px="md">
        <Data isViewing chart={data.data} />
      </Container>
    );
  return <Loader full />;
};

export default View;
