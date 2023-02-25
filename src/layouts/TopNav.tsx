import {
    Avatar,
    Burger,
    createStyles,
    Divider,
    Group,
    Header,
    Menu,
    Text,
    UnstyledButton,
} from "@mantine/core";
import {
    IconChevronDown,
    IconHome,
    IconLock,
    IconLogout,
    IconUser,
} from "@tabler/icons-react";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
const useStyles = createStyles((theme, _param: { height: number }) => ({
    header: {
        border: "1px solid",
        borderColor: theme.colors.gray[3],
        borderRadius: theme.radius.md,
        // borderTopLeftRadius: theme.radius.md,
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        position: "sticky",
        top: "0px",
        zIndex:20
    },

    burger: {
        [theme.fn.largerThan("md")]: {
            display: "none",
        },
    },

    inner: {
        height: _param.height,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    links: {
        [theme.fn.smallerThan("md")]: {
            display: "none",
        },
    },

    link: {
        display: "block",
        lineHeight: 1,
        padding: "8px 12px",
        borderRadius: theme.radius.sm,
        textDecoration: "none",
        color:
            theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor:
                theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
        },
    },
    // user menu

    user: {
        color: theme.white,
        padding: `8px ${theme.spacing.sm}px`,
        borderRadius: theme.radius.sm,
        transition: "background-color 100ms ease",

        "&:hover": {
            backgroundColor: theme.colors.gray[2],
        },
    },

    userActive: {
        backgroundColor: theme.colors.gray[2],
    },
}));
interface props {
    height: number;
    setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    navOpen: boolean;
}
const TopNav: React.FC<props> = ({ setNavOpen, navOpen, height }) => {
    const user = useSelector<RootState, User | null>(
        (state) => state.user.user
    );
    const { classes, theme, cx } = useStyles({ height });
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const logoutUser = async () => {
        await signOut(getAuth());
    };
    return (
        <Header height={height} px="xs" className={classes.header}>
            <div className={classes.inner}>
                <Group>
                    <Burger
                        opened={!navOpen}
                        onClick={() => setNavOpen(!navOpen)}
                        size="sm"
                    />
                    <div id="tt--breadcrumbs"></div>
                </Group>

                <Group>
                    <Menu
                        width={260}
                        position="top-end"
                        transition="pop-top-right"
                        onClose={() => setUserMenuOpened(false)}
                        onOpen={() => setUserMenuOpened(true)}
                    >
                        <Menu.Target>
                            <UnstyledButton
                                className={cx(classes.user, {
                                    [classes.userActive]: userMenuOpened,
                                })}
                            >
                                <Group spacing={7}>
                                    <img
                                        width={20}
                                        height={20}
                                        style={{ borderRadius: "20px" }}
                                        src={user?.photoURL}
                                    />
                                    <Text
                                        weight={500}
                                        size="sm"
                                        sx={{
                                            lineHeight: 1,
                                            color: theme.black,
                                        }}
                                        mr={3}
                                    >
                                        {user?.name}
                                    </Text>
                                    <IconChevronDown size={12} color="black" />
                                </Group>
                            </UnstyledButton>
                        </Menu.Target>
                        {/* <Menu.Item icon={<Settings size={14} />}>Account settings</Menu.Item> */}
                        <Menu.Dropdown>
                            <Menu.Item
                                component={Link}
                                to="/"
                                icon={<IconHome size={14} />}
                            >
                                Home
                            </Menu.Item>
                            <Menu.Item
                                component={Link}
                                to="/profile"
                                icon={<IconUser size={14} />}
                            >
                                Profile
                            </Menu.Item>
                            <Menu.Item
                                component={Link}
                                to="/change-password"
                                icon={<IconLock size={14} />}
                            >
                                Change Password
                            </Menu.Item>
                            <Divider />
                            <Menu.Item
                                icon={<IconLogout size={14} />}
                                onClick={logoutUser}
                            >
                                Logout
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </div>
        </Header>
    );
};

export default TopNav;
