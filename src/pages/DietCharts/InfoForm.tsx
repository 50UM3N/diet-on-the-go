import { db } from "@/firebase";
import {
    ActionIcon,
    Badge,
    Button,
    Center,
    Col,
    Divider,
    Grid,
    Group,
    LoadingOverlay,
    NumberInput,
    Paper,
    Select,
    Slider,
    Tabs,
    Text,
    TextInput,
    Textarea,
    Title,
    createStyles,
} from "@mantine/core";
import { UseFormReturnType, useForm } from "@mantine/form";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as DateFns from "date-fns";
import { ACTIVITY_LEVEL } from "@/data/constant";
import { calToGm, calcPercentage, calculateAMR, calculateBMR } from "@/utils";
import { IconCalculator } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import MealChart from "./MealChart";

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

const InfoForm = () => {
    const { chartId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState<DietChartData>();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [loading, setLoading] = useState(chartId ? true : false);
    const [isSaving, setIsSaving] = useState(false);
    const { classes } = useStyles();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showResult, setShowResult] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        if (!user) return;
        if (!chartId) {
            if (form) form.setValues(defaultValue);
            setData(undefined);
            return;
        }
        setLoading(true);
        const unsubscribe = onSnapshot(doc(db, "users", user.id, "charts", chartId), (snapshot) => {
            const data = snapshot.data() as any;
            if (!data) navigate("/");
            setData(data);
            setLoading(false);
        });

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, [chartId]);
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
                        <Form
                            form={form}
                            isSaving={isSaving}
                            setIsSaving={setIsSaving}
                            loading={loading}
                            data={data}
                            showResult={showResult}
                            setShowResult={setShowResult}
                        />
                    </Tabs.Panel>
                    <Tabs.Panel value="mealInfo">
                        <Data form={form} data={data} />
                    </Tabs.Panel>
                </Tabs>
            ) : (
                <Grid>
                    <Grid.Col md={6}>
                        <Form
                            form={form}
                            isSaving={isSaving}
                            setIsSaving={setIsSaving}
                            loading={loading}
                            data={data}
                            showResult={showResult}
                            setShowResult={setShowResult}
                        />
                    </Grid.Col>
                    <Grid.Col md={6}>
                        <Data form={form} data={data} />
                    </Grid.Col>
                </Grid>
            )}
        </>
    );
};

export default InfoForm;

const useStyles = createStyles((theme) => ({
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
        paddingLeft: theme.spacing.sm,
        paddingTop: (theme.spacing.sm as any) / 2,
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
        backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
    },
}));

