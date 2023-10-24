import { db } from "@/firebase";
import { Grid, LoadingOverlay, Paper, Tabs } from "@mantine/core";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Form from "./Form";
import Data from "./Data";

const UpdateDietChartPage = () => {
  const { chartId } = useParams();
  const user = useSelector<RootState, User | null>((state) => state.user.user);
  const [loading, setLoading] = useState(chartId ? true : false);
  const navigate = useNavigate();
  const [data, setData] = useState<DietChartData>();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    if (!user) return;
    if (!chartId) return;
    setLoading(true);
    const unsubscribe = onSnapshot(doc(db, "users", user.id, "charts", chartId), (snapshot) => {
      const data = snapshot.data() as any;
      if (!data) navigate("/");
      setData(data);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [chartId]);

  // for window size detection
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {windowWidth < 992 ? (
        <Tabs defaultValue="chartInfo">
          <Tabs.List grow position="center" data-no-print>
            <Tabs.Tab value="chartInfo">Chart Info</Tabs.Tab>
            <Tabs.Tab disabled={!data} value="mealInfo">
              Meal Info
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="chartInfo">
            <Paper style={{ position: "relative" }}>
              <LoadingOverlay visible={loading} overlayBlur={2} />
              <Form data={data} />
            </Paper>
          </Tabs.Panel>
          <Tabs.Panel value="mealInfo">
            <Paper style={{ position: "relative" }}>{data && <Data data={data} />}</Paper>
          </Tabs.Panel>
        </Tabs>
      ) : (
        <Grid>
          <Grid.Col md={6}>
            <Paper style={{ position: "relative" }}>
              <LoadingOverlay visible={loading} overlayBlur={2} />
              <Form data={data} />
            </Paper>
          </Grid.Col>
          <Grid.Col md={6}>
            <Paper style={{ position: "relative" }}>{data && <Data data={data} />}</Paper>
          </Grid.Col>
        </Grid>
      )}
    </>
  );
};

export default UpdateDietChartPage;
