import { RootState } from "@/store";
import { UserInfo } from "@/types/index.type";
import { ActionIcon, Burger, Group, Menu, Text, Title, UnstyledButton, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";
import { IconChevronDown, IconHome, IconLock, IconLogout, IconMoon, IconSun, IconUser } from "@tabler/icons-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./dashboard.module.scss";
import { logout } from "@/store/slices/userSlice";

const TopNav = ({ setNavOpen, navOpen, bottomNavOpen }: { setNavOpen: React.Dispatch<React.SetStateAction<boolean>>; navOpen: boolean; bottomNavOpen: boolean }) => {
  const user = useSelector<RootState, UserInfo | null>((state) => state.user.user);
  const dispatch = useDispatch();
  const logoutUser = async () => {
    dispatch(logout());
  };
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", { getInitialValueInEffect: true });

  return (
    <>
      <header className={classes.header} data-no-print>
        <div className={classes.inner}>
          <div>{!bottomNavOpen ? <Burger opened={navOpen} size="sm" onClick={() => setNavOpen((s) => !s)} /> : <Title order={3}>DONTG</Title>}</div>
          <Group>
            <Menu width={260} position="top-end" radius="lg" offset={20}>
              <Menu.Target>
                <UnstyledButton px={6} py={4} className={classes.user}>
                  <Group gap={7}>
                    <img width={20} height={20} style={{ borderRadius: "20px" }} src="/assets/profile.png" alt="profile " />
                    <Text
                      fw={500}
                      size="sm"
                      style={{
                        lineHeight: 1,
                      }}
                      mr={3}
                    >
                      {user?.name}
                    </Text>
                    <IconChevronDown size={12} />
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
                <Menu.Divider />
                <Menu.Item leftSection={<IconLogout size={14} />} onClick={logoutUser} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ActionIcon radius="md" onClick={() => setColorScheme(computedColorScheme === "light" ? "dark" : "light")} variant="default" aria-label="Toggle color scheme">
              {computedColorScheme === "light" && <IconSun size={16} stroke={1.5} />}
              {computedColorScheme !== "light" && <IconMoon size={16} stroke={1.5} />}
            </ActionIcon>
          </Group>
        </div>
      </header>
    </>
  );
};

export default TopNav;