const Form: React.FC<{
    form: UseFormReturnType<typeof defaultValue>;
    setShowResult: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSaving: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
    data: DietChartData | undefined;
    showResult: boolean;
    isSaving: boolean;
}> = ({ form, setShowResult, setIsSaving, data, loading, showResult, isSaving }) => {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const { chartId } = useParams();
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
        if (form.validateField("calorie_intake").hasError) return;
        if (form.values.protein_intake + form.values.fat_intake + form.values.carbohydrate_intake === 100) setShowResult(true);
        else {
            showNotification({
                title: "Error",
                message: "Please select proper composition",
                color: "red",
            });
        }
    };
    const formSubmit = async (values: any) => {
        let documentId;
        setIsSaving(true);
        if (!user) return;
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
<<<<<<< HEAD
        <>
            {windowWidth < 768 ? (
                <Tabs defaultValue="chartInfo">
                    <Tabs.List grow position="center" data-no-print>
                        <Tabs.Tab value="chartInfo">Chart Info</Tabs.Tab>
                        <Tabs.Tab disabled={!data} value="mealInfo">
                            Meal Info
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="chartInfo">
                        <form onSubmit={form.onSubmit(formSubmit)} style={{ marginTop: 16 }}>
                            <Paper style={{ position: "relative" }}>
                                <LoadingOverlay visible={loading} overlayBlur={2} />
                                <Title order={4}>Chart Info</Title>
                                <Divider my="xs" />

                                <TextInput mb="xs" placeholder="eg. Bulk Chart" label="Name" withAsterisk {...form.getInputProps("name")} />
                                <Textarea mb="xs" placeholder="eg. something" label="Description" {...form.getInputProps("description")} />
                                <Grid gutter="xs" mb="xs">
                                    <Col sm={3}>
                                        <NumberInput
                                            step={0.5}
                                            precision={1}
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
                                    </Col>
                                    <Col sm={3}>
                                        <Select
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
                                    </Col>
                                    <Col sm={3}>
                                        <div className="height-input-group">
                                            <NumberInput
                                                step={1}
                                                placeholder="eg. 10"
                                                label="Height (feet)"
                                                withAsterisk
                                                min={2}
                                                hideControls
                                                {...form.getInputProps("height.feet")}
                                                onChange={(e) => {
                                                    resetBMRAndMC();
                                                    form.setFieldValue("height", { feet: e as any, inches: form.values.height.inches });
                                                }}
                                            />

                                            <NumberInput
                                                step={1}
                                                placeholder="eg. 10"
                                                label="inches"
                                                withAsterisk
                                                max={11}
                                                min={0}
                                                hideControls
                                                {...form.getInputProps("height.inches")}
                                                onChange={(e) => {
                                                    resetBMRAndMC();
                                                    form.setFieldValue("height", { feet: form.values.height.feet, inches: e as any });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={3}>
                                        <NumberInput
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
                                    </Col>

                                    <Col sm={6}>
                                        <Select
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
                                    </Col>
                                    <Col sm={6}>
                                        <div className="height-input-group">
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="BMR"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("bmr")}
                                            />
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="Maintenances Calorie"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("maintenances_calorie")}
                                            />
                                            <ActionIcon
                                                style={{ position: "absolute", right: 4, top: 29 }}
                                                type="button"
                                                onClick={calculateBMRAndMC}
                                                hidden={form.values.bmr ? true : false}
                                                color="blue"
                                                variant="filled"
                                            >
                                                <IconCalculator size="1.125rem" />
                                            </ActionIcon>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <NumberInput
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
                                    </Col>
                                    <Col sm={2}>
                                        <Select
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
                                    </Col>
                                    <Col sm={6}>
                                        <div style={{ position: "relative" }}>
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="Intake Calorie"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("calorie_intake")}
                                            />
                                            <ActionIcon
                                                style={{ position: "absolute", right: 4, top: 29 }}
                                                type="button"
                                                onClick={calculateIntake}
                                                hidden={form.values.bmr ? true : false}
                                                color="blue"
                                                variant="filled"
                                            >
                                                <IconCalculator size="1.125rem" />
                                            </ActionIcon>
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily protein intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("protein_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("protein_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily fat intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("fat_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("fat_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily carbohydrate intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("carbohydrate_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("carbohydrate_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Grid>
                                {data && showResult && (
                                    <Grid grow gutter="xs">
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Calories
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" variant="filled">
                                                        100%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {form.values.calorie_intake}
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Protein
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="cyan" variant="filled">
                                                        {form.values.protein_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Fat
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="orange" variant="filled">
                                                        {form.values.fat_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Carb
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="green" variant="filled">
                                                        {form.values.carbohydrate_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(
                                                        calcPercentage(data.calorie_intake, form.values.carbohydrate_intake),
                                                        "carbohydrates"
                                                    )}
                                                    g
                                                </Text>
                                            </Paper>
                                        </Col>
                                    </Grid>
                                )}
                                <Group position="right" mt="md">
                                    <Button variant="light" type="button" onClick={calculateAll}>
                                        Calculate
                                    </Button>
                                    <Button type="submit" loading={isSaving}>
                                        Save
                                    </Button>
                                </Group>
                            </Paper>
                        </form>
                    </Tabs.Panel>
                    <Tabs.Panel value="mealInfo">
                        {data && (
                            <>
                                <Grid grow gutter="xs" mt="sm">
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Calories
                                            </Title>
                                            <Center>
                                                <Badge size="xs" variant="filled">
                                                    100%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {form.values.calorie_intake}
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Protein
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="cyan" variant="filled">
                                                    {form.values.protein_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Fat
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="orange" variant="filled">
                                                    {form.values.fat_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Carb
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="green" variant="filled">
                                                    {form.values.carbohydrate_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(
                                                    calcPercentage(data.calorie_intake, form.values.carbohydrate_intake),
                                                    "carbohydrates"
                                                )}
                                                g
                                            </Text>
                                        </Paper>
                                    </Col>
                                </Grid>
                                <MealChart data={data} />
                            </>
                        )}
                    </Tabs.Panel>
                </Tabs>
            ) : (
                <Grid>
                    <Grid.Col md={6}>
                        <form onSubmit={form.onSubmit(formSubmit)} style={{ marginTop: 16 }}>
                            <Paper style={{ position: "relative" }}>
                                <LoadingOverlay visible={loading} overlayBlur={2} />
                                <Title order={4}>Chart Info</Title>
                                <Divider my="xs" />

                                <TextInput mb="xs" placeholder="eg. Bulk Chart" label="Name" withAsterisk {...form.getInputProps("name")} />
                                <Textarea mb="xs" placeholder="eg. something" label="Description" {...form.getInputProps("description")} />
                                <Grid gutter="xs" mb="xs">
                                    <Col sm={3}>
                                        <NumberInput
                                            step={0.5}
                                            precision={1}
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
                                    </Col>
                                    <Col sm={3}>
                                        <Select
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
                                    </Col>
                                    <Col sm={3}>
                                        <div className="height-input-group">
                                            <NumberInput
                                                step={1}
                                                placeholder="eg. 10"
                                                label="Height (feet)"
                                                withAsterisk
                                                min={2}
                                                hideControls
                                                {...form.getInputProps("height.feet")}
                                                onChange={(e) => {
                                                    resetBMRAndMC();
                                                    form.setFieldValue("height", { feet: e as any, inches: form.values.height.inches });
                                                }}
                                            />

                                            <NumberInput
                                                step={1}
                                                placeholder="eg. 10"
                                                label="inches"
                                                withAsterisk
                                                max={10}
                                                min={0}
                                                hideControls
                                                {...form.getInputProps("height.inches")}
                                                onChange={(e) => {
                                                    resetBMRAndMC();
                                                    form.setFieldValue("height", { feet: form.values.height.feet, inches: e as any });
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    <Col sm={3}>
                                        <NumberInput
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
                                    </Col>

                                    <Col sm={6}>
                                        <Select
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
                                    </Col>
                                    <Col sm={6}>
                                        <div className="height-input-group">
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="BMR"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("bmr")}
                                            />
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="Maintenances Calorie"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("maintenances_calorie")}
                                            />
                                            <ActionIcon
                                                style={{ position: "absolute", right: 4, top: 29 }}
                                                type="button"
                                                onClick={calculateBMRAndMC}
                                                hidden={form.values.bmr ? true : false}
                                                color="blue"
                                                variant="filled"
                                            >
                                                <IconCalculator size="1.125rem" />
                                            </ActionIcon>
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <NumberInput
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
                                    </Col>
                                    <Col sm={2}>
                                        <Select
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
                                    </Col>
                                    <Col sm={6}>
                                        <div style={{ position: "relative" }}>
                                            <NumberInput
                                                disabled
                                                placeholder="eg. 10"
                                                label="Intake Calorie"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("calorie_intake")}
                                            />
                                            <ActionIcon
                                                style={{ position: "absolute", right: 4, top: 29 }}
                                                type="button"
                                                onClick={calculateIntake}
                                                hidden={form.values.bmr ? true : false}
                                                color="blue"
                                                variant="filled"
                                            >
                                                <IconCalculator size="1.125rem" />
                                            </ActionIcon>
                                        </div>
                                    </Col>

                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily protein intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("protein_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("protein_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily fat intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("fat_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("fat_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                    <Col sm={4}>
                                        <div className={classes.wrapper}>
                                            <NumberInput
                                                label="Your daily carbohydrate intake (%)"
                                                step={1}
                                                min={1}
                                                max={100}
                                                hideControls
                                                classNames={{ input: classes.input, label: classes.label }}
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
                                                className={classes.slider}
                                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                                {...form.getInputProps("carbohydrate_intake")}
                                                onChange={(e) => {
                                                    setShowResult(false);
                                                    form.getInputProps("carbohydrate_intake").onChange(e);
                                                }}
                                            />
                                        </div>
                                    </Col>
                                </Grid>
                                {data && showResult && (
                                    <Grid grow gutter="xs">
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Calories
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" variant="filled">
                                                        100%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {form.values.calorie_intake}
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Protein
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="cyan" variant="filled">
                                                        {form.values.protein_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Fat
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="orange" variant="filled">
                                                        {form.values.fat_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                                                </Text>
                                            </Paper>
                                        </Col>
                                        <Col span={3}>
                                            <Paper bg="gray.0" p={6}>
                                                <Title order={6} mb={4} align="center">
                                                    Carb
                                                </Title>
                                                <Center>
                                                    <Badge size="xs" color="green" variant="filled">
                                                        {form.values.carbohydrate_intake}%
                                                    </Badge>
                                                </Center>
                                                <Text size="xs" align="center" mt={4}>
                                                    {calToGm(
                                                        calcPercentage(data.calorie_intake, form.values.carbohydrate_intake),
                                                        "carbohydrates"
                                                    )}
                                                    g
                                                </Text>
                                            </Paper>
                                        </Col>
                                    </Grid>
                                )}
                                <Group position="right" mt="md">
                                    <Button variant="light" type="button" onClick={calculateAll}>
                                        Calculate
                                    </Button>
                                    <Button type="submit" loading={isSaving}>
                                        Save
                                    </Button>
                                </Group>
                            </Paper>
                        </form>
                    </Grid.Col>
                    <Grid.Col md={6}>
                        {data && (
                            <>
                                <Grid grow gutter="xs" mt="sm">
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Calories
                                            </Title>
                                            <Center>
                                                <Badge size="xs" variant="filled">
                                                    100%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {form.values.calorie_intake}
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Protein
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="cyan" variant="filled">
                                                    {form.values.protein_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Fat
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="orange" variant="filled">
                                                    {form.values.fat_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                                            </Text>
                                        </Paper>
                                    </Col>
                                    <Col span={3}>
                                        <Paper bg="gray.0" p={6}>
                                            <Title order={6} mb={4} align="center">
                                                Carb
                                            </Title>
                                            <Center>
                                                <Badge size="xs" color="green" variant="filled">
                                                    {form.values.carbohydrate_intake}%
                                                </Badge>
                                            </Center>
                                            <Text size="xs" align="center" mt={4}>
                                                {calToGm(
                                                    calcPercentage(data.calorie_intake, form.values.carbohydrate_intake),
                                                    "carbohydrates"
                                                )}
                                                g
                                            </Text>
                                        </Paper>
                                    </Col>
                                </Grid>
                                <MealChart data={data} />
                            </>
                        )}
                    </Grid.Col>
                </Grid>
            )}
        </>
=======
        <form onSubmit={form.onSubmit(formSubmit)} style={{ marginTop: 16 }}>
            <Paper style={{ position: "relative" }}>
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <Title order={4}>Chart Info</Title>
                <Divider my="xs" />
                <TextInput mb="xs" placeholder="eg. Bulk Chart" label="Name" withAsterisk {...form.getInputProps("name")} />
                <Textarea mb="xs" placeholder="eg. something" label="Description" {...form.getInputProps("description")} />
                <Grid gutter="xs" mb="xs">
                    <Col sm={6}>
                        <NumberInput
                            step={0.5}
                            precision={1}
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
                    </Col>
                    <Col sm={6}>
                        <Select
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
                    </Col>
                    <Col sm={6}>
                        <div className="height-input-group">
                            <NumberInput
                                step={1}
                                placeholder="eg. 10"
                                label="Height (feet)"
                                withAsterisk
                                min={2}
                                hideControls
                                {...form.getInputProps("height.feet")}
                                onChange={(e) => {
                                    resetBMRAndMC();
                                    form.setFieldValue("height", { feet: e as any, inches: form.values.height.inches });
                                }}
                            />

                            <NumberInput
                                step={1}
                                placeholder="eg. 10"
                                label="inches"
                                withAsterisk
                                max={10}
                                min={0}
                                hideControls
                                {...form.getInputProps("height.inches")}
                                onChange={(e) => {
                                    resetBMRAndMC();
                                    form.setFieldValue("height", { feet: form.values.height.feet, inches: e as any });
                                }}
                            />
                        </div>
                    </Col>

                    <Col sm={6}>
                        <NumberInput
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
                    </Col>

                    <Col sm={6}>
                        <Select
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
                    </Col>
                    <Col sm={6}>
                        <div className="height-input-group">
                            <NumberInput disabled placeholder="eg. 10" label="BMR" withAsterisk min={0} {...form.getInputProps("bmr")} />
                            <NumberInput
                                disabled
                                placeholder="eg. 10"
                                label="Maintenances Calorie"
                                withAsterisk
                                min={0}
                                {...form.getInputProps("maintenances_calorie")}
                            />
                            <ActionIcon
                                style={{ position: "absolute", right: 4, top: 29 }}
                                type="button"
                                onClick={calculateBMRAndMC}
                                hidden={form.values.bmr ? true : false}
                                color="blue"
                                variant="filled"
                            >
                                <IconCalculator size="1.125rem" />
                            </ActionIcon>
                        </div>
                    </Col>
                    <Col sm={4}>
                        <NumberInput
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
                    </Col>
                    <Col sm={2}>
                        <Select
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
                    </Col>
                    <Col sm={6}>
                        <div style={{ position: "relative" }}>
                            <NumberInput
                                disabled
                                placeholder="eg. 10"
                                label="Intake Calorie"
                                withAsterisk
                                min={0}
                                {...form.getInputProps("calorie_intake")}
                            />
                            <ActionIcon
                                style={{ position: "absolute", right: 4, top: 29 }}
                                type="button"
                                onClick={calculateIntake}
                                hidden={form.values.bmr ? true : false}
                                color="blue"
                                variant="filled"
                            >
                                <IconCalculator size="1.125rem" />
                            </ActionIcon>
                        </div>
                    </Col>

                    <Col sm={4}>
                        <div className={classes.wrapper}>
                            <NumberInput
                                label="Your daily protein intake (%)"
                                step={1}
                                min={1}
                                max={100}
                                hideControls
                                classNames={{ input: classes.input, label: classes.label }}
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
                                className={classes.slider}
                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                {...form.getInputProps("protein_intake")}
                                onChange={(e) => {
                                    setShowResult(false);
                                    form.getInputProps("protein_intake").onChange(e);
                                }}
                            />
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className={classes.wrapper}>
                            <NumberInput
                                label="Your daily fat intake (%)"
                                step={1}
                                min={1}
                                max={100}
                                hideControls
                                classNames={{ input: classes.input, label: classes.label }}
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
                                className={classes.slider}
                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                {...form.getInputProps("fat_intake")}
                                onChange={(e) => {
                                    setShowResult(false);
                                    form.getInputProps("fat_intake").onChange(e);
                                }}
                            />
                        </div>
                    </Col>
                    <Col sm={4}>
                        <div className={classes.wrapper}>
                            <NumberInput
                                label="Your daily carbohydrate intake (%)"
                                step={1}
                                min={1}
                                max={100}
                                hideControls
                                classNames={{ input: classes.input, label: classes.label }}
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
                                className={classes.slider}
                                classNames={{ thumb: classes.thumb, track: classes.track }}
                                {...form.getInputProps("carbohydrate_intake")}
                                onChange={(e) => {
                                    setShowResult(false);
                                    form.getInputProps("carbohydrate_intake").onChange(e);
                                }}
                            />
                        </div>
                    </Col>
                </Grid>
                {data && showResult && (
                    <Grid grow gutter="xs">
                        <Col span={3}>
                            <Paper bg="gray.0" p={6}>
                                <Title order={6} mb={4} align="center">
                                    Calories
                                </Title>
                                <Center>
                                    <Badge size="xs" variant="filled">
                                        100%
                                    </Badge>
                                </Center>
                                <Text size="xs" align="center" mt={4}>
                                    {form.values.calorie_intake}
                                </Text>
                            </Paper>
                        </Col>
                        <Col span={3}>
                            <Paper bg="gray.0" p={6}>
                                <Title order={6} mb={4} align="center">
                                    Protein
                                </Title>
                                <Center>
                                    <Badge size="xs" color="cyan" variant="filled">
                                        {form.values.protein_intake}%
                                    </Badge>
                                </Center>
                                <Text size="xs" align="center" mt={4}>
                                    {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                                </Text>
                            </Paper>
                        </Col>
                        <Col span={3}>
                            <Paper bg="gray.0" p={6}>
                                <Title order={6} mb={4} align="center">
                                    Fat
                                </Title>
                                <Center>
                                    <Badge size="xs" color="orange" variant="filled">
                                        {form.values.fat_intake}%
                                    </Badge>
                                </Center>
                                <Text size="xs" align="center" mt={4}>
                                    {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                                </Text>
                            </Paper>
                        </Col>
                        <Col span={3}>
                            <Paper bg="gray.0" p={6}>
                                <Title order={6} mb={4} align="center">
                                    Carb
                                </Title>
                                <Center>
                                    <Badge size="xs" color="green" variant="filled">
                                        {form.values.carbohydrate_intake}%
                                    </Badge>
                                </Center>
                                <Text size="xs" align="center" mt={4}>
                                    {calToGm(calcPercentage(data.calorie_intake, form.values.carbohydrate_intake), "carbohydrates")}g
                                </Text>
                            </Paper>
                        </Col>
                    </Grid>
                )}
                <Group position="right" mt="md">
                    <Button variant="light" type="button" onClick={calculateAll}>
                        Calculate
                    </Button>
                    <Button type="submit" loading={isSaving}>
                        Save
                    </Button>
                </Group>
            </Paper>
        </form>
>>>>>>> c9edf62 (feat: update ui changes)
    );
};

const Data: React.FC<{
    data: DietChartData | undefined;
    form: UseFormReturnType<typeof defaultValue>;
}> = ({ data, form }) => {
    if (!data) return null;
    return (
        <>
            <Grid grow gutter="xs" mt="sm">
                <Col span={3}>
                    <Paper bg="gray.0" p={6}>
                        <Title order={6} mb={4} align="center">
                            Calories
                        </Title>
                        <Center>
                            <Badge size="xs" variant="filled">
                                100%
                            </Badge>
                        </Center>
                        <Text size="xs" align="center" mt={4}>
                            {form.values.calorie_intake}
                        </Text>
                    </Paper>
                </Col>
                <Col span={3}>
                    <Paper bg="gray.0" p={6}>
                        <Title order={6} mb={4} align="center">
                            Protein
                        </Title>
                        <Center>
                            <Badge size="xs" color="cyan" variant="filled">
                                {form.values.protein_intake}%
                            </Badge>
                        </Center>
                        <Text size="xs" align="center" mt={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                        </Text>
                    </Paper>
                </Col>
                <Col span={3}>
                    <Paper bg="gray.0" p={6}>
                        <Title order={6} mb={4} align="center">
                            Fat
                        </Title>
                        <Center>
                            <Badge size="xs" color="orange" variant="filled">
                                {form.values.fat_intake}%
                            </Badge>
                        </Center>
                        <Text size="xs" align="center" mt={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                        </Text>
                    </Paper>
                </Col>
                <Col span={3}>
                    <Paper bg="gray.0" p={6}>
                        <Title order={6} mb={4} align="center">
                            Carb
                        </Title>
                        <Center>
                            <Badge size="xs" color="green" variant="filled">
                                {form.values.carbohydrate_intake}%
                            </Badge>
                        </Center>
                        <Text size="xs" align="center" mt={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.carbohydrate_intake), "carbohydrates")}g
                        </Text>
                    </Paper>
                </Col>
            </Grid>
            <MealChart data={data} />
        </>
    );
};
