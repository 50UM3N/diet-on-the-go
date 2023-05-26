import { Burger, createStyles, Divider, Drawer, Group, Header, Menu, NavLink, Text, UnstyledButton } from "@mantine/core";
import { IconBuildingSkyscraper, IconChevronDown, IconHome, IconLock, IconLogout, IconMeat, IconUser } from "@tabler/icons-react";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink as NL } from "react-router-dom";
const useStyles = createStyles((theme, _param: { height: number }) => ({
    header: { border: "none", position: "sticky", top: "0px", zIndex: 20 },

    burger: {
        [theme.fn.largerThan("md")]: {
            display: "none",
        },
    },

    inner: {
        border: "1px solid",
        borderColor: theme.colors.gray[3],
        borderRadius: theme.radius.lg,
        paddingLeft: theme.spacing.xs,
        paddingRight: theme.spacing.xs,
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
        color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        "&:hover": {
            backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
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

const navLinks: LinksData[] = [
    { link: "/", label: "Dashboard", exact: true, icon: IconHome },
    {
        link: "/food-items",
        label: "Food Items",
        icon: IconMeat,
    },
    {
        link: "",
        label: "Diet Chart",
        icon: IconBuildingSkyscraper,
        links: [
            { link: "/", label: "All Charts", access: ["admin"] },
            { link: "/create", label: "Add New", access: ["admin"] },
        ],
    },
];

const TopNav = () => {
    const user = useSelector<RootState, User | null>((state) => state.user.user);
    const { classes, theme, cx } = useStyles({ height: 44 });
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const logoutUser = async () => {
        await signOut(getAuth());
    };
    const [menuOpen, setMenuOpen] = useState(false);
    const [active, setActive] = useState(0);
    return (
        <>
            <Drawer
                title="Menu"
                opened={menuOpen}
                onClose={() => setMenuOpen((s) => !s)}
                size={250}
                overlayProps={{ opacity: 0.5, blur: 4 }}
                padding={0}
            >
                <div style={{ marginTop: "1rem" }}>
                    {navLinks.map((item, i) => {
                        const Icon = item.icon;
                        if (item.links) {
                            return (
                                <NavLink
                                    active={i === active}
                                    variant="filled"
                                    key={i}
                                    label={item.label}
                                    icon={<Icon size="1rem" stroke={1.5} />}
                                    childrenOffset={28}
                                >
                                    {item.links.map((link, j) => (
                                        <NavLink
                                            onClick={() => {
                                                setActive(i);
                                                setMenuOpen(false);
                                            }}
                                            component={NL}
                                            to={link.link}
                                            key={j}
                                            label={link.label}
                                        />
                                    ))}
                                </NavLink>
                            );
                        } else {
                            return (
                                <NavLink
                                    icon={<Icon size="1rem" stroke={1.5} />}
                                    onClick={() => {
                                        setActive(i);
                                        setMenuOpen(false);
                                    }}
                                    component={NL}
                                    to={item.link}
                                    active={i === active}
                                    variant="filled"
                                    key={i}
                                    label={item.label}
                                />
                            );
                        }
                    })}
                </div>
            </Drawer>
            <Header height="auto" p="xs" className={classes.header} data-no-print>
                <div className={classes.inner}>
                    <Group>
                        <Burger opened={menuOpen} size="sm" onClick={() => setMenuOpen((s) => !s)} />
                    </Group>

                    <Group>
                        <Menu
                            width={260}
                            position="top-end"
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                        >
                            <Menu.Target>
                                <UnstyledButton
                                    px={6}
                                    py={4}
                                    className={cx(classes.user, {
                                        [classes.userActive]: userMenuOpened,
                                    })}
                                >
                                    <Group spacing={7}>
                                        <img width={20} height={20} style={{ borderRadius: "20px" }} src={user?.photoURL} alt="profile " />
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
                                <Menu.Item component={Link} to="/" icon={<IconHome size={14} />}>
                                    Home
                                </Menu.Item>
                                <Menu.Item component={Link} to="/profile" icon={<IconUser size={14} />}>
                                    Profile
                                </Menu.Item>
                                <Menu.Item component={Link} to="/change-password" icon={<IconLock size={14} />}>
                                    Change Password
                                </Menu.Item>
                                <Divider />
                                <Menu.Item icon={<IconLogout size={14} />} onClick={logoutUser}>
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </div>
            </Header>
        </>
    );
};

export default TopNav;
