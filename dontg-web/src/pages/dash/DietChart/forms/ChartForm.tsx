import { ActionIcon, Button, Divider, Grid, Group, NumberInput, Select, Slider, TextInput, Textarea, Title } from "@mantine/core";
import { ACTIVITY_LEVEL } from "@/data/constant";
import { calToGm, calcPercentage, calculateAMR, calculateBMR, cmToInchFeet, inchFeetToCm } from "@/utils";
import { IconCalculator } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { ChartInfo, Gender, UpdateChartDTO } from "@/types/index.type";
import { useFormik } from "formik";
import { updateChartSchema } from "@/schema";
import { useUpdateChart } from "@/hooks/api/chart.hook";
import { useState } from "react";
import MacroCard from "@/components/MacroCard";

const ChartForm = ({ data }: { data: ChartInfo }) => {
  const [showResult, setShowResult] = useState(data.protein + data.fat + data.carb === 100);
  const [updateChart] = useUpdateChart();
  const form = useFormik<
    Omit<UpdateChartDTO, "height"> & {
      heightFeet: number;
      heightInches: number;
    }
  >({
    initialValues: {
      name: data?.name || "",
      description: data?.description || "",
      weight: data?.weight || 0,
      heightFeet: cmToInchFeet(data?.height || 0).feet,
      heightInches: cmToInchFeet(data?.height || 0).inch,
      gender: data?.gender || "",
      age: data?.age || 0,
      activityLevel: data?.activityLevel || 0,
      bmr: data?.bmr || 0,
      maintenanceCalories: data?.maintenanceCalories || 0,
      adjustAmount: data?.adjustAmount || 0,
      adjustType: data?.adjustType || "",
      intakeCalories: data?.intakeCalories || 0,
      protein: data?.protein || 50,
      fat: data?.fat || 25,
      carb: data?.carb || 25,
    },
    onSubmit: async (values) => {
      values.protein = Number(values.protein);
      values.fat = Number(values.fat);
      values.carb = Number(values.carb);
      values.weight = Number(values.weight);
      values.heightFeet = Number(values.heightFeet);
      values.heightInches = Number(values.heightInches);
      values.age = Number(values.age);
      values.activityLevel = Number(values.activityLevel);
      values.bmr = Number(values.bmr);
      values.maintenanceCalories = Number(values.maintenanceCalories);
      values.intakeCalories = Number(values.intakeCalories);
      values.adjustAmount = Number(values.adjustAmount);
      if (!calculateAll()) return;

      const dto: UpdateChartDTO = {
        name: values.name,
        description: values.description,
        height: inchFeetToCm(values.heightFeet, values.heightInches),
        weight: values.weight,
        gender: values.gender,
        age: values.age,
        activityLevel: values.activityLevel,
        bmr: values.bmr,
        maintenanceCalories: values.maintenanceCalories,
        adjustAmount: values.adjustAmount,
        adjustType: values.adjustType,
        intakeCalories: values.intakeCalories,
        protein: values.protein,
        fat: values.fat,
        carb: values.carb,
      };
      updateChart.mutate({ id: data.id, data: dto });
    },
    validationSchema: updateChartSchema,
  });
  const resetBMRAndMC = () => {
    form.handleChange("bmr")(String(0));
    form.handleChange("maintenanceCalories")(String(0));
    resetCalorieIntake();
  };

  const resetCalorieIntake = () => {
    form.handleChange("intakeCalories")(String(0));
  };

  const calculateBMRAndMC = async () => {
    form.setTouched({ weight: true, gender: true, heightFeet: true, heightInches: true, age: true, activityLevel: true });
    if (form.errors.weight || form.errors.gender || form.errors.heightFeet || form.errors.heightInches || form.errors.age || form.errors.activityLevel) return;
    const bmr = calculateBMR({
      weight: Number(form.values.weight),
      gender: form.values.gender as Gender,
      height: inchFeetToCm(Number(form.values.heightInches), Number(form.values.heightFeet)),
      age: Number(form.values.age),
    });
    const amr = calculateAMR({ bmr, activityLevel: Number(form.values.activityLevel) });
    form.handleChange("bmr")(String(Math.round(bmr)));
    form.handleChange("maintenanceCalories")(String(Math.round(amr)));
  };

  const calculateIntake = () => {
    form.setTouched({ adjustAmount: true, adjustType: true, maintenanceCalories: true, bmr: true });
    if (form.errors.adjustAmount || form.errors.adjustType || form.errors.maintenanceCalories || form.errors.bmr) return;
    let calorieIntake = Number(form.values.maintenanceCalories) || 0;
    if (form.values.adjustType == "deficit") {
      calorieIntake -= form.values.adjustAmount;
    } else {
      calorieIntake += form.values.adjustAmount;
    }
    form.handleChange("intakeCalories")(String(calorieIntake));
  };

  const calculateAll = () => {
    form.setTouched({
      intakeCalories: true,
    });
    if (form.errors.intakeCalories) return false;
    if (form.values.protein + form.values.fat + form.values.carb === 100) {
      setShowResult(true);
      return true;
    } else {
      notifications.show({
        title: "Error",
        message: "Please select proper composition",
        color: "red",
      });
      return false;
    }
  };

  return (
    <form onSubmit={form.handleSubmit}>
      <Title order={4}>Chart Info</Title>
      <Divider my="xs" />
      <TextInput
        mb="xs"
        placeholder="eg. Bulk Chart"
        label="Name"
        withAsterisk
        onBlur={form.handleBlur("name")}
        onChange={(e) => form.handleChange("name")(e)}
        value={form.values.name}
        error={form.touched.name && form.errors.name}
      />
      <Textarea
        mb="xs"
        placeholder="eg. something"
        label="Description"
        onBlur={form.handleBlur("description")}
        onChange={(e) => form.handleChange("description")(e)}
        value={form.values.description}
        error={form.touched.description && form.errors.description}
      />
      <Grid gutter="xs">
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            hideControls
            step={0.5}
            placeholder="eg. 10"
            label="Weight (kg)"
            withAsterisk
            min={0}
            onBlur={form.handleBlur("weight")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("weight")(String(e));
            }}
            value={form.values.weight}
            error={form.touched.weight && form.errors.weight}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <Select
            withAsterisk
            label="Gender"
            placeholder="Pick one"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            onBlur={form.handleBlur("gender")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("gender")(String(e));
            }}
            value={form.values.gender}
            error={form.touched.gender && form.errors.gender}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            step={1}
            placeholder="eg. 10"
            label="Height (feet)"
            withAsterisk
            min={2}
            onBlur={form.handleBlur("heightFeet")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("heightFeet")(String(e));
            }}
            value={form.values.heightFeet}
            error={form.touched.heightFeet && form.errors.heightFeet}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            step={1}
            placeholder="eg. 10"
            label="inches"
            withAsterisk
            max={10}
            min={0}
            onBlur={form.handleBlur("heightInches")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("heightInches")(String(e));
            }}
            value={form.values.heightInches}
            error={form.touched.heightInches && form.errors.heightInches}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            placeholder="eg. 10"
            label="Age (years)"
            withAsterisk
            min={0}
            onBlur={form.handleBlur("age")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("age")(String(e));
            }}
            value={form.values.age}
            error={form.touched.age && form.errors.age}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <Select
            label="Activity"
            placeholder="Pick one"
            data={Object.entries(ACTIVITY_LEVEL).map((item) => ({
              value: String(item[1].value),
              label: item[1].label,
            }))}
            onBlur={form.handleBlur("activityLevel")}
            onChange={(e) => {
              resetBMRAndMC();
              form.handleChange("activityLevel")(String(e));
            }}
            value={String(form.values.activityLevel)}
            error={form.touched.activityLevel && form.errors.activityLevel}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <NumberInput
            hideControls
            disabled
            placeholder="eg. 10"
            label="BMR"
            withAsterisk
            min={0}
            onBlur={form.handleBlur("bmr")}
            onChange={(e) => form.handleChange("bmr")(String(e))}
            value={form.values.bmr}
            error={form.touched.bmr && form.errors.bmr}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <div style={{ position: "relative" }}>
            <NumberInput
              hideControls
              disabled
              placeholder="eg. 10"
              label="Maintenances Calorie"
              withAsterisk
              min={0}
              onBlur={form.handleBlur("maintenanceCalories")}
              onChange={(e) => form.handleChange("maintenanceCalories")(String(e))}
              value={form.values.maintenanceCalories}
              error={form.touched.maintenanceCalories && form.errors.maintenanceCalories}
            />
            <ActionIcon size="md" style={{ position: "absolute", right: 4, top: 29 }} type="button" onClick={calculateBMRAndMC} hidden={form.values.bmr ? true : false} variant="filled">
              <IconCalculator size="1.125rem" />
            </ActionIcon>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <NumberInput
            placeholder="eg. 10"
            label="Deficit/Surplus amount"
            withAsterisk
            min={0}
            step={50}
            onBlur={form.handleBlur("adjustAmount")}
            onChange={(e) => {
              resetCalorieIntake();
              form.handleChange("adjustAmount")(String(e));
            }}
            value={form.values.adjustAmount}
            error={form.touched.adjustAmount && form.errors.adjustAmount}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 2 }}>
          <Select
            label="Type"
            placeholder="Pick one"
            data={[
              { value: "deficit", label: "Deficit" },
              { value: "surplus", label: "Surplus" },
            ]}
            onBlur={form.handleBlur("adjustType")}
            onChange={(e) => {
              resetCalorieIntake();
              form.handleChange("adjustType")(String(e));
            }}
            value={form.values.adjustType}
            error={form.touched.adjustType && form.errors.adjustType}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6 }}>
          <div style={{ position: "relative" }}>
            <NumberInput
              hideControls
              disabled
              placeholder="eg. 10"
              label="Intake Calorie"
              withAsterisk
              min={0}
              onBlur={form.handleBlur("intakeCalories")}
              onChange={(e) => form.handleChange("intakeCalories")(String(e))}
              value={form.values.intakeCalories}
              error={form.touched.intakeCalories && form.errors.intakeCalories}
            />
            <ActionIcon size="md" style={{ position: "absolute", right: 4, top: 29 }} type="button" onClick={calculateIntake} hidden={form.values.bmr ? true : false} variant="filled">
              <IconCalculator size="1.125rem" />
            </ActionIcon>
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <div>
            <NumberInput
              label="Protein (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              onBlur={form.handleBlur("protein")}
              onChange={(e) => form.handleChange("protein")(String(e))}
              value={form.values.protein}
              error={form.touched.protein && form.errors.protein}
            />
            <Slider step={1} min={1} max={100} label={null} onBlur={form.handleBlur("protein")} onChange={(e) => form.handleChange("protein")(String(e))} value={form.values.protein} />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <div>
            <NumberInput
              label="Fat (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              onBlur={form.handleBlur("fat")}
              onChange={(e) => form.handleChange("fat")(String(e))}
              value={form.values.fat}
              error={form.touched.fat && form.errors.fat}
            />
            <Slider step={1} min={1} max={100} label={null} onBlur={form.handleBlur("fat")} onChange={(e) => form.handleChange("fat")(String(e))} value={form.values.fat} />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 4 }}>
          <div>
            <NumberInput
              label="Carbohydrate (%)"
              step={1}
              min={1}
              max={100}
              hideControls
              onBlur={form.handleBlur("carb")}
              onChange={(e) => form.handleChange("carb")(String(e))}
              value={form.values.carb}
              error={form.touched.carb && form.errors.carb}
            />
            <Slider step={1} min={1} max={100} label={null} onBlur={form.handleBlur("carb")} onChange={(e) => form.handleChange("carb")(String(e))} value={form.values.carb} />
          </div>
        </Grid.Col>
      </Grid>
      {showResult && (
        <Grid grow gutter="xs" mt="sm">
          <Grid.Col span={3}>
            <MacroCard type="Calories" color="cyan" total={100} amount={form.values.intakeCalories} />
          </Grid.Col>
          <Grid.Col span={3}>
            <MacroCard type="Protein" color="green" total={form.values.protein} amount={calToGm(calcPercentage(data.intakeCalories, form.values.protein), "protein")} />
          </Grid.Col>
          <Grid.Col span={3}>
            <MacroCard type="Fat" color="orange" total={form.values.fat} amount={calToGm(calcPercentage(data.intakeCalories, form.values.fat), "fat")} />
          </Grid.Col>
          <Grid.Col span={3}>
            <MacroCard type="Carb" color="red" total={form.values.carb} amount={calToGm(calcPercentage(data.intakeCalories, form.values.carb), "carbohydrates")} />
          </Grid.Col>
        </Grid>
      )}
      <Group justify="flex-end" mt="md">
        <Button variant="light" type="button" onClick={calculateAll}>
          Calculate
        </Button>
        <Button type="submit" loading={updateChart.isLoading}>
          Save
        </Button>
      </Group>
    </form>
  );
};

export default ChartForm;
