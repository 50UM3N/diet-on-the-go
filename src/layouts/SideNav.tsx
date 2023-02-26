import { Burger, Collapse, createStyles, Group, Image, Navbar, ScrollArea, Title } from "@mantine/core";
import { IconBuildingSkyscraper, IconChevronRight, IconHome, IconMeat } from "@tabler/icons-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import logo from "@/assets/logo.png";

const data: LinksData[] = [
    { link: "/", label: "Dashboard", exact: true, icon: IconHome },
    {
        link: "/food-items",
        label: "Food Items",
        icon: IconMeat,
    },
    {
        link: "/admin/add-hotel",
        label: "Test",
        icon: IconBuildingSkyscraper,
        links: [
            { link: "/hotel", label: "Hotel Search", access: ["admin"] },
            { link: "/car", label: "Car Search", access: ["admin"] },
        ],
    },
];

const useStyles = createStyles((theme, _params: { width: number }, getRef) => {
    const icon = getRef("icon");
    return {
        navbar: {
            borderRadius: theme.radius.md,
            border: "none",
            backgroundColor: theme.colors.blue[7],
            width: _params.width,
            top: 0,
            height: "100%",
            minHeight: "100%",
        },
        adminLogo: {
            width: "100%",
            maxWidth: 45,
        },
        adminTitle: {
            color: "white",
            fontSize: 24,
        },
        burger: {
            [theme.fn.largerThan("md")]: {
                display: "none",
            },
        },
        header: {
            paddingBottom: theme.spacing.md,
            marginBottom: theme.spacing.md * 1.5,
            borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },
        footer: {
            paddingTop: theme.spacing.md,
            marginTop: theme.spacing.md,
            borderTop: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        },

        link: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textDecoration: "none",
            fontSize: theme.fontSizes.sm,
            color: "white",
            padding: 8,
            borderRadius: theme.radius.sm,
            fontWeight: 500,

            "&:hover": {
                backgroundColor: theme.colors.blue[5],
                color: theme.colors.blue[1],
                [`& .${icon}`]: {
                    color: theme.colors.blue[1],
                },
            },
        },
        linkGroup: {
            display: "flex",
            alignItems: "center",
        },
        chevron: {
            transition: "transform 200ms ease",
        },

        linkIcon: {
            width: 20,
            height: 20,
            ref: icon,
            color: "white",
            marginRight: theme.spacing.sm,
        },

        linkActive: {
            "&, &:hover": {
                backgroundColor: theme.colors.blue[0],
                color: theme.colors.blue[9],
                [`& .${icon}`]: {
                    color: theme.colors.blue[9],
                },
            },
        },
        subLink: {
            fontWeight: 500,
            display: "block",
            textDecoration: "none",
            padding: `8px 10px`,
            paddingLeft: 16,
            marginLeft: 30,
            fontSize: theme.fontSizes.sm,
            color: "white",
            borderLeft: `1px solid white`,
            borderTopRightRadius: theme.radius.sm,
            borderBottomRightRadius: theme.radius.sm,
            borderTop: "1px solid " + theme.colors.blue[7],
            "&:hover": {
                backgroundColor: theme.colors.blue[5],
                color: theme.colors.blue[1],
            },
        },
        subLinkActive: {
            "&, &:hover": {
                backgroundColor: theme.colors.blue[4],
                color: "white",
                [`& .${icon}`]: {
                    color: theme.colors.blue[9],
                },
            },
        },
    };
});
interface props {
    width: number;
    setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
    navOpen: boolean;
}
const SideNav: React.FC<props> = ({ setNavOpen, navOpen, width }) => {
    const { classes, cx } = useStyles({ width });

    const links = data.map((item) => <LinkGroup key={item.label} link={item} classes={classes} cx={cx} />);

    return (
        <Navbar p="xs" className={classes.navbar}>
            <Navbar.Section mb={16} mt={10}>
                <Group align="center" position="apart">
                    <Group align="center" spacing={12}>
                        <Image src={logo} alt="logo" className={classes.adminLogo} />
                        <Title className={classes.adminTitle}>Dashboard</Title>
                    </Group>
                    <Burger color="white" className={classes.burger} opened={!navOpen} onClick={() => setNavOpen(!navOpen)} size="sm" />
                </Group>
            </Navbar.Section>
            <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
                {links}
            </Navbar.Section>
        </Navbar>
    );
};

export default SideNav;

const LinkGroup = ({ link, classes, cx }: { link: LinksData; classes: any; cx: (...args: any) => string }) => {
    const [opened, setOpened] = useState(false);
    const hasLinks = Array.isArray(link.links);

    return (
        <>
            {!hasLinks && (
                <NavLink
                    className={(navData) =>
                        cx(classes.link, {
                            [classes.linkActive]: navData.isActive,
                        })
                    }
                    to={link.link}
                    key={link.label}
                    end
                >
                    <div className={classes.linkGroup}>
                        <link.icon className={classes.linkIcon} />
                        <span>{link.label}</span>
                    </div>
                </NavLink>
            )}

            {hasLinks && (
                <>
                    <NavLink
                        className={(navData) =>
                            cx(classes.link, {
                                [classes.linkActive]: navData.isActive,
                            })
                        }
                        to={link.link}
                        onClick={(e) => {
                            e.preventDefault();
                            setOpened((o) => !o);
                        }}
                        key={link.label}
                    >
                        <div className={classes.linkGroup}>
                            <link.icon className={classes.linkIcon} />
                            <span>{link.label}</span>
                        </div>
                        <IconChevronRight
                            className={classes.chevron}
                            size={14}
                            style={{
                                transform: opened ? `rotate(90deg)` : "none",
                            }}
                        />
                    </NavLink>
                    <Collapse in={opened}>
                        {link.links &&
                            link.links.map((item) => (
                                <NavLink
                                    className={(navData) =>
                                        cx(classes.subLink, {
                                            [classes.subLinkActive]: navData.isActive,
                                        })
                                    }
                                    to={link.link + item.link}
                                    key={item.label}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                    </Collapse>
                </>
            )}
        </>
    );
};
