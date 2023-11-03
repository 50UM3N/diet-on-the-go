import { db } from "@/firebase";
import { ActionIcon, Badge, Button, Center, Divider, Grid, Group, NumberInput, Paper, Select, Slider, Text, TextInput, Textarea, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as DateFns from "date-fns";
import { ACTIVITY_LEVEL } from "@/data/constant";
import { calToGm, calcPercentage, calculateAMR, calculateBMR } from "@/utils";
import { IconCalculator } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { appTheme } from "@/theme";
const style: any = {
  wrapper: {
    position: "relative",
  },

  input: {
    height: "auto",
    paddingTop: 22,
    paddingBottom: 3,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  label: {
    position: "absolute",
    pointerEvents: "none",
    paddingLeft: appTheme.spacing?.sm,
    paddingTop: (appTheme.spacing?.sm as any) / 2,
    zIndex: 1,
  },

  slider: {
    position: "absolute",
    width: "100%",
    bottom: -1,
  },

  thumb: {
    width: 18,
    height: 18,
  },

  track: {
    backgroundColor: appTheme.colors?.gray?.[4],
  },
};

const defaultValue = {
  name: "",
  description: "",
  weight: 0,
  height: { inches: 0, feet: 0 },
  gender: "",
  age: 0,
  activity: "",
  bmr: 0,
  maintenances_calorie: 0,
  calorie_deficit_surplus_amount: 0,
  calorie_deficit_surplus_type: "",
  calorie_intake: 0,
  protein_intake: 50,
  fat_intake: 25,
  carbohydrate_intake: 25,
};
const Form = ({ data }: { data?: DietChartData }) => {
  const form = useForm({
    initialValues: defaultValue,
    validate: {
      name: (value) => (value ? null : "Required"),
      weight: (value) => (value || value > 0 ? null : "Required"),
      height: {
        inches: (value) => (value || value >= 0 ? null : "Required"),
        feet: (value) => (value || value > 0 ? null : "Required"),
      },
      gender: (value) => (value ? null : "Required"),
      age: (value) => (value || value > 0 ? null : "Required"),
      activity: (value) => (value ? null : "Required"),
      bmr: (value) => (value || value > 0 ? null : "Required"),
      maintenances_calorie: (value) => (value || value > 0 ? null : "Required"),
      calorie_deficit_surplus_amount: (value) => (value || value >= 0 ? null : "Required"),
      calorie_deficit_surplus_type: (value) => (value ? null : "Required"),
      calorie_intake: (value) => (value || value > 0 ? null : "Required"),
    },
  });

  const { chartId } = useParams();
  const user = useSelector<RootState, User | null>((state) => state.user.user);

  const [showResult, setShowResult] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // @ts-ignore
    const age = DateFns.differenceInYears(new Date(), new Date(user?.dob));
    let formInitialValues = {
      name: data?.name || "",
      description: data?.description || "",
      weight: user?.weight,
      height: user?.height,
      age,
    };
    if (data?.age) {
      formInitialValues = {
        ...formInitialValues,
        ...data,
      };
      setShowResult(true);
    }

    form.setValues((old) => ({ ...old, ...formInitialValues }));
  }, [data, user]);

  const resetBMRAndMC = () => {
    form.setValues({ bmr: 0, maintenances_calorie: 0 });
    resetCalorieIntake();
  };

  const resetCalorieIntake = () => {
    form.setValues({ calorie_intake: 0 });
    setShowResult(false);
  };

  const calculateBMRAndMC = () => {
    const weight = form.validateField("weight").hasError;
    const gender = form.validateField("gender").hasError;
    const height_feet = form.validateField("height.feet").hasError;
    const height_inches = form.validateField("height.inches").hasError;
    const age = form.validateField("age").hasError;
    const activity = form.validateField("activity").hasError;
    if (weight || gender || height_feet || height_feet || height_inches || age || activity) return;
    const bmr = calculateBMR(form.values as any);
    const amr = calculateAMR({ bmr, activityLevel: form.values.activity as keyof typeof ACTIVITY_LEVEL });
    form.setValues({ bmr: Math.round(bmr), maintenances_calorie: Math.round(amr) });
  };

  const calculateIntake = () => {
    const calorieDeficitSurplusAmount = form.validateField("calorie_deficit_surplus_amount").hasError;
    const calorieDeficitSurplusType = form.validateField("calorie_deficit_surplus_type").hasError;
    const maintenancesCalorie = form.validateField("maintenances_calorie").hasError;
    const bmr = form.validateField("bmr").hasError;
    if (calorieDeficitSurplusAmount || calorieDeficitSurplusType || maintenancesCalorie || bmr) return;
    let calorieIntake = form.values.maintenances_calorie || 0;
    if (form.values.calorie_deficit_surplus_type == "deficit") {
      calorieIntake -= form.values.calorie_deficit_surplus_amount;
    } else {
      calorieIntake += form.values.calorie_deficit_surplus_amount;
    }
    form.setValues({ calorie_intake: calorieIntake });
  };

  const calculateAll = () => {
    if (form.validateField("calorie_intake").hasError) return false;
    if (form.values.protein_intake + form.values.fat_intake + form.values.carbohydrate_intake === 100) {
      setShowResult(true);
      return true;
    } else {
      showNotification({
        title: "Error",
        message: "Please select proper composition",
        color: "red",
      });
      return false;
    }
  };

  const formSubmit = async (values: any) => {
    let documentId;
    if (!user) return;
    if (!calculateAll()) return;
    setIsSaving(true);
    if (!chartId) {
      const data = await addDoc(collection(db, "users", user.id, "charts"), values);
      documentId = data.id;
    } else {
      documentId = chartId;
      await updateDoc(doc(db, "users", user.id, "charts", chartId), values);
    }
    setIsSaving(false);
    navigate("/chart/" + documentId);
  };

  return (
    <form onSubmit={form.onSubmit(formSubmit)}>
      <Title order={4}>Chart Info</Title>
      <Divider my="xs" />
      <TextInput size="xs" mb="xs" placeholder="eg. Bulk Chart" label="Name" withAsterisk {...form.getInputProps("name")} />
      <Textarea size="xs" mb="xs" placeholder="eg. something" label="Description" {...form.getInputProps("description")} />
      <Grid gutter="xs">
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            hideControls
            size="xs"
            step={0.5}
            placeholder="eg. 10"
            label="Weight (kg)"
            withAsterisk
            min={0}
            {...form.getInputProps("weight")}
            onChange={(e) => {
              resetBMRAndMC();
              form.getInputProps("weight").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <Select
            size="xs"
            withAsterisk
            label="Gender"
            placeholder="Pick one"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...form.getInputProps("gender")}
            onChange={(e) => {
              resetBMRAndMC();
              form.getInputProps("gender").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <div className="height-input-group">
            <NumberInput
              size="xs"
              step={1}
              placeholder="eg. 10"
              label="Height (feet)"
              withAsterisk
              min={2}
              {...form.getInputProps("height.feet")}
              onChange={(e) => {
                resetBMRAndMC();
                form.setFieldValue("height", { feet: e as any, inches: form.values.height.inches });
              }}
            />

            <NumberInput
              size="xs"
              step={1}
              placeholder="eg. 10"
              label="inches"
              withAsterisk
              max={10}
              min={0}
              {...form.getInputProps("height.inches")}
              onChange={(e) => {
                resetBMRAndMC();
                form.setFieldValue("height", { feet: form.values.height.feet, inches: e as any });
              }}
            />
          </div>
        </Grid.Col>

        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            size="xs"
            placeholder="eg. 10"
            label="Age (years)"
            withAsterisk
            min={0}
            {...form.getInputProps("age")}
            onChange={(e) => {
              resetBMRAndMC();
              form.getInputProps("age").onChange(e);
            }}
          />
        </Grid.Col>

        <Grid.Col span={{ sm: 6 }}>
          <Select
            size="xs"
            label="Activity"
            placeholder="Pick one"
            data={Object.entries(ACTIVITY_LEVEL).map((item) => ({
              value: item[0],
              label: item[1].label,
            }))}
            {...form.getInputProps("activity")}
            onChange={(e) => {
              resetBMRAndMC();
              form.getInputProps("activity").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <div className="height-input-group">
            <NumberInput hideControls size="xs" disabled placeholder="eg. 10" label="BMR" withAsterisk min={0} {...form.getInputProps("bmr")} />
            <NumberInput hideControls size="xs" disabled placeholder="eg. 10" label="Maintenances Calorie" withAsterisk min={0} {...form.getInputProps("maintenances_calorie")} />
            <ActionIcon size="sm" style={{ position: "absolute", right: 4, top: 29 }} type="button" onClick={calculateBMRAndMC} hidden={form.values.bmr ? true : false} color="blue" variant="filled">
              <IconCalculator size="1.125rem" />
            </ActionIcon>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <NumberInput
            size="xs"
            placeholder="eg. 10"
            label="Calorie Deficit/Surplus amount"
            withAsterisk
            min={0}
            step={50}
            {...form.getInputProps("calorie_deficit_surplus_amount")}
            onChange={(e) => {
              resetCalorieIntake();
              form.getInputProps("calorie_deficit_surplus_amount").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 2 }}>
          <Select
            size="xs"
            label="Type"
            placeholder="Pick one"
            data={[
              { value: "deficit", label: "Deficit" },
              { value: "surplus", label: "Surplus" },
            ]}
            {...form.getInputProps("calorie_deficit_surplus_type")}
            onChange={(e) => {
              resetCalorieIntake();
              form.getInputProps("calorie_deficit_surplus_type").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <div style={{ position: "relative" }}>
            <NumberInput hideControls size="xs" disabled placeholder="eg. 10" label="Intake Calorie" withAsterisk min={0} {...form.getInputProps("calorie_intake")} />
            <ActionIcon size="sm" style={{ position: "absolute", right: 4, top: 29 }} type="button" onClick={calculateIntake} hidden={form.values.bmr ? true : false} color="blue" variant="filled">
              <IconCalculator size="1.125rem" />
            </ActionIcon>
          </div>
        </Grid.Col>

        <Grid.Col span={{ sm: 4 }}>
          <div className={style.wrapper}>
            <NumberInput
              size="xs"
              label="Protein (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              classNames={{ input: style.input, label: style.label }}
              {...form.getInputProps("protein_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("protein_intake").onChange(e);
              }}
            />
            <Slider
              step={1}
              min={1}
              max={100}
              label={null}
              radius={0}
              size={4}
              className={style.slider}
              classNames={{ thumb: style.thumb, track: style.track }}
              {...form.getInputProps("protein_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("protein_intake").onChange(e);
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <div className={style.wrapper}>
            <NumberInput
              size="xs"
              label="Fat (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              classNames={{ input: style.input, label: style.label }}
              {...form.getInputProps("fat_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("fat_intake").onChange(e);
              }}
            />
            <Slider
              step={1}
              min={1}
              max={100}
              label={null}
              size={4}
              radius={0}
              className={style.slider}
              classNames={{ thumb: style.thumb, track: style.track }}
              {...form.getInputProps("fat_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("fat_intake").onChange(e);
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <div className={style.wrapper}>
            <NumberInput
              size="xs"
              label="Carbohydrate (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              classNames={{ input: style.input, label: style.label }}
              {...form.getInputProps("carbohydrate_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("carbohydrate_intake").onChange(e);
              }}
            />
            <Slider
              step={1}
              min={1}
              max={100}
              label={null}
              size={4}
              radius={0}
              className={style.slider}
              classNames={{ thumb: style.thumb, track: style.track }}
              {...form.getInputProps("carbohydrate_intake")}
              onChange={(e) => {
                setShowResult(false);
                form.getInputProps("carbohydrate_intake").onChange(e);
              }}
            />
          </div>
        </Grid.Col>
      </Grid>
      {data && showResult && (
        <Grid grow gutter="xs" mt="sm">
          <Grid.Col span={3}>
            <Paper bg="gray.0" p={6}>
              <Title order={6} mb={4} ta="center">
                Calories
              </Title>
              <Center>
                <Badge size="xs" variant="filled">
                  100%
                </Badge>
              </Center>
              <Text size="xs" ta="center" mt={4}>
                {form.values.calorie_intake}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper bg="gray.0" p={6}>
              <Title order={6} mb={4} ta="center">
                Protein
              </Title>
              <Center>
                <Badge size="xs" color="cyan" variant="filled">
                  {form.values.protein_intake}%
                </Badge>
              </Center>
              <Text size="xs" ta="center" mt={4}>
                {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper bg="gray.0" p={6}>
              <Title order={6} mb={4} ta="center">
                Fat
              </Title>
              <Center>
                <Badge size="xs" color="orange" variant="filled">
                  {form.values.fat_intake}%
                </Badge>
              </Center>
              <Text size="xs" ta="center" mt={4}>
                {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={3}>
            <Paper bg="gray.0" p={6}>
              <Title order={6} mb={4} ta="center">
                Carb
              </Title>
              <Center>
                <Badge size="xs" color="green" variant="filled">
                  {form.values.carbohydrate_intake}%
                </Badge>
              </Center>
              <Text size="xs" ta="center" mt={4}>
                {calToGm(calcPercentage(data.calorie_intake, form.values.carbohydrate_intake), "carbohydrates")}g
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="light" type="button" onClick={calculateAll}>
          Calculate
        </Button>
        <Button type="submit" loading={isSaving}>
          Save
        </Button>
      </Group>
    </form>
  );
};

export default Form;
