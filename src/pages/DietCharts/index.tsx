import {
    Col,
    Grid,
    Paper,
    Title,
    Textarea,
    TextInput,
    NumberInput,
    Select,
    Group,
    Button,
    Stepper,
    createStyles,
    Slider,
    Text,
    Badge,
    Center,
    LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as DateFns from "date-fns";
import { ACTIVITY_LEVEL } from "@/data/constant";
import { addDoc, collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { calcPercentage, calculateAMR, calculateBMR, calToGm } from "@/utils";
import { showNotification } from "@mantine/notifications";
import { useSearchParams } from "react-router-dom";
import MealChart from "./MealChart";

const DietCharts = () => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [data, setData] = useState<DietChartData>();
    const [searchParams] = useSearchParams();
    const chartId = searchParams.get("chart") || "";
    const [loading, setLoading] = useState(chartId ? true : false);
    const [active, setActive] = useState(0);
    const [highestStepVisited, setHighestStepVisited] = useState(active);
    const handleStepChange = (nextStep: number) => {
        const isOutOfBounds = nextStep > 3 || nextStep < 0;

        if (isOutOfBounds) {
            return;
        }

        setActive(nextStep);
        setHighestStepVisited((hSC) => Math.max(hSC, nextStep));
    };

    const shouldAllowSelectStep = (step: number) => highestStepVisited >= step && active !== step;

    const nextStep = () => handleStepChange(active + 1);
    const prevStep = () => handleStepChange(active - 1);

    useEffect(() => {
        if (!user) return;
        if (!chartId) return;
        setLoading(true);
        const unsubscribe = onSnapshot(doc(db, "users", user.id, "charts", chartId), (snapshot) => {
            const data = snapshot.data() as any;
            setData(data);
            setLoading(false);
            setActive(data.step || 0);
            setHighestStepVisited(data.step || 0);
            console.log("asasd")
        });
        return () => {
            unsubscribe();
        };
    }, [chartId]);
    return (
        <>
            <Grid gutter="xs">
                <Col md={6}>
                    <Paper style={{ position: "relative" }}>
                        <LoadingOverlay visible={loading} overlayBlur={2} />
                        <Title order={4} mb="md">
                            Create Your Diet Chart
                        </Title>

                        <Stepper active={active} onStepClick={setActive} breakpoint="sm" size="sm">
                            <Stepper.Step label="First step" description="Create an account" allowStepSelect={shouldAllowSelectStep(0)}>
                                <BasicForm onSuccess={nextStep} data={data} />
                            </Stepper.Step>
                            <Stepper.Step label="Second step" description="Verify email" allowStepSelect={shouldAllowSelectStep(1)}>
                                <MaintenancesCalorie onSuccess={nextStep} onPressBack={prevStep} data={data} />
                            </Stepper.Step>
                            <Stepper.Step label="Third step" description="Get full access" allowStepSelect={shouldAllowSelectStep(2)}>
                                <IntakeCalorie onSuccess={nextStep} onPressBack={prevStep} data={data} />
                            </Stepper.Step>
                            <Stepper.Step label="Fourth step" description="Get full access" allowStepSelect={shouldAllowSelectStep(3)}>
                                <Division onSuccess={nextStep} onPressBack={prevStep} data={data} />
                            </Stepper.Step>
                            <Stepper.Completed>Completed, click back button to get to previous step</Stepper.Completed>
                        </Stepper>
                    </Paper>
                    {data?.finish && <MealChart data={data} />}
                </Col>
            </Grid>
        </>
    );
};

export default DietCharts;

interface Forms<T = object> {
    data?: DietChartData;
    onSuccess: (params: T) => void;
    onPressBack?: () => void;
}

const BasicForm: React.FC<Forms> = ({ data, onSuccess, onPressBack }) => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
        },
        validate: {
            name: (value) => (value ? null : "Required"),
        },
    });
    useEffect(() => {
        const formInitialValues = {
            name: data?.name || "",
            description: data?.description || "",
        };
        form.setValues((old) => ({ ...old, ...formInitialValues }));
    }, [data]);
    const formSubmit = async (values: any) => {
        values.step = 0;
        values.finish = false;
        let documentId;
        setIsSaving(true);
        if (!user) return;
        if (!id) {
            const data = await addDoc(collection(db, "users", user.id, "charts"), values);
            documentId = data.id;
        } else {
            documentId = id;
            await updateDoc(doc(db, "users", user.id, "charts", id), values);
        }
        setIsSaving(false);
        onSuccess({});
        setSearchParams({ chart: documentId });
    };

    return (
        <form onSubmit={form.onSubmit(formSubmit)}>
            <TextInput mb="xs" size="xs" placeholder="eg. Bulk Chart" label="Name" withAsterisk {...form.getInputProps("name")} />
            <Textarea mb="xs" size="xs" placeholder="eg. something" label="Description" {...form.getInputProps("description")} />

            <Group position="right" mt="md">
                <Button size="xs" type="submit" loading={isSaving}>
                    Next
                </Button>
            </Group>
        </form>
    );
};

