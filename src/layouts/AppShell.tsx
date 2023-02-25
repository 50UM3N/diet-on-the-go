import { createStyles, Container, ScrollArea } from "@mantine/core";
import React, { useState } from "react";
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
            marginLeft: `${_params.mainGap}px !important`,
        },

        main: {
            margin: _params.mainGap,
            height: `calc(100% - ${_params.mainGap * 2}px)`,
            // height: "100%",
            transition: "margin 0.2s linear",
            [theme.fn.largerThan("md")]: {
                marginLeft: _params.sideBarWidth + _params.mainGap * 2,
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
            // borderRadius: theme.radius.md,
        },
        content: {
            height: `calc(100% - ${_params.topNavHeight}px)`,
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
                paddingTop:theme.spacing.xs,
                position: "relative",
                flex: 1,
            },
        },
    })
);

const AppShell: React.FC<any> = ({ children, footer = true }) => {
    const { classes, theme, cx } = useStyles({
        mainGap: MAIN_GAP,
        sideBarWidth: SIDEBAR_WIDTH,
        topNavHeight: TOPNAV_HEIGHT,
    });
    const [navOpen, setNavOpen] = useState(
        window.innerWidth <= theme.breakpoints.md ? true : false
    );
    return (
        <div className={classes.layout}>
            <aside
                className={cx(classes.sideBar, {
                    [classes.closeSideBar]: navOpen,
                })}
            >
                <SideNav
                    width={SIDEBAR_WIDTH}
                    navOpen={navOpen}
                    setNavOpen={setNavOpen}
                />
            </aside>
            <main
                className={cx(classes.main, {
                    [classes.closeSideBarMain]: navOpen,
                })}
            >
                <div className={classes.contentWrapper}>
                    <TopNav
                        height={TOPNAV_HEIGHT}
                        navOpen={navOpen}
                        setNavOpen={setNavOpen}
                    />
                    <Container fluid className={classes.content} m={0} p={0}>
                        <ScrollArea
                            className={classes.scrollArea}
                            mx={0}
                            px={0}
                            classNames={{
                                viewport: "sa-main-viewport",
                            }}
                        >
                            <main className="main-content">{children}</main>
                            {footer && <Footer />}
                        </ScrollArea>
                    </Container>
                </div>
            </main>
        </div>
    );
};

export default AppShell;
