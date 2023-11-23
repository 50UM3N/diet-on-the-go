import { theme } from "@/theme";
import { Burger, Divider, Drawer, Group, Menu, NavLink, Text, UnstyledButton } from "@mantine/core";
import { IconBuildingSkyscraper, IconChevronDown, IconHome, IconLock, IconLogout, IconMeat, IconUser } from "@tabler/icons-react";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { NavLink as NL } from "react-router-dom";

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
  const logoutUser = async () => {
    await signOut(getAuth());
  };
  const [menuOpen, setMenuOpen] = useState(false);

  const styles: Record<string, React.CSSProperties> = {
    header: { border: "none", position: "sticky", top: "0px", zIndex: 20, paddingInline: theme.spacing.xs, paddingTop: theme.spacing.xs },
    inner: {
      border: "1px solid",
      borderColor: theme.colors?.gray?.[3],
      borderRadius: theme?.radius?.lg,
      paddingLeft: theme?.spacing?.xs,
      paddingRight: theme?.spacing?.xs,
      height: 44,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "white",
    },
    user: {
      color: theme.white,
      padding: `8px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      transition: "background-color 100ms ease",
    },
  };
  return (
    <>
      <Drawer title="Menu" opened={menuOpen} onClose={() => setMenuOpen((s) => !s)} size={250} overlayProps={{ opacity: 0.5, blur: 4 }} padding={0}>
        <div>
          {navLinks.map((item, i) => {
            const Icon = item.icon;
            if (item.links) {
              return (
                <NavLink variant="subtle" key={i} label={item.label} leftSection={<Icon size="1rem" stroke={1.5} />} childrenOffset={28} defaultOpened>
                  {item.links.map((link, j) => (
                    <NavLink
                      onClick={() => {
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
                  leftSection={<Icon size="1rem" stroke={1.5} />}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                  component={NL}
                  to={item.link}
                  variant="subtle"
                  key={i}
                  label={item.label}
                />
              );
            }
          })}
        </div>
      </Drawer>
      <header style={styles.header} className="header" data-no-print>
        <div style={styles.inner}>
          <Group>
            <Burger opened={menuOpen} size="sm" onClick={() => setMenuOpen((s) => !s)} />
          </Group>

          <Group>
            <Menu width={260} position="top-end">
              <Menu.Target>
                <UnstyledButton px={6} py={4} style={styles.user}>
                  <Group gap={7}>
                    <img width={20} height={20} style={{ borderRadius: "20px" }} src={user?.photoURL} alt="profile " />
                    <Text
                      fw={500}
                      size="sm"
                      style={{
                        lineHeight: 1,
                        color: "black",
                      }}
                      mr={3}
                    >
                      {user?.name}
                    </Text>
                    <IconChevronDown size={12} color="black" />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item component={Link} to="/" leftSection={<IconHome size={14} />}>
                  Home
                </Menu.Item>
                <Menu.Item component={Link} to="/profile" leftSection={<IconUser size={14} />}>
                  Profile
                </Menu.Item>
                <Menu.Item component={Link} to="/change-password" leftSection={<IconLock size={14} />}>
                  Change Password
                </Menu.Item>
                <Divider />
                <Menu.Item leftSection={<IconLogout size={14} />} onClick={logoutUser}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </div>
      </header>
    </>
  );
};

export default TopNav;