const MaintenancesCalorie: React.FC<Forms> = ({ data, onSuccess, onPressBack }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm({
        initialValues: {
            weight: 0,
            height: { inches: 0, feet: 0 },
            gender: "",
            age: 0,
            activity: "",
            bmr: 0,
            maintenances_calorie: 0,
        },
        validate: {
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
        },
    });

    useEffect(() => {
        // @ts-ignore
        const age = DateFns.differenceInYears(new Date(), new Date(user?.dob));

        let formInitialValues = {
            weight: user?.weight,
            height: user?.height,
            age,
        };
        if (data?.age) {
            formInitialValues = {
                ...data,
            };
        }

        form.setValues((old) => ({ ...old, ...formInitialValues }));
    }, [user, data]);

    const formSubmit = async (values: any) => {
        values.step = 1;
        values.finish = false;
        setIsSaving(true);
        if (!user) return;
        if (!id) return;
        await updateDoc(doc(db, "users", user.id, "charts", id), values);
        setIsSaving(false);
        onSuccess(values);
    };
    const resetBMRAndMC = () => {
        form.setValues({ bmr: 0, maintenances_calorie: 0 });
    };

    const calculate = () => {
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

    return (
        <form onSubmit={form.onSubmit(formSubmit)}>
            <Grid gutter="xs" mb="xs">
                <Col sm={3}>
                    <NumberInput
                        size="xs"
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
                        size="xs"
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
                            size="xs"
                            placeholder="eg. 10"
                            label="Height (feet)"
                            withAsterisk
                            min={2}
                            hideControls
                            {...form.getInputProps("height.feet")}
                            onChange={(e) => {
                                resetBMRAndMC();
                                form.getInputProps("height.feet").onChange(e);
                            }}
                        />

                        <NumberInput
                            step={1}
                            size="xs"
                            placeholder="eg. 10"
                            label="inches"
                            withAsterisk
                            max={10}
                            min={0}
                            hideControls
                            {...form.getInputProps("height.inches")}
                            onChange={(e) => {
                                resetBMRAndMC();
                                form.getInputProps("height.inches").onChange(e);
                            }}
                        />
                    </div>
                </Col>

                <Col sm={3}>
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
                </Col>

                <Col sm={6}>
                    <Select
                        size="xs"
                        label="Activity"
                        placeholder="Pick one"
                        data={Object.entries(ACTIVITY_LEVEL).map((item) => ({ value: item[0], label: item[1].label }))}
                        {...form.getInputProps("activity")}
                        onChange={(e) => {
                            resetBMRAndMC();
                            form.getInputProps("activity").onChange(e);
                        }}
                    />
                </Col>

                <Col sm={3}>
                    <NumberInput size="xs" disabled placeholder="eg. 10" label="BMR" withAsterisk min={0} {...form.getInputProps("bmr")} />
                </Col>
                <Col sm={3}>
                    <NumberInput
                        size="xs"
                        disabled
                        placeholder="eg. 10"
                        label="Maintenances Calorie"
                        withAsterisk
                        min={0}
                        {...form.getInputProps("maintenances_calorie")}
                    />
                </Col>
            </Grid>
            <Group position="right" mt="md">
                <Button size="xs" variant="outline" type="button" onClick={onPressBack}>
                    Back
                </Button>
                <Button size="xs" type="submit" loading={isSaving} hidden={!form.values.bmr}>
                    Next
                </Button>

                <Button size="xs" type="button" onClick={calculate} hidden={form.values.bmr ? true : false}>
                    Calculate
                </Button>
            </Group>
        </form>
    );
};

const IntakeCalorie: React.FC<Forms> = ({ data, onSuccess, onPressBack }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm({
        initialValues: {
            calorie_deficit_surplus_amount: 0,
            calorie_deficit_surplus_type: "",
            calorie_intake: 0,
        },
        validate: {
            calorie_deficit_surplus_amount: (value) => (value || value >= 0 ? null : "Required"),
            calorie_deficit_surplus_type: (value) => (value ? null : "Required"),
            calorie_intake: (value) => (value || value > 0 ? null : "Required"),
        },
    });
    useEffect(() => {
        if (data?.calorie_deficit_surplus_type) {
            const formInitialValues = {
                calorie_deficit_surplus_amount: data?.calorie_deficit_surplus_amount,
                calorie_deficit_surplus_type: data?.calorie_deficit_surplus_type,
                calorie_intake: data?.calorie_intake,
            };
            form.setValues((old) => ({ ...old, ...formInitialValues }));
        }
    }, [data]);

    const formSubmit = async (values: any) => {
        values.step = 2;
        values.finish = false;
        setIsSaving(true);
        if (!user) return;
        if (!id) return;
        await updateDoc(doc(db, "users", user.id, "charts", id), values);
        setIsSaving(false);
        onSuccess(values);
    };
    const calculate = () => {
        const calorieDeficitSurplusAmount = form.validateField("calorie_deficit_surplus_amount").hasError;
        const calorieDeficitSurplusType = form.validateField("calorie_deficit_surplus_type").hasError;
        if (calorieDeficitSurplusAmount || calorieDeficitSurplusType) return;
        let calorieIntake = data?.maintenances_calorie || 0;
        if (form.values.calorie_deficit_surplus_type == "deficit") {
            calorieIntake -= form.values.calorie_deficit_surplus_amount;
        } else {
            calorieIntake += form.values.calorie_deficit_surplus_amount;
        }
        form.setValues({ calorie_intake: calorieIntake });
    };
    const resetCalorieIntake = () => {
        form.setValues({ calorie_intake: 0 });
    };
    return (
        <>
            <form onSubmit={form.onSubmit(formSubmit)}>
                <Grid gutter="xs" mb="xs">
                    <Col sm={4}>
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
                    </Col>
                    <Col sm={2}>
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
                    </Col>
                    <Col sm={6}>
                        <NumberInput
                            size="xs"
                            disabled
                            placeholder="eg. 10"
                            label="Intake Calorie"
                            withAsterisk
                            min={0}
                            {...form.getInputProps("calorie_intake")}
                        />
                    </Col>
                </Grid>
                <Group position="right" mt="md">
                    <Group position="right" mt="md">
                        <Button size="xs" variant="outline" type="button" onClick={onPressBack}>
                            Back
                        </Button>
                        <Button size="xs" type="submit" loading={isSaving} hidden={!form.values.calorie_intake}>
                            Next
                        </Button>

                        <Button size="xs" type="button" onClick={calculate} hidden={form.values.calorie_intake ? true : false}>
                            Calculate
                        </Button>
                    </Group>
                </Group>
            </form>
        </>
    );
};

const Division: React.FC<Forms> = ({ data, onSuccess, onPressBack }) => {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("chart");
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [isSaving, setIsSaving] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const { classes } = useStyles();
    const form = useForm({
        initialValues: {
            protein_intake: 50,
            fat_intake: 25,
            carbohydrate_intake: 25,
        },
    });
    useEffect(() => {
        calculate();
    }, []);
    const formSubmit = async (values: any) => {
        values.step = 3;
        values.finish = true;
        setIsSaving(true);
        if (!user) return;
        if (!id) return;
        await updateDoc(doc(db, "users", user.id, "charts", id), values);
        setIsSaving(false);
        onSuccess(values);
    };

    const calculate = () => {
        if (form.values.protein_intake + form.values.fat_intake + form.values.carbohydrate_intake === 100) setShowResult(true);
        else {
            showNotification({
                title: "Error",
                message: "Please select proper composition",
                color: "red",
            });
        }
    };
    return (
        <form onSubmit={form.onSubmit(formSubmit)}>
            <Grid gutter="xs" mb="xs">
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
                <Group grow>
                    <Paper bg="gray.0" p="xs" radius="lg">
                        <Text size="xs" align="center">
                            Calories
                        </Text>
                        <Title order={5} align="center">
                            {data?.calorie_intake}
                        </Title>
                    </Paper>
                    <Paper bg="gray.0" p="xs" radius="lg">
                        <Text size="xs" align="center">
                            Protein
                        </Text>
                        <Title order={5} align="center" mb={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.protein_intake), "protein")}g
                        </Title>
                        <Center>
                            <Badge color="cyan" variant="filled">
                                {form.values.protein_intake}%
                            </Badge>
                        </Center>
                    </Paper>
                    <Paper bg="gray.0" p="xs" radius="lg">
                        <Text size="xs" align="center">
                            Fat
                        </Text>
                        <Title order={5} align="center" mb={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.fat_intake), "fat")}g
                        </Title>
                        <Center>
                            <Badge color="orange" variant="filled">
                                {form.values.fat_intake}%
                            </Badge>
                        </Center>
                    </Paper>
                    <Paper bg="gray.0" p="xs" radius="lg">
                        <Text size="xs" align="center">
                            Carbohydrates
                        </Text>
                        <Title order={5} align="center" mb={4}>
                            {calToGm(calcPercentage(data.calorie_intake, form.values.carbohydrate_intake), "carbohydrates")}g
                        </Title>
                        <Center>
                            <Badge color="green" variant="filled">
                                {form.values.carbohydrate_intake}%
                            </Badge>
                        </Center>
                    </Paper>
                </Group>
            )}

            <Group position="right" mt="md">
                <Group position="right" mt="md">
                    <Button size="xs" variant="outline" type="button" onClick={onPressBack}>
                        Back
                    </Button>
                    <Button size="xs" type="submit" loading={isSaving} hidden={!showResult}>
                        Next
                    </Button>

                    <Button size="xs" type="button" onClick={calculate} hidden={showResult}>
                        Calculate
                    </Button>
                </Group>
            </Group>
        </form>
    );
};

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
        paddingTop: theme.spacing.sm / 2,
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
