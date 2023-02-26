import { db } from "@/firebase";
import { updateUser } from "@/store/slices/userSlice";
import { createStyles, Container, ScrollArea, Modal, NumberInput, Grid, Col, Group, Button } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Footer from "./Footer";
import SideNav from "./SideNav";
import TopNav from "./TopNav";

const MAIN_GAP = 8,
    SIDEBAR_WIDTH = 250,
    TOPNAV_HEIGHT = 44;

const useStyles = createStyles(
    (
        theme,
        _params: {
            mainGap: number;
            sideBarWidth: number;
            topNavHeight: number;
        }
    ) => ({
        layout: {
            backgroundColor: theme.colors.gray[0],
            overflow: "hidden",
            position: "relative",
            height: "100%",
            width: "100%",
        },

        closeSideBarMain: {
            marginLeft: `${0}px !important`,
        },

        main: {
            height: `calc(100% - ${_params.mainGap}px)`,
            // height: "100%",
            transition: "margin 0.2s linear",
            [theme.fn.largerThan("md")]: {
                marginLeft: _params.sideBarWidth + _params.mainGap,
            },
        },

        closeSideBar: {
            left: `-${_params.sideBarWidth + _params.mainGap}px !important`,
        },

        sideBar: {
            paddingTop: _params.mainGap,
            paddingBottom: _params.mainGap,
            paddingLeft: _params.mainGap,
            height: "100%",
            transition: "all 0.2s linear",
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 200,
        },
        contentWrapper: {
            width: "100%",
            height: "100%",
            backgroundColor: theme.colors.gray[0],
        },
        content: {
            height: `calc(100% - ${_params.topNavHeight + _params.mainGap * 2 - 4}px)`, // 4 is the border-width
            overflow: "auto",
        },
        scrollArea: {
            height: "100%",
            ".sa-main-viewport > div": {
                minHeight: "100%",
                display: "flex !important",
                flexDirection: "column",
            },
            ".main-content": {
                position: "relative",
                flex: 1,
                overflow: "hidden",
            },
        },
    })
);

const AppShell: React.FC<any> = ({ children, footer = true }) => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const [openModal, setOpenModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    const form = useForm({
        initialValues: {
            dob: "",
            feet: 0,
            inches: 0,
            weight: 0,
        },

        validate: {
            dob: (value) => (value ? null : "Required"),
            feet: (value) => (value ? null : "Required"),
            inches: (value) => (value ? null : "Required"),
            weight: (value) => (value ? null : "Required"),
        },
    });

    const formSubmit = async (values: any) => {
        if (!user) return;
        setIsSaving(true);
        const data = {
            dob: values.dob,
            height: {
                feet: values.feet,
                inches: values.inches,
            },
            weight: values.weight,
        };
        await updateDoc(doc(db, "users", user.id), data);
        dispatch(updateUser({ ...data, dob: data.dob.toLocaleDateString() }));
        setIsSaving(false);
        setOpenModal(false);
        showNotification({
            title: "Success",
            message: "Successfully Update your information",
        });
    };

    const { classes, theme, cx } = useStyles({
        mainGap: MAIN_GAP,
        sideBarWidth: SIDEBAR_WIDTH,
        topNavHeight: TOPNAV_HEIGHT,
    });
    const [navOpen, setNavOpen] = useState(window.innerWidth <= theme.breakpoints.md ? true : false);
    useEffect(() => {
        if (!user?.weight) {
            setOpenModal(true);
        }
    }, [user]);
    const closeModal = () => {
        if (user?.weight) {
            setOpenModal(true);
        } else {
            showNotification({
                color: "red",
                title: "Set the information",
                message: "Please enter your information",
            });
        }
    };
    return (
        <div className={classes.layout}>
            <aside
                className={cx(classes.sideBar, {
                    [classes.closeSideBar]: navOpen,
                })}
            >
                <SideNav width={SIDEBAR_WIDTH} navOpen={navOpen} setNavOpen={setNavOpen} />
            </aside>
            <main
                className={cx(classes.main, {
                    [classes.closeSideBarMain]: navOpen,
                })}
            >
                <div className={classes.contentWrapper}>
                    <TopNav height={TOPNAV_HEIGHT} gap={MAIN_GAP} navOpen={navOpen} setNavOpen={setNavOpen} />
                    <Container fluid className={classes.content} m={0} px="xs">
                        <ScrollArea
                            className={classes.scrollArea}
                            mx="-xs"
                            px="xs"
                            classNames={{
                                viewport: "sa-main-viewport",
                            }}
                        >
                            <main className="main-content">{children}</main>
                            <Modal opened={openModal} onClose={closeModal} title={`Hi ${user?.name}. Fill your basic information`}>
                                <form onSubmit={form.onSubmit(formSubmit)}>
                                    <DatePicker
                                        size="xs"
                                        mb="xs"
                                        placeholder="Pick date"
                                        label="Event date"
                                        withAsterisk
                                        {...form.getInputProps("dob")}
                                    />
                                    <Grid gutter="xs" mb="xs">
                                        <Col span={6}>
                                            <NumberInput
                                                step={0.5}
                                                precision={1}
                                                size="xs"
                                                placeholder="eg. 10"
                                                label="Height (feet)"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("feet")}
                                            />
                                        </Col>
                                        <Col span={6}>
                                            <NumberInput
                                                step={0.5}
                                                precision={1}
                                                size="xs"
                                                placeholder="eg. 10"
                                                label="Height (inches)"
                                                withAsterisk
                                                min={0}
                                                {...form.getInputProps("inches")}
                                            />
                                        </Col>
                                    </Grid>
                                    <NumberInput
                                        mb="xs"
                                        step={0.5}
                                        precision={1}
                                        size="xs"
                                        placeholder="eg. 10"
                                        label="Weight (kg)"
                                        withAsterisk
                                        min={0}
                                        {...form.getInputProps("weight")}
                                    />

                                    <Group position="right" mt="md">
                                        <Button size="xs" type="submit" loading={isSaving}>
                                            Update
                                        </Button>
                                    </Group>
                                </form>
                            </Modal>

                            {footer && <Footer />}
                        </ScrollArea>
                    </Container>
                </div>
            </main>
        </div>
    );
};

export default AppShell;
